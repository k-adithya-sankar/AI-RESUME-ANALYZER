from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import Resume, User

from app.utils.auth import get_current_user

from app.prompts.prompts import interview_prompt
from app.services.ai_service import get_ai_response


router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


class InterviewRequest(BaseModel):

    resume_id: int

    job_description: str

    number_of_questions: int = 5


@router.post("/")
def generate_interview_questions(
    data: InterviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find user's resume
    resume = db.query(Resume).filter(
        Resume.id == data.resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # Create prompt
    prompt = interview_prompt(
        resume.resume_text,
        data.job_description,
        data.number_of_questions
    )

    # Ask AI
    result = get_ai_response(prompt)

    if "error" in result:
        raise HTTPException(
            status_code=500,
            detail=result
        )

    # Save questions
    resume.interview_questions = str(result)

    db.commit()

    return result