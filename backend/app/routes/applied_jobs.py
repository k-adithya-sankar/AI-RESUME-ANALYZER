from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import AppliedJob, User
from app.schemas.jobs import AppliedJobCreate, AppliedJobUpdate
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/applied-jobs",
    tags=["Applied Jobs"]
)


# =========================================================
# CREATE JOB APPLICATION
# =========================================================

@router.post("/")
def create_applied_job(
    data: AppliedJobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_job = AppliedJob(
        user_id=current_user.id,
        company_name=data.company_name,
        job_title=data.job_title,
        job_description=data.job_description,
        job_url=data.job_url,
        location=data.location,
        application_date=data.application_date,
        status=data.status,
        notes=data.notes
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job application added successfully",
        "job_id": new_job.id
    }


# =========================================================
# GET ALL JOB APPLICATIONS
# =========================================================

@router.get("/")
def get_applied_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    jobs = db.query(AppliedJob).filter(
        AppliedJob.user_id == current_user.id
    ).order_by(
        AppliedJob.created_at.desc()
    ).all()

    return jobs


# =========================================================
# GET SINGLE JOB APPLICATION
# =========================================================

@router.get("/{job_id}")
def get_applied_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    job = db.query(AppliedJob).filter(
        AppliedJob.id == job_id,
        AppliedJob.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job application not found."
        )

    return job


# =========================================================
# UPDATE JOB APPLICATION
# =========================================================

@router.put("/{job_id}")
def update_applied_job(
    job_id: int,
    data: AppliedJobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    job = db.query(AppliedJob).filter(
        AppliedJob.id == job_id,
        AppliedJob.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job application not found."
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    return {
        "message": "Job application updated successfully",
        "job_id": job.id
    }


# =========================================================
# DELETE JOB APPLICATION
# =========================================================

@router.delete("/{job_id}")
def delete_applied_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    job = db.query(AppliedJob).filter(
        AppliedJob.id == job_id,
        AppliedJob.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job application not found."
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job application deleted successfully"
    }