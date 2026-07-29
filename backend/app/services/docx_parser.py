from docx import Document
def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from a DOCX file.

    Parameters:
        file_path (str): Path of the uploaded DOCX file.

    Returns:
        str: Complete text extracted from the DOCX.
    """

    extracted_text = ""

    try:
        # Open the DOCX file
        document = Document(file_path)

        # Read every paragraph
        for paragraph in document.paragraphs:

            extracted_text += paragraph.text + "\n"

        return extracted_text

    except Exception as e:
        print(f"DOCX Parsing Error: {e}")
        return ""