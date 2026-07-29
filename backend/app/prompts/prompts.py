def analysis_prompt(resume_text: str) -> str:

    return f"""
You are an expert resume analyzer and ATS specialist.

Analyze the resume below carefully.

Return ONLY valid JSON.
Do not include markdown.
Do not include ```json.
Do not add any explanation outside the JSON.

Use exactly this structure:

{{
    "overall_score": 0,

    "summary": "",

    "skills": {{
        "technical": [],
        "soft": [],
        "tools": []
    }},

    "experience": [],

    "education": [],

    "projects": [],

    "strengths": [],

    "weaknesses": [],

    "missing_keywords": [],

    "recommendations": [],

    "section_scores": {{
        "contact": 0,
        "summary": 0,
        "skills": 0,
        "experience": 0,
        "education": 0,
        "projects": 0
    }}
}}

Scoring rules:

- overall_score must be between 0 and 100.
- Every section score must be between 0 and 100.
- Give realistic scores based only on the resume.
- Do not invent experience, education, skills, or projects.
- missing_keywords should contain useful keywords that would improve the resume.
- recommendations should be specific and actionable.

Resume:

{resume_text}
"""


def job_matching_prompt(resume_text: str, job_description: str) -> str:

    return f"""
You are an expert recruiter and resume-to-job matching specialist.

Compare the resume with the job description.

Analyze the actual skills, experience, projects, education, and technologies.

Do not simply look for exact keyword matches.
Understand the meaning and context.

Return ONLY valid JSON.

Do not use markdown.
Do not include ```json.
Do not add any explanation outside the JSON.

Use exactly this structure:

{{
    "match_score": 0,

    "summary": "",

    "matched_skills": [],

    "missing_skills": [],

    "matched_experience": [],

    "missing_experience": [],

    "strengths_for_this_job": [],

    "weaknesses_for_this_job": [],

    "recommendations": []
}}

Rules:

- match_score must be between 0 and 100.
- Only identify skills that are relevant to the job.
- Do not invent experience that is not present in the resume.
- missing_skills should contain important skills required by the job that are not demonstrated in the resume.
- recommendations should be specific and actionable.
- Be honest and realistic.

RESUME:

{resume_text}

JOB DESCRIPTION:

{job_description}
"""
def interview_prompt(
    resume_text: str,
    job_description: str,
    number_of_questions: int
) -> str:

    return f"""
You are an expert technical interviewer.

Analyze the candidate's resume and the job description.

Candidate Resume:
{resume_text}

Job Description:
{job_description}

Generate exactly {number_of_questions} interview questions.

The questions should include:
1. Technical questions based on the candidate's skills.
2. Questions related to the job description.
3. Questions about the candidate's projects or experience.
4. A few practical or scenario-based questions when appropriate.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "questions": [
        {{
            "question": "Question here",
            "type": "technical",
            "difficulty": "medium"
        }}
    ]
}}
"""
def resume_builder_prompt(user_prompt: str):
    return f"""
You are a professional resume writer and career expert.

Your task is to create a professional, ATS-friendly resume based on
the user's instructions.

USER REQUEST:
{user_prompt}

Create the resume using the following sections:

1. personal
2. summary
3. skills
4. experience
5. education
6. projects
7. certifications

IMPORTANT RULES:

- Do not invent fake companies, jobs, degrees, certifications, dates,
  achievements, or other personal information.
- Only use information provided by the user.
- If information is missing, return an empty value or empty list.
- Make the content professional and ATS-friendly.
- Use clear and concise language.
- Optimize the resume for the job or role mentioned by the user.
- Use strong action verbs where appropriate.
- Keep the information truthful.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not put ```json around the response.

Return JSON in exactly this structure:

{{
    "personal": {{
        "name": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "github": ""
    }},

    "summary": "",

    "skills": [],

    "experience": [],

    "education": [],

    "projects": [],

    "certifications": []
}}

For experience, use objects like:

{{
    "job_title": "",
    "company": "",
    "location": "",
    "start_date": "",
    "end_date": "",
    "description": []
}}

For education, use objects like:

{{
    "degree": "",
    "institution": "",
    "location": "",
    "start_date": "",
    "end_date": ""
}}

For projects, use objects like:

{{
    "name": "",
    "description": [],
    "technologies": []
}}

For certifications, use objects like:

{{
    "name": "",
    "issuer": "",
    "date": ""
}}
"""