TEMPLATES = {
    "modern": {
        "name": "Modern",
        "description": "Clean modern design suitable for technology and data roles."
    },

    "professional": {
        "name": "Professional",
        "description": "Traditional professional resume layout suitable for corporate roles."
    },

    "minimal": {
        "name": "Minimal",
        "description": "Simple and clean resume with minimal visual elements."
    },

    "creative": {
        "name": "Creative",
        "description": "Modern visual layout suitable for creative and design-oriented roles."
    },

    "ats": {
        "name": "ATS Friendly",
        "description": "Simple structure optimized for Applicant Tracking Systems."
    }
}


def get_templates():

    return [
        {
            "id": template_id,
            **template
        }
        for template_id, template in TEMPLATES.items()
    ]


def template_exists(template_id: str):

    return template_id in TEMPLATES