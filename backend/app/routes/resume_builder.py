import json

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User, BuiltResume

from app.schemas.resume_builder import (
    CreateResumeRequest,
    AIResumeRequest,
    UpdateResumeRequest,
    ManualResumeRequest
)

from app.utils.auth import get_current_user

from app.services.ai_service import get_ai_response

from app.services.resume_templates import (
    get_templates,
    template_exists
)

from app.prompts.prompts import resume_builder_prompt


router = APIRouter(
    prefix="/resume-builder",
    tags=["Resume Builder"]
)


# =====================================================
# GET RESUME TEMPLATES
# =====================================================

@router.get("/templates")
def get_resume_templates(
    current_user: User = Depends(get_current_user)
):

    return {
        "templates": get_templates()
    }


# =====================================================
# CREATE RESUME
# =====================================================

@router.post("/")
def create_resume(
    data: CreateResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if data.mode not in ["manual", "ai"]:

        raise HTTPException(
            status_code=400,
            detail="Mode must be 'manual' or 'ai'."
        )

    if not template_exists(data.template):

        raise HTTPException(
            status_code=400,
            detail="Invalid resume template."
        )

    new_resume = BuiltResume(
        user_id=current_user.id,
        title=data.title,
        template=data.template,
        mode=data.mode,
        content=json.dumps(data.content)
    )

    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)

    return {
        "message": "Resume created successfully",
        "resume_id": new_resume.id
    }


# =====================================================
# GET USER'S BUILT RESUMES
# =====================================================

@router.get("/")
def get_my_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resumes = db.query(BuiltResume).filter(
        BuiltResume.user_id == current_user.id
    ).all()

    result = []

    for resume in resumes:

        result.append({
            "id": resume.id,
            "title": resume.title,
            "template": resume.template,
            "mode": resume.mode,
            "content": json.loads(resume.content),
            "created_at": resume.created_at
        })

    return result


# =====================================================
# AI RESUME BUILDER
# =====================================================

@router.post("/ai")
def create_ai_resume(
    data: AIResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Validate template

    if not template_exists(data.template):

        raise HTTPException(
            status_code=400,
            detail="Invalid resume template."
        )

    # Create AI prompt

    prompt = resume_builder_prompt(
        data.prompt
    )

    # Send prompt to AI

    result = get_ai_response(prompt)

    # Check AI error

    if "error" in result:

        raise HTTPException(
            status_code=500,
            detail=result
        )

    # Save AI-generated resume

    new_resume = BuiltResume(
        user_id=current_user.id,
        title=data.title,
        template=data.template,
        mode="ai",
        content=json.dumps(result)
    )

    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)

    return {
        "message": "AI resume created successfully",
        "resume_id": new_resume.id,
        "resume": result
    }


# =====================================================
# MANUAL RESUME BUILDER
# =====================================================

@router.post("/manual")
def create_manual_resume(
    data: ManualResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Validate template

    if not template_exists(data.template):

        raise HTTPException(
            status_code=400,
            detail="Invalid resume template."
        )

    # Create resume content

    resume_content = {

        "personal": data.personal,

        "summary": data.summary,

        "skills": data.skills,

        "experience": data.experience,

        "education": data.education,

        "projects": data.projects,

        "certifications": data.certifications
    }

    # Save resume

    new_resume = BuiltResume(
        user_id=current_user.id,
        title=data.title,
        template=data.template,
        mode="manual",
        content=json.dumps(resume_content)
    )

    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)

    return {
        "message": "Manual resume created successfully",
        "resume_id": new_resume.id,
        "resume": resume_content
    }


# =====================================================
# GET SINGLE BUILT RESUME
# =====================================================

@router.get("/{resume_id}")
def get_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = db.query(BuiltResume).filter(
        BuiltResume.id == resume_id,
        BuiltResume.user_id == current_user.id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    return {
        "id": resume.id,
        "title": resume.title,
        "template": resume.template,
        "mode": resume.mode,
        "content": json.loads(resume.content),
        "created_at": resume.created_at
    }


# =====================================================
# UPDATE BUILT RESUME
# =====================================================

@router.put("/{resume_id}")
def update_resume(
    resume_id: int,
    data: UpdateResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = db.query(BuiltResume).filter(
        BuiltResume.id == resume_id,
        BuiltResume.user_id == current_user.id
    ).first()

    if not resume:

        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    if not template_exists(data.template):

        raise HTTPException(
            status_code=400,
            detail="Invalid resume template."
        )

    resume.title = data.title

    resume.template = data.template

    resume.content = json.dumps(
        data.content
    )

    db.commit()

    db.refresh(resume)

    return {
        "message": "Resume updated successfully",
        "resume_id": resume.id
    }


# =====================================================
# DELETE BUILT RESUME
# =====================================================

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    resume = db.query(BuiltResume).filter(
        BuiltResume.id == resume_id,
        BuiltResume.user_id == current_user.id
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