"""
Authentication Routes 🐉
Handles user signup, login, and authentication
"""
from fastapi import APIRouter, HTTPException, Request, Response
from passlib.context import CryptContext
from datetime import datetime, UTC
from bson import ObjectId

from app.models.user import User
from app.schemas.auth_schema import SignupIn, LoginIn, UserOut
from app.auth.jwt import create_token, verify_token

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
async def login(login_data: LoginIn, response: Response):
    """
    Authenticate user and return user data with JWT cookie 🐉
    
    - **email**: User's registered email address
    - **password**: User's password
    
    Returns 401 if credentials are invalid.
    Sets httpOnly cookie with JWT token on success.
    """
    # Find user by email and verify password
    user = await User.find_one(User.email == login_data.email)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="invalid credentials"
        )
    
    # Create JWT token
    token = create_token(str(user.id))
    
    # Create user data response
    user_data = UserOut(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at  # FastAPI will serialize datetime to ISO
    )
    
    # Set httpOnly cookie on the injected response object
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax"
        # secure=True   # turn on in prod (HTTPS)
    )
    
    # Return Pydantic model directly - FastAPI handles serialization
    return user_data


@router.get("/me", response_model=UserOut, status_code=200)
async def get_current_user(request: Request):
    """
    Get current authenticated user from JWT cookie 🐉
    
    Returns 401 if no valid token found in cookies.
    """
    # Get access token from cookie
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=401,
            detail="not authenticated"
        )
    
    # Verify token and get user ID
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="invalid token"
        )
    
    # Find user by ID
    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="user not found"
        )
    
    # Return user data (excluding password_hash)
    return UserOut(
        id=str(user.id),
        email=user.email,
        created_at=user.created_at
    )


@router.post("/logout", status_code=200)
async def logout(response: Response):
    """
    Log out user by clearing the JWT cookie 🐉
    """
    response.delete_cookie("access_token")
    return {"ok": True}