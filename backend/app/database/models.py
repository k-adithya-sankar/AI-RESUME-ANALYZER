from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


# =========================
# USER
# =========================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # One user → many resumes
    resumes = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    applied_jobs = relationship(
        "AppliedJob",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    built_resumes = relationship(
        "BuiltResume",
        back_populates="user",
        cascade="all, delete-orphan"
)


# =========================
# RESUME
# =========================

class Resume(Base):

    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Connect resume to user
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    extracted_text = Column(
        Text
    )

    resume_text = Column(
        Text
    )

    analysis = Column(
        Text
    )

    ats_score = Column(
        Text
    )

    improved_resume = Column(
        Text
    )

    interview_questions = Column(
        Text
    )

    job_recommendations = Column(
        Text
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # Resume → User
    user = relationship(
        "User",
        back_populates="resumes"
    )
# =========================
# APPLIED JOB
# =========================

class AppliedJob(Base):

    __tablename__ = "applied_jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Connect job to user
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    company_name = Column(
        String,
        nullable=False
    )

    job_title = Column(
        String,
        nullable=False
    )

    job_description = Column(
        Text,
        nullable=True
    )

    job_url = Column(
        String,
        nullable=True
    )

    location = Column(
        String,
        nullable=True
    )

    application_date = Column(
        DateTime,
        server_default=func.now()
    )

    status = Column(
        String,
        nullable=False,
        default="Applied"
    )

    notes = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # Applied Job → User
    user = relationship(
        "User",
        back_populates="applied_jobs"
    )
    # =========================
# BUILT RESUME
# =========================

class BuiltResume(Base):

    __tablename__ = "built_resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    template = Column(
        String,
        nullable=False
    )

    mode = Column(
        String,
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="built_resumes"
    )