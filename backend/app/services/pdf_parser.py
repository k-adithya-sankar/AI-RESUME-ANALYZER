from PyPDF2 import PdfReader
def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF file.

    Parameters:
        file_path (str): Path of the uploaded PDF.

    Returns:
        str: Complete text extracted from the PDF.
    """

    extracted_text = ""

    try:
        # Open the PDF
        reader = PdfReader(file_path)

        # Read every page
        for page in reader.pages:

            # Extract text from current page
            page_text = page.extract_text()

            # Sometimes extract_text() returns None
            if page_text:
                extracted_text += page_text + "\n"

        return extracted_text

    except Exception as e:
        print(f"PDF Parsing Error: {e}")
        return ""