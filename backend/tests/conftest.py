"""
Test configuration and fixtures 🐉
(Note: The name 'conftest.py' is a pytest convention - it automatically discovers fixtures from this file)
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from datetime import date, datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os

from app.main import app
from app.models.task import Task

# Configure pytest-asyncio
pytest_plugins = ('pytest_asyncio',)

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

# Initialize Beanie for tests
@pytest.fixture(scope="session", autouse=True)
async def init_test_db():
    """Initialize Beanie for the test session 🐉"""
    # Get MongoDB URI from environment
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        pytest.fail("MONGO_URI not set. Required for tests.")
    
    # Create test database connection
    client = AsyncIOMotorClient(MONGO_URI)
    database = client["TodoAppAZNext_test"]  # Use separate test database
    
    # Initialize Beanie with our Task model
    await init_beanie(database=database, document_models=[Task])
    
    yield  # Run tests
    
    # Cleanup: Drop the test database after all tests
    await client.drop_database("TodoAppAZNext_test")
    client.close()

# Test client fixture
@pytest.fixture
def client():
    """Create a test client for our API 🐉"""
    with TestClient(app) as test_client:
        yield test_client

# Sample valid task data
@pytest.fixture
def valid_task_data():
    """Return a valid task payload"""
    return {
        "title": "Test Task",
        "description": "This is a test task",
        "priority": "medium",
        "deadline": str(date(2025, 10, 1))  # Match the format in Project_Notes.md
    }

@pytest.fixture
def created_task(client, valid_task_data):
    """Create a task and return its data, then clean it up after the test 🐉"""
    response = client.post("/tasks/", json=valid_task_data)
    assert response.status_code == 201
    task = response.json()
    
    yield task  # Give the task to the test
    
    # Clean up: delete this specific task after the test finishes
    try:
        client.delete(f"/tasks/{task['_id']}")
    except Exception:
        pass  # Task might already be deleted by the test
