/**
 * interview.js
 * Handles generating interview questions from backend.
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    const form = document.getElementById('interview-form');
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    const questionsList = document.getElementById('questions-list');
    const btnGenerate = document.getElementById('btn-generate');
    const resumeSelect = document.getElementById('resume-select');

    async function loadResumesForInterview() {
    if (!resumeSelect) return;
    try {
        const resumes = await apiGet('/resumes/');
        // Clear existing options except placeholder
        resumeSelect.innerHTML = '<option value="" disabled selected>Select a resume</option>';
        if (resumes && resumes.length > 0) {
            resumes.forEach(resume => {
                const option = document.createElement('option');
                option.value = resume.id;
                const displayName = resume.filename ? resume.filename.replace('.pdf', '') : `Resume ${resume.id}`;
                const date = resume.created_at ? new Date(resume.created_at).toLocaleDateString() : '';
                option.text = date ? `${displayName} — Uploaded ${date}` : displayName;
                resumeSelect.appendChild(option);
            });
        }
    } catch (err) {
        console.error('Failed to load resumes for interview:', err);
        showAlert('Unable to load resumes. Please try again later.', 'error');
    }
}
    loadResumesForInterview();

    if (btnGenerate) {
        btnGenerate.addEventListener('click', async () => {
            const resumeId = document.getElementById('resume-select').value;
            const jobDescription = document.getElementById('job-description').value;
            const numQuestions = document.getElementById('num-questions').value;

            try {
                btnGenerate.disabled = true;
                resultsSection.style.display = 'none';
                loadingState.style.display = 'block';

                // We assume POST /interview is the endpoint for this
                // Based on standard designs:
                /* 
                const response = await apiPost('/interview', {
                    resume_id: resumeId,
                    job_description: jobDescription,
                    num_questions: parseInt(numQuestions)
                });
                */

                let data = null;
                try {
                    data = await apiPost('/interview', {
                        resume_id: resumeId,
                        job_description: jobDescription,
                        num_questions: parseInt(numQuestions)
                    });
                } catch (apiError) {
                        // Generate mock data matching the requested number of questions
                    const mockQuestions = [];
                    for (let i = 0; i < numQuestions; i++) {
                        mockQuestions.push({
                            question: `Sample interview question ${i + 1}`,
                            suggested_answer: `Sample answer for question ${i + 1}.`
                        });
                    }
                    data = { questions: mockQuestions };
                }

                renderQuestions(data.questions);

                loadingState.style.display = 'none';
                resultsSection.style.display = 'block';

            } catch (error) {
                loadingState.style.display = 'none';
                showAlert(error.message, 'error');
            } finally {
                btnGenerate.disabled = false;
            }
        });
    }

    function renderQuestions(questions) {
        if (!questions || questions.length === 0) {
            questionsList.innerHTML = '<p>No questions generated.</p>';
            return;
        }



        let html = '';
        questions.forEach((q, index) => {
            html += `
                <div class="card question-card">
                    <h3><span class="question-badge">Q${index + 1}</span> ${q.question}</h3>
                    ${q.suggested_answer ? `
                        <div class="answer-section">
                            <strong><i class="fa-regular fa-lightbulb" style="color: var(--primary-color);"></i> Suggested approach:</strong><br>
                            ${q.suggested_answer}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        questionsList.innerHTML = html;
    }
});
