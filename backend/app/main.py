from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
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

# Mongo (env is loaded already)
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set. Put it in .env (repo root or backend).")
client = MongoClient(MONGO_URI)
db = client["TodoAppAZNext"]

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
    client.admin.command("ping")
    return {"status": "success", "database": db.name, "collections": db.list_collection_names()}
