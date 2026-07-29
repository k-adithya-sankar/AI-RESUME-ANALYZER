from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AppliedJobCreate(BaseModel):

    company_name: str

    job_title: str

    job_description: Optional[str] = None

    job_url: Optional[str] = None

    location: Optional[str] = None

    application_date: Optional[datetime] = None

    status: str = "Applied"

    notes: Optional[str] = None


class AppliedJobUpdate(BaseModel):

    company_name: Optional[str] = None

    job_title: Optional[str] = None

    job_description: Optional[str] = None

    job_url: Optional[str] = None

    location: Optional[str] = None

    application_date: Optional[datetime] = None

    status: Optional[str] = None

    notes: Optional[str] = None