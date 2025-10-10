import pytest
import uuid
import asyncio
from typing import Optional

from app.models.user import User


def _unique_email(prefix: str = "auth_test") -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}@example.com"


async def _async_delete_user_by_email(email: str) -> None:
    user: Optional[User] = await User.find_one(User.email == email)
    if user is not None:
        await user.delete()


def _cleanup_user(email: str) -> None:
    # Run cleanup in its own event loop to avoid cross-test interference
    try:
        asyncio.run(_async_delete_user_by_email(email))
    except RuntimeError:
        # Fallback: if an event loop is already running in this thread, schedule a task
        loop = asyncio.get_event_loop()
        loop.run_until_complete(_async_delete_user_by_email(email))


def test_signup_login_flow_with_cleanup_and_diagnostics(client):
    email = _unique_email()
    try:
        # Signup a new user
        resp = client.post("/auth/signup", json={"email": email, "password": "CorrectHorse1!"})
        assert resp.status_code == 201, f"Signup failed: status={resp.status_code} body={resp.text}"
        data = resp.json()
        assert data.get("email") == email, f"Signup payload mismatch: expected email={email}, got={data}"

        # Login should succeed with same credentials
        resp = client.post("/auth/login", json={"email": email, "password": "CorrectHorse1!"})
        assert resp.status_code == 200, f"Login failed: status={resp.status_code} body={resp.text}"
        logged_in = resp.json()
        assert logged_in.get("email") == email, f"Login payload mismatch: expected email={email}, got={logged_in}"
    finally:
        _cleanup_user(email)


def test_login_invalid_credentials_returns_401(client):
    email = _unique_email("auth_bad")
    try:
        # Create a valid user first
        resp = client.post("/auth/signup", json={"email": email, "password": "CorrectHorse1!"})
        assert resp.status_code == 201, f"Precondition signup failed: status={resp.status_code} body={resp.text}"

        # Attempt login with wrong password
        resp = client.post("/auth/login", json={"email": email, "password": "TotallyWrong1!"})
        assert resp.status_code == 401, f"Expected 401 for invalid credentials, got {resp.status_code} body={resp.text}"
    finally:
        _cleanup_user(email)


def test_signup_duplicate_email_returns_conflict(client):
    email = _unique_email("auth_dup")
    try:
        first = client.post("/auth/signup", json={"email": email, "password": "CorrectHorse1!"})
        assert first.status_code == 201, f"Initial signup failed: status={first.status_code} body={first.text}"

        dup = client.post("/auth/signup", json={"email": email, "password": "CorrectHorse1!"})
        assert dup.status_code in (409, 400), (
            f"Expected 409/400 for duplicate signup, got {dup.status_code} body={dup.text}"
        )
    finally:
        _cleanup_user(email)

