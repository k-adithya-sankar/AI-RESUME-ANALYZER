from typing import Any, Dict

from pydantic import BaseModel


class CreateResumeRequest(BaseModel):

    title: str

    template: str

    mode: str

    content: Dict[str, Any]


class AIResumeRequest(BaseModel):

    title: str

    template: str

    prompt: str


class UpdateResumeRequest(BaseModel):

    title: str

    template: str

    content: Dict[str, Any]
    
class ManualResumeRequest(BaseModel):

    title: str

    template: str

    personal: dict

    summary: str = ""

    skills: list = []

    experience: list = []

    education: list = []

    projects: list = []

    certifications: list = []