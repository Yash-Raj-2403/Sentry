"""
DecisionAgent: Calculates final risk score and decides on response actions.

Weight-aware risk formula (v2):
  final_risk = anomaly_score * velocity_multiplier * criticality_multiplier
             * anomaly_weight  (learned from admin feedback)

Weights are loaded lazily from the database once per agent lifetime and
refreshed on every invocation so that feedback applied by an admin takes
effect on the *next* event without restarting the process.
"""

from typing import Dict, Any, Optional
import logging
from datetime import datetime, timezone

from app.agents.state import AgentState

logger = logging.getLogger(__name__)


# Default (untrained) weights – mirror the DecisionWeight model defaults
_DEFAULT_ANOMALY_WEIGHT = 1.0
_DEFAULT_VELOCITY_WEIGHT = 1.5  # same as the hard-coded 1.5 in the original code
_DEFAULT_CRITICALITY_WEIGHT = 1.0


class DecisionAgent:
    """
    Calculates final risk score and decides on response actions.

    Risk Formula
    ────────────
    final_risk = clamp(
        anomaly_score
        * velocity_multiplier        ← 1.0 or learned velocity_weight (if burst)
        * asset_criticality          ← static 1.0 for MVP
        * anomaly_weight,            ← learned from admin FP/TP feedback
    0.0, 1.0)

    The `anomaly_weight` and `velocity_weight` are persisted in the
    `decision_weights` table and updated by FeedbackService whenever an
    admin submits a False Positive or True Positive flag.
    """

    def __init__(self):
        # Cached weights – refreshed on each decide() call so DB updates are
        # picked up without restarting the process.
        self._anomaly_weight: float = _DEFAULT_ANOMALY_WEIGHT
        self._velocity_weight: float = _DEFAULT_VELOCITY_WEIGHT
        self._criticality_weight: float = _DEFAULT_CRITICALITY_WEIGHT
        self._weights_loaded_at: Optional[datetime] = None

    async def _refresh_weights(self):
        """
        Pull current weights from the DB.
        Falls back to defaults gracefully if DB is unavailable or the
        weights row doesn't exist yet (e.g., before any feedback is given).
        """
        try:
            from app.db.session import async_session
            from app.services.feedback_service import get_current_weights

            async with async_session() as session:
                weights = await get_current_weights(session)
                self._anomaly_weight = weights.anomaly_weight
                self._velocity_weight = weights.velocity_weight
                self._criticality_weight = weights.criticality_weight
                self._weights_loaded_at = datetime.now(timezone.utc)

            logger.debug(
                f"[DecisionAgent] Loaded weights: anomaly={self._anomaly_weight:.4f} "
                f"velocity={self._velocity_weight:.4f} "
                f"criticality={self._criticality_weight:.4f}"
            )
        except Exception as e:
            logger.warning(
                f"[DecisionAgent] Could not load weights from DB (using defaults): {e}"
            )

    async def decide(self, state: Dict) -> Dict:
        try:
            # ── Refresh learned weights from DB on every call ──────────────
            await self._refresh_weights()

            investigation_log = state.get("investigation_log", [])
            actions_queue = state.get("actions_queue", [])

            anomaly_score = state.get("risk_score", 0.0)   # Base anomaly from DetectionAgent

            # ── Velocity multiplier ────────────────────────────────────────
            # Use learned velocity_weight when burst traffic is detected;
            # otherwise fall back to 1.0 (no velocity amplification).
            if any("Burst" in log for log in investigation_log):
                attack_velocity = self._velocity_weight
                investigation_log.append(
                    f"DECISION: Burst traffic detected – applying learned "
                    f"velocity weight ({self._velocity_weight:.4f})"
                )
            else:
                attack_velocity = 1.0

            asset_criticality = self._criticality_weight

            # ── Apply learned anomaly weight ───────────────────────────────
            final_risk = min(
                1.0,
                anomaly_score * attack_velocity * asset_criticality * self._anomaly_weight
            )

            investigation_log.append(
                f"DECISION: Risk Formula → "
                f"{anomaly_score:.4f} (anomaly) "
                f"× {attack_velocity:.4f} (velocity) "
                f"× {asset_criticality:.4f} (criticality) "
                f"× {self._anomaly_weight:.4f} (learned weight) "
                f"= {final_risk:.4f}"
            )

            # ── Action thresholds ──────────────────────────────────────────
            if final_risk > 0.8:
                action = "isolate_host"
                investigation_log.append(
                    "DECISION: CRITICAL RISK. Recommending host isolation."
                )
            elif final_risk > 0.5:
                action = "block_ip"
                investigation_log.append(
                    f"DECISION: HIGH RISK. Recommending IP block for "
                    f"{state.get('incident', {}).get('attacker_ip')}"
                )
            else:
                action = "monitor"
                investigation_log.append("DECISION: LOW RISK. Continuing to monitor.")

            if action != "monitor":
                actions_queue.append(action)

            state["risk_score"] = final_risk
            state["actions_queue"] = actions_queue
            state["investigation_log"] = investigation_log
            state["current_step"] = "response" if actions_queue else "end"

            return state

        except Exception as e:
            logger.error(f"Decision error: {e}")
            return state
