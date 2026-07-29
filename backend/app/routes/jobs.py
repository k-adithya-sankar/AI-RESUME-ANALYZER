import json

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

from app.services.ai_service import get_ai_response
from app.prompts.prompts import job_matching_prompt


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


class JobMatchRequest(BaseModel):

    resume_id: int
    job_description: str


@router.post("/match")
def match_resume_to_job(
    data: JobMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # --------------------------------
    # Find resume belonging to user
    # --------------------------------

    resume = db.query(Resume).filter(
        Resume.id == data.resume_id,
        Resume.user_id == current_user.id
    ).first()


    # --------------------------------
    # Resume not found
    # --------------------------------

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )


    # --------------------------------
    # Create AI prompt
    # --------------------------------

    prompt = job_matching_prompt(
        resume.resume_text,
        data.job_description
    )


    # --------------------------------
    # Send prompt to AI
    # --------------------------------

    result = get_ai_response(prompt)


    # --------------------------------
    # Check AI error
    # --------------------------------

    if "error" in result:

        raise HTTPException(
            status_code=500,
            detail=result
        )


    # --------------------------------
    # Save result
    # --------------------------------

    resume.job_recommendations = json.dumps(
        result
    )


    db.commit()


    # --------------------------------
    # Return result
    # --------------------------------

    return result