from fastapi import FastAPI

from app.database.database import engine
from app.database.models import Base
from fastapi.middleware.cors import CORSMiddleware
# Import routes
from app.routes import (
    upload,
    analyze,
    improve,
    interview,
    jobs,
    auth,
    applied_jobs,
    resumes,
    resume_builder
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="AI Resume Analyzer",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routes
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(improve.router)
app.include_router(interview.router)
app.include_router(jobs.router)
app.include_router(auth.router)
app.include_router(applied_jobs.router)
app.include_router(resumes.router)
app.include_router(resume_builder.router)
@app.get("/")
def home():

    return {
        "message": "AI Resume Analyzer API is Running"
    }