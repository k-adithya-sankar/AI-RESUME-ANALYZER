import os
import uuid


# Folder where uploaded files are stored
UPLOAD_FOLDER = "uploads"


def allowed_file(filename):

    extension = filename.split(".")[-1].lower()

    return extension in ["pdf", "docx"]


def generate_filename(filename):

    extension = filename.split(".")[-1]

    unique_name = f"{uuid.uuid4()}.{extension}"

    return unique_name


def create_upload_folder():

    if not os.path.exists(UPLOAD_FOLDER):

        os.makedirs(UPLOAD_FOLDER)