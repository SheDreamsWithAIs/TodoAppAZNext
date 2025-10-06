"""
Test database health check endpoints 🐉
"""
import pytest
from fastapi.testclient import TestClient


def test_general_health_check(client: TestClient):
    """Test the general health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "healthy"
    assert "message" in data


def test_general_db_test(client: TestClient):
    """Test the general database test endpoint"""
    response = client.get("/db-test")
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "success"
    assert data["environment"] == "test"
    assert data["database"] == "TodoAppAZNext_test"
    assert "collections" in data


def test_test_db_health_comprehensive(client: TestClient):
    """Comprehensive test for the test-specific database health check endpoint 🐉"""
    response = client.get("/test-db-health")
    assert response.status_code == 200
    
    data = response.json()
    
    # Basic response structure
    assert data["status"] == "success"
    assert data["message"] == "Test database is healthy and ready for testing"
    assert data["environment"] == "test"
    assert data["database"] == "TodoAppAZNext_test"
    assert data["can_drop_safely"] is True
    assert "collections" in data
    assert "collection_stats" in data
    
    # Verify collection stats structure
    collection_stats = data["collection_stats"]
    assert isinstance(collection_stats, dict)
    
    # Each collection should have a count (even if 0)
    for collection_name, count in collection_stats.items():
        assert isinstance(count, int)
        assert count >= 0
    
    # Verify database safety - confirms we're working with a test database
    assert "test" in data["database"].lower()


