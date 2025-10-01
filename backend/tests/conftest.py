"""
Test configuration and fixtures 🐉
(Note: The name 'conftest.py' is a pytest convention - it automatically discovers fixtures from this file)
"""
import pytest
from fastapi.testclient import TestClient
from datetime import date, datetime, timezone
from bson import ObjectId

from app.main import app

# Test client fixture
@pytest.fixture
def client():
    """Create a test client for our API"""
    # Simple initialization without keyword arguments to avoid version issues
    return TestClient(app)

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
    """Create a task and return its data"""
    response = client.post("/tasks/", json=valid_task_data)
    assert response.status_code == 201
    return response.json()
