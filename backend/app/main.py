import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Resolve project paths deterministically
ROOT_DIR = Path(__file__).resolve().parents[2]   # .../TodoAppAZNext
BACKEND_DIR = Path(__file__).resolve().parents[1] # .../TodoAppAZNext/backend

# Load .env from both places (root first, backend second without override)
load_dotenv(ROOT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env", override=False)

APP_ENV = os.getenv("APP_ENV", "dev")
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = {
    "dev":  os.getenv("MONGO_DB_NAME_DEV",  "TodoAppAZNext_dev"),
    "test": os.getenv("MONGO_DB_NAME_TEST", "TodoAppAZNext_test"),
    "prod": os.getenv("MONGO_DB_NAME_PROD", "TodoAppAZNext"),
}.get(APP_ENV, "TodoAppAZNext_dev")

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI not set. Put it in one of:\n"
        f" - {ROOT_DIR / '.env'}\n"
        f" - {BACKEND_DIR / '.env'}\n"
        "Or start uvicorn with --env-file or set $env:MONGO_URI in the shell."
    )

if APP_ENV == "prod" and os.getenv("ALLOW_PROD") != "1":
    raise RuntimeError("Refusing to start in prod without ALLOW_PROD=1")

print(f"Connected to DB: {DB_NAME} (env={APP_ENV})")

# Global variables for health checks
client = None
database = None
    
# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context manager for startup/shutdown"""
    # Startup
    await init_database()
    yield
    # Shutdown (cleanup if needed)
    global client
    if client:
        client.close()

# Create the FastAPI app with lifespan
app = FastAPI(
    title="TodoAppAZNext API",
    description="A task tracking app for AI-assisted development course",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later if you do cookies
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def init_database():
    """Initialize the database connection and Beanie ODM"""
    global client, database
    client = AsyncIOMotorClient(MONGO_URI)
    database = client[DB_NAME]
    
    # Import document models
    from .models.task import Task
    from .models.user import User
    
    # Initialize Beanie with our document models
    await init_beanie(database=database, document_models=[Task, User])
    print(f"Database initialized with Beanie ODM! Environment: {APP_ENV}, Database: {DB_NAME}")

# Startup is now handled by lifespan context manager above

# Import and mount routers AFTER env + db are ready
from .routes import tasks_routes, auth, labels  # Renamed tasks to tasks_routes  # noqa: E402

app.include_router(tasks_routes.router, prefix="/tasks", tags=["tasks"])
app.include_router(auth.router, prefix="/auth")
# app.include_router(labels.router,prefix="/labels",tags=["labels"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running smoothly!"}

@app.get("/db-test")
async def db_test():
    """Test database connection"""
    if client is None or database is None:
        return {"status": "error", "message": "Database not initialized"}
    
    # Test the connection
    await client.admin.command("ping")
    collections = await database.list_collection_names()
    
    return {
        "status": "success", 
        "environment": APP_ENV,
        "database": database.name, 
        "collections": collections
    }

@app.get("/test-db-health")
async def test_db_health():
    """Test database health check specifically for test environment 🐉"""
    if APP_ENV != "test":
        raise HTTPException(status_code=403, detail="This endpoint is only available in test environment")
    
    if client is None or database is None:
        return {"status": "error", "message": "Test database not initialized"}
    
    try:
        # Test the connection
        await client.admin.command("ping")
        collections = await database.list_collection_names()
        
        # Count documents in each collection for test verification
        collection_stats = {}
        for collection_name in collections:
            collection = database[collection_name]
            count = await collection.count_documents({})
            collection_stats[collection_name] = count
        
        return {
            "status": "success",
            "message": "Test database is healthy and ready for testing",
            "environment": APP_ENV,
            "database": database.name,
            "collections": collections,
            "collection_stats": collection_stats,
            "can_drop_safely": True  # Indicates this is a test DB that can be dropped
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Test database health check failed: {str(e)}",
            "environment": APP_ENV,
            "database": database.name if database else "unknown"
        }
