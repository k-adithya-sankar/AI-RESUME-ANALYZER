from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Resume, User

from app.utils.auth import get_current_user

from app.services.improvement_service import improve_resume_section


router = APIRouter(
    prefix="/improve",
    tags=["Improve"]
)


class ImprovementRequest(BaseModel):

    resume_id: int
    section_name: str
    section_text: str


@router.post("/")
def improve_section(
    data: ImprovementRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find resume belonging to logged-in user
    resume = db.query(Resume).filter(
        Resume.id == data.resume_id,
        Resume.user_id == current_user.id
    ).first()

    # Resume doesn't exist or doesn't belong to user
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # Improve the requested section
    result = improve_resume_section(
        data.section_name,
        data.section_text
    )

    # Check AI response
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(
            status_code=500,
            detail=result
        )

    return {
        "resume_id": resume.id,
        "section": data.section_name,
        "result": result
    }