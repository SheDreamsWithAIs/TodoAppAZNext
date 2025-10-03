from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
    
# Create the FastAPI app
app = FastAPI(
    title="TodoAppAZNext API",
    description="A task tracking app for AI-assisted development course",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later if you do cookies
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization with Beanie 🐉
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set. Put it in .env (repo root or backend).")

# Global client variable for health checks
client = None

async def init_database():
    """Initialize the database connection and Beanie ODM 🐉"""
    global client
    client = AsyncIOMotorClient(MONGO_URI)
    database = client["TodoAppAZNext"]
    
    # Import document models
    from app.models.task import Task
    
    # Initialize Beanie with our document models
    await init_beanie(database=database, document_models=[Task])
    print("🐉 Database initialized with Beanie ODM!")

@app.on_event("startup")
async def startup_event():
    """FastAPI startup event to initialize database 🐉"""
    await init_database()

# Import and mount routers AFTER env + db are ready
from app.routes import tasks_routes, auth, labels  # Renamed tasks to tasks_routes  # noqa: E402

app.include_router(tasks_routes.router, prefix="/tasks", tags=["tasks"])
# app.include_router(auth.router,  prefix="/auth",  tags=["auth"])
# app.include_router(labels.router,prefix="/labels",tags=["labels"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running smoothly! 🐉"}

@app.get("/db-test")
async def db_test():
    """Test database connection 🐉"""
    if client is None:
        return {"status": "error", "message": "Database not initialized"}
    
    # Test the connection
    await client.admin.command("ping")
    database = client["TodoAppAZNext"]
    collections = await database.list_collection_names()
    
    return {"status": "success", "database": database.name, "collections": collections}
