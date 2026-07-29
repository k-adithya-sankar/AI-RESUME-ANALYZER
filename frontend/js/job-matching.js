/**
 * job-matching.js
 * Handles matching resume to a JD.
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    const form = document.getElementById('match-form');
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    const btnMatch = document.getElementById('btn-match');
    const resumeSelect = document.getElementById('resume-select');

    /**
     * Load the logged‑in user’s resumes and populate the <select>.
     */
    async function loadResumesForJobMatching() {
        if (!resumeSelect) return;
        try {
            const resumes = await apiGet('/resumes/');
            // Start with a placeholder (kept disabled)
            resumeSelect.innerHTML = '<option value="" disabled selected>Select a resume</option>';
            if (Array.isArray(resumes) && resumes.length > 0) {
                resumes.forEach(resume => {
                    const option = document.createElement('option');
                    option.value = resume.id;
                    // Prefer a readable filename; fallback to the UUID part.
                    const displayName = resume.filename
                        ? resume.filename.replace('.pdf', '')
                        : `Resume ${resume.id}`;
                    const date = resume.created_at
                        ? new Date(resume.created_at).toLocaleDateString()
                        : '';
                    option.text = date ? `${displayName} — Uploaded ${date}` : displayName;
                    resumeSelect.appendChild(option);
                });
            }
        } catch (err) {
            console.error('Failed to load resumes for job matching:', err);
            showAlert('Unable to load resumes. Please try again later.', 'error');
        }
    }

    // Initialise the selector as soon as the page loads.
    loadResumesForJobMatching();

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const resumeId = resumeSelect.value;
            const jobDescription = document.getElementById('job-description').value;

            try {
                btnMatch.disabled = true;
                resultsSection.style.display = 'none';
                loadingState.style.display = 'block';

                let data = null;
                try {
                    data = await apiPost('/match', {
                        resume_id: resumeId,
                        job_description: jobDescription
                    });
                } catch (apiError) {
                    // Mock response (used during development)
                    console.log('Mocking match response', apiError);
                    data = {
                        score: 85,
                        recommendation: "You have a very strong profile for this role. Ensure your cover letter highlights your leadership experience.",
                        matching_skills: ["Python", "SQL", "Data Analysis", "Communication"],
                        missing_skills: ["AWS", "Docker", "Tableau"],
                        strengths: [
                            "Years of experience aligns with requirements",
                            "Strong core technical stack match"
                        ],
                        weaknesses: [
                            "Missing cloud deployment experience (AWS)",
                            "No specific mention of data visualization tools like Tableau"
                        ]
                    };
                }

                renderMatch(data);

                loadingState.style.display = 'none';
                resultsSection.style.display = 'block';
            } catch (error) {
                loadingState.style.display = 'none';
                showAlert(error.message, 'error');
            } finally {
                btnMatch.disabled = false;
            }
        });
    }

    function renderMatch(data) {
        document.getElementById('match-score').innerText = data.score;
        document.getElementById('match-recommendation').innerText = data.recommendation;

        const statusEl = document.getElementById('match-status');
        if (data.score >= 80) {
            statusEl.innerText = "Strong Match!";
        } else if (data.score >= 50) {
            statusEl.innerText = "Good Match";
        } else {
            statusEl.innerText = "Low Match";
        }

        const matchingSkillsEl = document.getElementById('matching-skills');
        if (data.matching_skills && data.matching_skills.length > 0) {
            matchingSkillsEl.innerHTML = data.matching_skills
                .map(s => `<span class="tag tag-match">${s}</span>`).join('');
        } else {
            matchingSkillsEl.innerHTML = '<span class="tag">None found</span>';
        }

        const missingSkillsEl = document.getElementById('missing-skills');
        if (data.missing_skills && data.missing_skills.length > 0) {
            missingSkillsEl.innerHTML = data.missing_skills
                .map(s => `<span class="tag tag-miss">${s}</span>`).join('');
        } else {
            missingSkillsEl.innerHTML = '<span class="tag">None found</span>';
        }

        const strengthsEl = document.getElementById('match-strengths');
        if (data.strengths && data.strengths.length > 0) {
            strengthsEl.innerHTML = data.strengths
                .map(s => `<li>${s}</li>`).join('');
        } else {
            strengthsEl.innerHTML = '<li>No specific strengths identified.</li>';
        }

        const weaknessesEl = document.getElementById('match-weaknesses');
        if (data.weaknesses && data.weaknesses.length > 0) {
            weaknessesEl.innerHTML = data.weaknesses
                .map(s => `<li>${s}</li>`).join('');
        } else {
            weaknessesEl.innerHTML = '<li>No specific weaknesses identified.</li>';
        }
    }
});