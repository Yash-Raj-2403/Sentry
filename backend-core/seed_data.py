import asyncio
import random
from datetime import datetime, timedelta, timezone
from sqlmodel import select
from passlib.context import CryptContext

# Import models to register them
from app.models.user import User
from app.models.incident import Incident
from app.db.session import async_session, init_db

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def seed_data():
    print("Seeding data...")
    try:
        await init_db()
        
        async with async_session() as session:
            # 1. Create a Test User
            result = await session.execute(select(User).where(User.email == "admin@sentry.com"))
            existing_user = result.scalars().first()
            
            if not existing_user:
                user = User(
                    email="admin@sentry.com",
                    full_name="Admin User",
                    hashed_password=get_password_hash("password123"), # Default password
                    is_active=True
                )
                session.add(user)
                print("Created user: admin@sentry.com / password123")
            else:
                print("User admin@sentry.com already exists.")

            # 2. Create Dummy Incidents
            # Check if we have many incidents
            result = await session.execute(select(Incident))
            existing_incidents = result.scalars().all()
            
            if len(existing_incidents) < 5:
                print("Creating dummy incidents...")
                
                statuses = ["new", "investigating", "resolved", "closed"]
                severities = ["low", "medium", "high", "critical"]
                titles = [
                    "Suspicious Login Attempt from Unknown IP",
                    "Potential SQL Injection on Login Page",
                    "Unusual Outbound Traffic to Known Malicious IP",
                    "Brute Force Attempt on SSH",
                    "Malware Signature Detected in File Upload",
                    "Privilege Escalation Attempt",
                    "Data Exfiltration Metrics Spike",
                    "DDOS Attack Initiated",
                    "Phishing Email Reported by User",
                    "Unauthorized API Access Attempt"
                ]
                
                new_incidents = []
                for i in range(15):
                    title = random.choice(titles)
                    severity = random.choice(severities)
                    status = random.choice(statuses)
                    
                    # Randomize time within last 7 days
                    days_ago = random.randint(0, 7)
                    created_at = datetime.now(timezone.utc) - timedelta(days=days_ago)
                    
                    incident = Incident(
                        title=f"{title} - {i+1}",
                        severity=severity,
                        status=status,
                        created_at=created_at,
                        description=f"Automated alert: {title}. Detected anomaly in system logs.",
                        attacker_ip=f"192.168.1.{random.randint(10, 250)}",
                        risk_score=round(random.uniform(0, 10), 1),
                        feedback=None
                    )
                    new_incidents.append(incident)
                
                session.add_all(new_incidents)
                print(f"Added {len(new_incidents)} dummy incidents.")
            else:
                print("Incidents already exist. Skipping creation.")

            # Commit changes
            await session.commit()
            print("Database seeded successfully!")
            
    except Exception as e:
        print(f"An error occurred during seeding: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(seed_data())
