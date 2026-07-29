from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Resume, User
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


# =========================================================
# GET ALL RESUMES
# =========================================================

@router.get("/")
def get_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(
        Resume.created_at.desc()
    ).all()

    return resumes


# =========================================================
# GET ONE RESUME
# =========================================================

@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    return resume


# =========================================================
# DELETE RESUME
# =========================================================

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully"
    }