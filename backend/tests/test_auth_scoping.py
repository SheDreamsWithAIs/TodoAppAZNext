import pytest


def _signup_login(client, email):
    client.post("/auth/signup", json={"email": email, "password": "CorrectHorse1!"})
    resp = client.post("/auth/login", json={"email": email, "password": "CorrectHorse1!"})
    assert resp.status_code == 200


def test_tasks_scoped_by_user(client):
    # User A creates a task
    _signup_login(client, "a@example.com")
    resp = client.post("/tasks/", json={
        "title": "A's Task",
        "priority": "medium",
        "deadline": "2025-10-10"
    })
    assert resp.status_code == 201
    a_task = resp.json()

    # User B should not see A's task
    client.post("/auth/logout")
    _signup_login(client, "b@example.com")
    resp = client.get("/tasks/?limit=50")
    assert resp.status_code == 200
    tasks = resp.json()
    assert all(t.get("_id") != a_task.get("_id") for t in tasks)

    # And should get 404 when trying to fetch/modify A's task
    resp = client.get(f"/tasks/{a_task['_id']}")
    assert resp.status_code in (404, 401)

    resp = client.patch(f"/tasks/{a_task['_id']}", json={"title": "hijack"})
    assert resp.status_code in (404, 401)


def test_labels_uniqueness_per_user(client):
    # User A can create label "Work"
    client.post("/auth/logout")
    _signup_login(client, "a2@example.com")
    resp = client.post("/labels/?name=Work")
    assert resp.status_code == 201

    # Duplicate for same user returns 409
    resp = client.post("/labels/?name=work")
    assert resp.status_code == 409

    # User B can create "Work" independently
    client.post("/auth/logout")
    _signup_login(client, "b2@example.com")
    resp = client.post("/labels/?name=Work")
    assert resp.status_code == 201


