"""
Tests for the tasks endpoints 🐉
"""
from datetime import date

def test_create_task(client, valid_task_data):
    """Test creating a task with valid data"""
    response = client.post("/tasks/", json=valid_task_data)
    assert response.status_code == 201
    data = response.json()
    
    # Check required fields
    assert data["title"] == valid_task_data["title"]
    assert data["description"] == valid_task_data["description"]
    assert data["priority"] == valid_task_data["priority"]
    assert data["deadline"] == valid_task_data["deadline"]
    
    # Check default values
    assert data["completed"] is False
    assert data["label_ids"] == []
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_list_tasks(client, created_task):
    """Test listing tasks"""
    response = client.get("/tasks/")
    assert response.status_code == 200
    data = response.json()
    
    # Should be a list with at least one task
    assert isinstance(data, list)
    assert len(data) > 0
    
    # First task should match our created task
    first_task = data[0]
    assert first_task["id"] == created_task["id"]
    assert first_task["title"] == created_task["title"]

def test_get_task(client, created_task):
    """Test getting a specific task"""
    response = client.get(f"/tasks/{created_task['id']}")
    assert response.status_code == 200
    data = response.json()
    
    # Should match our created task
    assert data["id"] == created_task["id"]
    assert data["title"] == created_task["title"]
    assert data["description"] == created_task["description"]
    assert data["priority"] == created_task["priority"]
    assert data["deadline"] == created_task["deadline"]

def test_get_task_not_found(client):
    """Test getting a non-existent task"""
    # Use a valid ObjectId format but one that doesn't exist
    response = client.get("/tasks/123456789012345678901234")
    assert response.status_code == 404

def test_get_task_invalid_id(client):
    """Test getting a task with invalid ID format"""
    response = client.get("/tasks/invalid-id")
    assert response.status_code == 400
