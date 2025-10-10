"""
JWT Token Management 🐉
Handles creation and verification of JWT tokens for authentication
"""
import os
import time
from jose import jwt, JWTError

# JWT Configuration from environment variables
SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALG = os.getenv("JWT_ALG", "HS256")
EXP = int(os.getenv("JWT_EXPIRE_MIN", "60"))


def create_token(sub: str) -> str:
    """
    Create a JWT token for the given subject (user ID) 🐉
    
    Args:
        sub: Subject (typically user ID or email)
        
    Returns:
        Encoded JWT token string
    """
    now = int(time.time())
    payload = {
        "sub": sub,
        "iat": now,
        "exp": now + EXP * 60
    }
    return jwt.encode(payload, SECRET, algorithm=ALG)


def verify_token(token: str) -> str | None:
    """
    Verify and decode a JWT token 🐉
    
    Args:
        token: JWT token string to verify
        
    Returns:
        Subject (user ID) if token is valid, None if invalid/expired
    """
    try:
        data = jwt.decode(token, SECRET, algorithms=[ALG])
        return data.get("sub")
    except JWTError:
        return None
