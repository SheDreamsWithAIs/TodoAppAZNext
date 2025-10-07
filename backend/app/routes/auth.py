"""
Authentication Routes 🐉
Handles user signup, login, and authentication
"""
from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from datetime import datetime, UTC

from app.models.user import User
from app.schemas.auth_schema import SignupIn, LoginIn, UserOut

router = APIRouter(tags=["auth"])

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt 🐉"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash 🐉"""
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/signup", response_model=UserOut, status_code=201)
async def signup(signup_data: SignupIn):
    """
    Create a new user account 🐉
    
    - **email**: Must be unique across all users
    - **password**: Minimum 8 characters, will be securely hashed
    
    Returns 409 if email already exists.
    """
    # Check if email already exists
    existing_user = await User.find_one(User.email == signup_data.email)
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="email already registered"
        )
    
    # Hash the password securely
    password_hash = hash_password(signup_data.password)
    
    # Create new user
    user = User(
        email=signup_data.email,
        password_hash=password_hash,
        created_at=datetime.now(UTC)
    )
    
    # Save to database
    await user.create()
    
    # Return user data (excluding password_hash)
    return UserOut(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at
    )

@router.post("/login", response_model=UserOut, status_code=200)
async def login(login_data: LoginIn):
    """
    Authenticate user and return user data 🐉
    
    - **email**: User's registered email address
    - **password**: User's password
    
    Returns 401 if credentials are invalid.
    """
    # Find user by email
    user = await User.find_one(User.email == login_data.email)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="invalid credentials"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="invalid credentials"
        )
    
    # Return user data (excluding password_hash)
    return UserOut(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at
    )