from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create the FastAPI app
app = FastAPI(
    title="TodoAppAZNext API",
    description="A task tracking app for AI-assisted development course",
    version="1.0.0"
)

# Add CORS middleware (we'll need this for the frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection setup 🐉
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.TodoAppAZNext  # Connect to the TodoAppAZNext database

@app.get("/")
async def hello_world():
    """🐉 Hello World endpoint - the dragons are watching!"""
    return {"message": "Hello World! The TodoAppAZNext API is running! 🐉"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running smoothly! 🐉"}

@app.get("/db-test")
async def test_database_connection():
    """🐉 Test endpoint to verify MongoDB connection"""
    try:
        # Try to ping the database
        client.admin.command('ping')
        return {
            "status": "success", 
            "message": "MongoDB connection successful! 🐉",
            "database": db.name,
            "collections": db.list_collection_names()
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Database connection failed: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
