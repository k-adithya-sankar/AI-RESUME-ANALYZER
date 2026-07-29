import json

from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Resume, User

from app.utils.auth import get_current_user

from app.services.ai_service import get_ai_response
from app.services.ats_service import calculate_ats_score

from app.prompts.prompts import analysis_prompt


router = APIRouter(
    prefix="/analyze",
    tags=["Analyze"]
)


@router.post("/{resume_id}")
def analyze_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find resume belonging to the logged-in user
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    # Resume doesn't exist or doesn't belong to this user
    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # Create AI prompt
    prompt = analysis_prompt(
        resume.resume_text
    )

    # Get AI analysis
    result = get_ai_response(prompt)

    # Calculate ATS score
    ats_result = calculate_ats_score(
        resume.resume_text
    )

    # Check AI response
    if "error" in result:
        raise HTTPException(
            status_code=500,
            detail=result
        )

    # Add ATS result
    result["ats"] = ats_result

    # Save analysis
    resume.analysis = json.dumps(result)

    # Save ATS score separately
    resume.ats_score = json.dumps(ats_result)

    db.commit()

    return result