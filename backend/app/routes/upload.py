import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Resume, User

from app.utils.auth import get_current_user

from app.services.pdf_parser import extract_text_from_pdf
from app.services.docx_parser import extract_text_from_docx

from app.utils.helper import (
    allowed_file,
    generate_filename,
    create_upload_folder,
    UPLOAD_FOLDER
)


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # --------------------------------
    # Create uploads folder
    # --------------------------------

    create_upload_folder()


    # --------------------------------
    # Check file type
    # --------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing."
        )

    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )


    # --------------------------------
    # Generate unique filename
    # --------------------------------

    filename = generate_filename(file.filename)


    # --------------------------------
    # Create file path
    # --------------------------------

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )


    # --------------------------------
    # Save uploaded file
    # --------------------------------

    with open(file_path, "wb") as f:

        f.write(
            file.file.read()
        )


    # --------------------------------
    # Extract text
    # --------------------------------

    extension = (
        filename
        .split(".")[-1]
        .lower()
    )


    if extension == "pdf":

        resume_text = extract_text_from_pdf(
            file_path
        )

    else:

        resume_text = extract_text_from_docx(
            file_path
        )


    # --------------------------------
    # Save resume in database
    # --------------------------------

    new_resume = Resume(

        filename=filename,

        resume_text=resume_text,

        extracted_text=resume_text,

        user_id=current_user.id
    )


    db.add(new_resume)

    db.commit()

    db.refresh(new_resume)


    # --------------------------------
    # Return response
    # --------------------------------

    return {

        "message": "Resume uploaded successfully",

        "resume_id": new_resume.id,

        "filename": filename,

        "user_id": current_user.id
    }