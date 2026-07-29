from app.services.ai_service import get_ai_response


def improve_resume_section(
    section_name: str,
    section_text: str
) -> dict:

    prompt = f"""
You are an expert professional resume writer.

Improve the following resume section.

Section:
{section_name}

Original text:
{section_text}

Return ONLY valid JSON.

Use exactly this format:

{{
    "original": "",
    "improved": "",
    "changes": []
}}

Rules:

- Keep all facts truthful.
- Do not invent companies.
- Do not invent job titles.
- Do not invent technologies.
- Do not invent achievements.
- Do not invent numbers or percentages.
- Make the writing professional and concise.
- Use strong action verbs where appropriate.
- Improve clarity and impact.
- Preserve the original meaning.

Return only JSON.
"""

    result = get_ai_response(prompt)

    return result