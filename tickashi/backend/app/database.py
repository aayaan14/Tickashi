from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Transaction pooler optimized settings
engine = create_engine(
    DATABASE_URL,
    # Minimal pool for transaction pooler
    pool_size=1,              # Single connection for serverless
    max_overflow=0,           # No overflow needed with pooler
    pool_pre_ping=False,      # Pooler handles connection health
    pool_recycle=-1,          # Let pooler handle connection lifecycle
    
    # Connection settings for transaction pooler
    connect_args={
        "connect_timeout": 15,
        "sslmode": "require",
        "application_name": "vercel-serverless"
    },
    
    # Optimize for serverless
    echo=False,               # Disable SQL logging in production
    future=True               # Use SQLAlchemy 2.0 style
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()