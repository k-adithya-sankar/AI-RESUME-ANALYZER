import re


def calculate_ats_score(resume_text: str) -> dict:
    """
    Calculate a simple ATS score based on resume content.
    """

    score = 0
    suggestions = []

    # Convert resume text to lowercase
    text = resume_text.lower()

    # --------------------------------
    # 1. Check resume length
    # --------------------------------

    word_count = len(text.split())

    if word_count >= 300:
        score += 20
    else:
        suggestions.append("Resume is too short.")

    # --------------------------------
    # 2. Check important sections
    # --------------------------------

    sections = [
        "education",
        "experience",
        "skills",
        "projects"
    ]

    section_score = 0

    for section in sections:

        if section in text:
            section_score += 10
        else:
            suggestions.append(
                f"Missing section: {section}"
            )

    score += section_score

    # --------------------------------
    # 3. Check common technical skills
    # --------------------------------

    technical_skills = [
        "python",
        "sql",
        "machine learning",
        "data analysis",
        "pandas",
        "numpy",
        "power bi",
        "excel",
        "fastapi",
        "git"
    ]

    skills_found = []

    for skill in technical_skills:

        if skill in text:

            skills_found.append(skill)

    skill_score = min(len(skills_found) * 3, 30)

    score += skill_score

    # --------------------------------
    # 4. Check email
    # --------------------------------

    email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"

    if re.search(email_pattern, resume_text):

        score += 5

    else:

        suggestions.append("Add an email address.")

    # --------------------------------
    # 5. Check phone number
    # --------------------------------

    phone_pattern = r"\b\d{10}\b"

    if re.search(phone_pattern, resume_text):

        score += 5

    else:

        suggestions.append("Add a phone number.")

    # --------------------------------
    # Make sure score doesn't exceed 100
    # --------------------------------

    score = min(score, 100)

    return {
        "score": score,
        "skills_found": skills_found,
        "suggestions": suggestions
    }