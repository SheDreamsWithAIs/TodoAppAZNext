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
    assert "_id" in data  # Beanie uses _id, not id
    assert "created_at" in data
    assert "updated_at" in data
    
    # Clean up the task we created
    client.delete(f"/tasks/{data['_id']}")

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
    assert first_task["_id"] == created_task["_id"]
    assert first_task["title"] == created_task["title"]

def test_get_task(client, created_task):
    """Test getting a specific task"""
    response = client.get(f"/tasks/{created_task['_id']}")
    assert response.status_code == 200
    data = response.json()
    
    # Should match our created task
    assert data["_id"] == created_task["_id"]
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
    assert response.status_code == 422  # Pydantic validation error

def test_update_task(client, created_task):
    """Test updating a task with PATCH"""
    update_data = {
        "title": "Updated Task Title",
        "completed": True
    }
    
    response = client.patch(f"/tasks/{created_task['_id']}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    
    # Check updated fields
    assert data["title"] == update_data["title"]
    assert data["completed"] == update_data["completed"]
    
    # Check that other fields remained unchanged
    assert data["description"] == created_task["description"]
    assert data["priority"] == created_task["priority"]
    assert data["deadline"] == created_task["deadline"]

def test_update_task_partial(client, created_task):
    """Test partial update (only one field)"""
    update_data = {
        "priority": "high"
    }
    
    response = client.patch(f"/tasks/{created_task['_id']}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    
    # Only priority should change
    assert data["priority"] == "high"
    assert data["title"] == created_task["title"]
    assert data["completed"] == created_task["completed"]

def test_update_task_not_found(client):
    """Test updating a non-existent task"""
    update_data = {"title": "New Title"}
    response = client.patch("/tasks/123456789012345678901234", json=update_data)
    assert response.status_code == 404

def test_update_task_invalid_id(client):
    """Test updating with invalid ID format"""
    update_data = {"title": "New Title"}
    response = client.patch("/tasks/invalid-id", json=update_data)
    assert response.status_code == 422  # Pydantic validation error

def test_delete_task(client, created_task):
    """Test deleting a task"""
    response = client.delete(f"/tasks/{created_task['_id']}")
    assert response.status_code == 204
    
    # Verify the task is actually deleted
    get_response = client.get(f"/tasks/{created_task['_id']}")
    assert get_response.status_code == 404

def test_delete_task_not_found(client):
    """Test deleting a non-existent task"""
    response = client.delete("/tasks/123456789012345678901234")
    assert response.status_code == 404

def test_delete_task_invalid_id(client):
    """Test deleting with invalid ID format"""
    response = client.delete("/tasks/invalid-id")
    assert response.status_code == 422  # Pydantic validation error
