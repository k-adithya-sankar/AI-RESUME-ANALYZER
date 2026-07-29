document.addEventListener('DOMContentLoaded', async () => {

    requireAuth();

    const loadingState = document.getElementById('loading-state');
    const analysisContent = document.getElementById('analysis-content');

    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('resume_id');

    if (!resumeId) {

        showAlert(
            'No Resume ID provided. Redirecting to upload...',
            'error'
        );

        setTimeout(() => {
            window.location.href = 'upload.html';
        }, 2000);

        return;
    }

    try {

        const resume = await apiGet(`/resumes/${resumeId}`);

        const analysisData = parseAnalysisData(resume);

        if (analysisData) {

            renderAnalysis(analysisData);

        } else {

            showNoAnalysisState();

        }

        loadingState.style.display = 'none';
        analysisContent.style.display = 'block';

    } catch (error) {

        console.error('Analysis page error:', error);

        loadingState.style.display = 'none';

        showAlert(
            error.message || 'Unable to load resume analysis.',
            'error'
        );

    }

});

function parseAnalysisData(resume) {

    if (!resume) return null;

    if (resume.analysis && typeof resume.analysis === 'object') {
        return resume.analysis;
    }

    if (typeof resume.analysis === 'string') {

        try {
            return JSON.parse(resume.analysis);
        } catch (e) {
            return null;
        }

    }

    return null;

}

function showNoAnalysisState() {

    const analysisContent = document.getElementById('analysis-content');

    const scoreEl = document.getElementById('ats-score');
    const scoreCircle = document.getElementById('ats-score-circle');
    const scoreText = document.getElementById('score-text');
    const summaryEl = document.getElementById('overall-summary');
    const skillsList = document.getElementById('skills-list');
    const feedbackList = document.getElementById('feedback-list');

    scoreEl.innerText = '0';

    scoreCircle.classList.remove('score-high', 'score-medium', 'score-low');
    scoreCircle.classList.add('score-low');

    scoreText.innerText =
        'This resume has not been analyzed yet.';

    summaryEl.innerText =
        'This resume has not been analyzed yet.';

    skillsList.innerHTML =
        '<span class="tag">No analysis available</span>';

    feedbackList.innerHTML = `
        <li style="color: var(--text-light);">
            Analyze this resume to see ATS feedback and recommendations.
        </li>
    `;

    const existingButton = document.getElementById('analyze-now-btn');
    if (existingButton) {
        existingButton.remove();
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mb-3';
    buttonContainer.innerHTML =
        '<button id="analyze-now-btn" class="btn btn-primary">Analyze Resume</button>';

    analysisContent.prepend(buttonContainer);

    document.getElementById('analyze-now-btn').addEventListener('click', async () => {
        await runAnalysis();
    });

}

async function runAnalysis() {

    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('resume_id');

    if (!resumeId) {
        showAlert('No Resume ID found.', 'error');
        return;
    }

    const analyzeButton = document.getElementById('analyze-now-btn');

    if (analyzeButton) {
        analyzeButton.disabled = true;
        analyzeButton.innerText = 'Analyzing...';
    }

    try {

        const data = await apiPost(`/analyze/${resumeId}`);

        renderAnalysis(data);

        const loadingState = document.getElementById('loading-state');
        const analysisContent = document.getElementById('analysis-content');

        loadingState.style.display = 'none';
        analysisContent.style.display = 'block';

        if (analyzeButton) {
            analyzeButton.remove();
        }

    } catch (error) {

        console.error('Analyze resume error:', error);

        showAlert(
            error.message || 'Unable to analyze resume.',
            'error'
        );

        if (analyzeButton) {
            analyzeButton.disabled = false;
            analyzeButton.innerText = 'Analyze Resume';
        }

    }

}

function renderAnalysis(data) {

    const atsScore = data.ats?.score ?? data.score ?? 0;

    const scoreEl = document.getElementById('ats-score');
    const scoreCircle = document.getElementById('ats-score-circle');
    const scoreText = document.getElementById('score-text');

    scoreEl.innerText = atsScore;

    scoreCircle.classList.remove('score-high', 'score-medium', 'score-low');

    if (atsScore >= 80) {
        scoreCircle.classList.add('score-high');
    } else if (atsScore >= 50) {
        scoreCircle.classList.add('score-medium');
    } else {
        scoreCircle.classList.add('score-low');
    }

    if (atsScore >= 80) {
        scoreText.innerText =
            'Excellent ATS compatibility. Your resume contains strong keywords and is well optimized for applicant tracking systems.';
    } else if (atsScore >= 50) {
        scoreText.innerText =
            'Your resume has reasonable ATS compatibility but could benefit from additional keyword optimization.';
    } else {
        scoreText.innerText =
            'Your resume needs significant ATS optimization. Consider improving keywords, formatting, and job-specific content.';
    }

    const summary =
        data.summary ||
        'No summary provided.';

    document.getElementById('overall-summary').innerText = summary;

    const skillsList = document.getElementById('skills-list');

    const technicalSkills = data.skills?.technical || [];
    const softSkills = data.skills?.soft || [];
    const tools = data.skills?.tools || [];

    const allSkills = [
        ...technicalSkills,
        ...softSkills,
        ...tools
    ];

    if (allSkills.length > 0) {

        skillsList.innerHTML =
            allSkills
                .map(skill => {
                    return `
                        <span class="tag matched">
                            ${escapeHtml(skill)}
                        </span>
                    `;
                })
                .join('');

    } else {

        skillsList.innerHTML =
            '<span class="tag">No specific skills detected</span>';

    }

    const feedbackList = document.getElementById('feedback-list');

    let feedbackHTML = '';

    const strengths = data.strengths || [];
    strengths.forEach(strength => {
        feedbackHTML += `
            <li>
                <i class="fa-solid fa-circle-plus feedback-icon strength-icon"></i>
                <div>
                    <strong>Strength</strong>
                    <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem;">
                        ${escapeHtml(strength)}
                    </p>
                </div>
            </li>
        `;
    });

    const weaknesses = data.weaknesses || [];
    weaknesses.forEach(weakness => {
        feedbackHTML += `
            <li>
                <i class="fa-solid fa-circle-minus feedback-icon weakness-icon"></i>
                <div>
                    <strong>Weakness</strong>
                    <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem;">
                        ${escapeHtml(weakness)}
                    </p>
                </div>
            </li>
        `;
    });

    const recommendations = data.recommendations || [];
    recommendations.forEach(recommendation => {
        feedbackHTML += `
            <li>
                <i class="fa-regular fa-lightbulb feedback-icon suggestion-icon"></i>
                <div>
                    <strong>Recommendation</strong>
                    <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem;">
                        ${escapeHtml(recommendation)}
                    </p>
                </div>
            </li>
        `;
    });

    const missingKeywords = data.missing_keywords || [];
    missingKeywords.forEach(keyword => {
        feedbackHTML += `
            <li>
                <i class="fa-solid fa-key feedback-icon weakness-icon"></i>
                <div>
                    <strong>Missing Keyword</strong>
                    <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.25rem;">
                        ${escapeHtml(keyword)}
                    </p>
                </div>
            </li>
        `;
    });

    if (!feedbackHTML) {
        feedbackHTML = `
            <li style="color: var(--text-light);">
                No detailed feedback available.
            </li>
        `;
    }

    feedbackList.innerHTML = feedbackHTML;

}

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}