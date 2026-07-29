from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.database.models import User

from app.services.auth_service import (
    SECRET_KEY,
    ALGORITHM
)


# Tell FastAPI where users get their token
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    # Create database session
    db: Session = SessionLocal()

    try:

        # Decode JWT token
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Get user ID from token
        user_id = payload.get("user_id")

        # If user ID doesn't exist
        if user_id is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token."
            )

        # Find user in database
        user = db.query(User).filter(
            User.id == user_id
        ).first()

        # User doesn't exist
        if user is None:

            raise HTTPException(
                status_code=401,
                detail="User not found."
            )

        return user

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."

        )

    finally:

        db.close()