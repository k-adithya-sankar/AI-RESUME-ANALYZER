from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User

from app.schemas.auth import RegisterRequest

from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# REGISTER
# =========================

@router.post("/register")
def register_user(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Hash password
    hashed_password = hash_password(
        data.password
    )

    # Create user
    user = User(
        name=data.name,
        email=data.email,
        password_hash=hashed_password
    )

    # Save user
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": user.id
    }


# =========================
# LOGIN
# =========================

@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # OAuth2 uses "username"
    # We are using the user's email as username

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    # User doesn't exist
    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Verify password
    password_correct = verify_password(
        form_data.password,
        user.password_hash
    )

    if not password_correct:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Create JWT token
    token = create_access_token(
        user.id
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }