from pydantic import BaseModel
from datetime import datetime


class ResumeResponse(BaseModel):

    id: int

    filename: str

    upload_time: datetime

    class Config:

        from_attributes = True