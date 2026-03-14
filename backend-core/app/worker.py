import asyncio
import logging
import json
from app.db.session import init_db
from app.core.redis import get_redis_client
from redis.exceptions import ResponseError
from app.models.event import SecurityEvent
from app.agents.graph import app as agent_workflow

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

STREAM_KEY = "sentry:events"
GROUP_NAME = "sentry_group"
CONSUMER_NAME = "detection_worker_1"


class Worker:
    def __init__(self):
        self.redis = None

    async def setup_redis(self):
        self.redis = await get_redis_client()
        try:
            # Create consumer group (0 means start from beginning)
            await self.redis.xgroup_create(STREAM_KEY, GROUP_NAME, id="0", mkstream=True)
            logger.info(f"Created consumer group {GROUP_NAME}")
        except ResponseError as e:
            if "BUSYGROUP" in str(e):
                logger.info(f"Consumer group {GROUP_NAME} already exists")
            else:
                logger.error(f"Redis error creating group: {e}")

    async def run(self):
        """
        Background worker that pulls events, runs LangGraph, persists incidents
        to SQLite/Postgres, and stores incident embeddings in Supabase pgvector
        for future semantic recall by the InvestigationAgent.
        """
        await self.setup_redis()
        # Ensure DB tables exist
        await init_db()

        logger.info(f"Worker started, listening on {STREAM_KEY}...")

        while True:
            try:
                # Read from stream
                entries = await self.redis.xreadgroup(
                    GROUP_NAME,
                    CONSUMER_NAME,
                    {STREAM_KEY: ">"},
                    count=10,
                    block=2000
                )

                if not entries:
                    await asyncio.sleep(0.1)
                    continue

                for stream, messages in entries:
                    for message_id, data in messages:
                        try:
                            payload_str = data.get("payload")
                            if payload_str:
                                try:
                                    event_data = json.loads(payload_str)
                                    logger.info(
                                        f"Processing event: {event_data.get('event_type')}"
                                    )

                                    # Initialize Graph State
                                    initial_state = {
                                        "event_data": event_data,
                                        "incident": None,
                                        "investigation_log": [],
                                        "actions_queue": [],
                                        "risk_score": 0.0,
                                        "current_step": "start"
                                    }

                                    # Run the LangGraph
                                    result_state = await agent_workflow.ainvoke(
                                        initial_state
                                    )

                                    # ── Persistence ──────────────────────────
                                    incident_data = result_state.get("incident")
                                    if incident_data:
                                        from app.db.session import async_session
                                        from app.models.incident import Incident
                                        from app.models.actions import (
                                            InvestigationStep,
                                            ResponseAction,
                                        )

                                        async with async_session() as session:
                                            # Create new incident record
                                            new_incident = Incident(
                                                title=incident_data.get("title"),
                                                severity=incident_data.get("severity"),
                                                attacker_ip=incident_data.get("attacker_ip"),
                                                risk_score=incident_data.get("risk_score"),
                                                description=incident_data.get("description"),
                                                status="investigating"
                                            )
                                            session.add(new_incident)
                                            await session.commit()
                                            await session.refresh(new_incident)

                                            # Save Investigation Logs as Steps
                                            for idx, log in enumerate(
                                                result_state.get("investigation_log", [])
                                            ):
                                                step = InvestigationStep(
                                                    incident_id=new_incident.id,
                                                    step_number=idx + 1,
                                                    agent_name="System",
                                                    action_taken="Log Entry",
                                                    result=log,
                                                )
                                                session.add(step)

                                            # Save Response Actions
                                            for action_str in result_state.get(
                                                "actions_queue", []
                                            ):
                                                action = ResponseAction(
                                                    incident_id=new_incident.id,
                                                    action_type=action_str,
                                                    target=incident_data.get(
                                                        "attacker_ip", "unknown"
                                                    ),
                                                    status="executed",
                                                )
                                                session.add(action)

                                            await session.commit()
                                            logger.info(
                                                f"Persisted incident {new_incident.id} to DB"
                                            )

                                        # ── Vector Memory: store embedding ────
                                        # Enrich incident_data with the DB-assigned
                                        # id so the embedding row references it.
                                        incident_data["id"] = new_incident.id
                                        try:
                                            from app.services.vector_memory import (
                                                store_incident_embedding,
                                            )
                                            stored = await store_incident_embedding(
                                                incident=incident_data,
                                                investigation_log=result_state.get(
                                                    "investigation_log", []
                                                ),
                                            )
                                            if stored:
                                                logger.info(
                                                    f"[Worker] Embedding stored for "
                                                    f"incident {new_incident.id}"
                                                )
                                            else:
                                                logger.debug(
                                                    "[Worker] Embedding skipped "
                                                    "(Supabase/OpenAI not configured)"
                                                )
                                        except Exception as embed_err:
                                            logger.warning(
                                                f"[Worker] Embedding storage failed "
                                                f"(non-critical): {embed_err}"
                                            )

                                    logger.info(
                                        f"Graph execution finished. "
                                        f"Steps: {result_state.get('investigation_log')}"
                                    )

                                except json.JSONDecodeError:
                                    logger.warning(
                                        f"Invalid JSON payload: {payload_str}"
                                    )
                                except Exception as e:
                                    logger.error(f"Error in graph execution: {e}")

                            # Acknowledge
                            await self.redis.xack(STREAM_KEY, GROUP_NAME, message_id)

                        except Exception as e:
                            logger.error(
                                f"Error processing message {message_id}: {e}"
                            )

            except Exception as e:
                logger.error(f"Worker main loop error: {e}")
                await asyncio.sleep(5)


if __name__ == "__main__":
    worker = Worker()
    asyncio.run(worker.run())
