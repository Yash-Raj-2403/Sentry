from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Determine if we are using SQLite or PostgreSQL
DATABASE_URL = settings.DATABASE_URL
IS_SQLITE = "sqlite" in DATABASE_URL

if IS_SQLITE:
    # Use aiosqlite for async SQLite
    DATABASE_URL = DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://")
    connect_args = {"check_same_thread": False}
else:
    # Use asyncpg for PostgreSQL
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    connect_args = {}

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)

# Create session factory
async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

async def get_session() -> AsyncSession:
    """Dependency for getting async database session"""
    async with async_session() as session:
        yield session

async def init_db():
    """Create tables (for dev/MVP)"""
    async with engine.begin() as conn:
        # await conn.run_sync(SQLModel.metadata.drop_all) # Dangerous: only for reset
        await conn.run_sync(SQLModel.metadata.create_all)
