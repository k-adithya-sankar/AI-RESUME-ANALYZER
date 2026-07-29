/**
 * dashboard.js
 * Handles dashboard data fetching and UI updates.
 */

document.addEventListener("DOMContentLoaded", async () => {

    requireAuth();

    try {

        // ================================
        // USER
        // ================================

        try {
            const user = await apiGet("/auth/me");

            if (user && user.name) {
                const welcome = document.getElementById("welcome-message");

                if (welcome) {
                    welcome.innerText = `Welcome back, ${user.name}!`;
                }
            }

        } catch (error) {
            console.log("Could not fetch user profile.");
        }


        // ================================
        // LOAD RESUMES
        // ================================

        await loadRecentResumes();


        // ================================
        // LOAD JOBS
        // ================================

        await loadRecentJobs();


    } catch (error) {

        console.error("Error loading dashboard:", error);

    }

});


// =====================================================
// LOAD RECENT RESUMES
// =====================================================

async function loadRecentResumes() {

    const container = document.getElementById("recent-resumes-list");

    if (!container) {
        return;
    }

    try {

        const resumes = await apiGet("/resumes/");

        console.log("Resumes:", resumes);

        if (!resumes || resumes.length === 0) {

            container.className = "empty-state";

            container.innerHTML = `
                <i class="fa-solid fa-folder-open"></i>
                <p>No resumes uploaded yet.</p>

                <a href="upload.html" class="btn btn-outline mt-2">
                    Upload Now
                </a>
            `;

            return;
        }


        // ==========================================
        // SHOW MOST RECENT 5 RESUMES
        // ==========================================

        const recentResumes = resumes.slice(0, 5);

        container.className = "resume-list";

        container.innerHTML = recentResumes.map(resume => {

            const date = resume.created_at
                ? new Date(resume.created_at).toLocaleDateString()
                : "Unknown date";


            return `
                <div class="resume-item">

                    <div class="resume-info">

                        <div class="resume-icon">
                            <i class="fa-solid fa-file-pdf"></i>
                        </div>

                        <div>
                            <h3>
                                ${escapeHtml(resume.filename || "Resume")}
                            </h3>

                            <p>
                                Uploaded ${date}
                            </p>
                        </div>

                    </div>


                    <div class="resume-actions">

                        <button
                            class="btn btn-primary"
                            onclick="viewResume(${resume.id})"
                        >
                            <i class="fa-solid fa-chart-line"></i>
                            Analyze
                        </button>

                    </div>

                </div>
            `;

        }).join("");


        // ==========================================
        // VIEW ALL
        // ==========================================

        const viewAllLinks = document.querySelectorAll(
            '.data-header a[href="upload.html"]'
        );

        viewAllLinks.forEach(link => {

            if (
                link.parentElement &&
                link.parentElement.querySelector("h2") &&
                link.parentElement.querySelector("h2").innerText === "Recent Resumes"
            ) {
                link.href = "resumes.html";
            }

        });


    } catch (error) {

        console.error("Could not load resumes:", error);

        container.className = "empty-state";

        container.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p>Could not load resumes.</p>
        `;
    }
}


// =====================================================
// VIEW ONE RESUME
// =====================================================

async function viewResume(resumeId) {

    if (!resumeId) {
        return;
    }

    // Save selected resume
    localStorage.setItem("selectedResumeId", resumeId);

    // Go to analysis page
    window.location.href = `analysis.html?resume_id=${resumeId}`;
}


// =====================================================
// LOAD RECENT JOBS
// =====================================================

async function loadRecentJobs() {

    const container = document.getElementById("recent-jobs-list");

    if (!container) {
        return;
    }

    try {

        const jobs = await apiGet("/applied-jobs/");

        console.log("Applied jobs:", jobs);

        if (!jobs || jobs.length === 0) {

            container.className = "empty-state";

            container.innerHTML = `
                <i class="fa-solid fa-box-open"></i>

                <p>
                    No job applications tracked yet.
                </p>

                <a
                    href="applied-jobs.html"
                    class="btn btn-outline mt-2"
                >
                    Add Job
                </a>
            `;

            return;
        }


        const recentJobs = jobs.slice(0, 5);

        container.className = "job-list";

        container.innerHTML = recentJobs.map(job => {

            const date = job.application_date
                ? new Date(job.application_date).toLocaleDateString()
                : "Unknown date";

            return `
                <div class="job-item">

                    <div>

                        <h3>
                            ${escapeHtml(job.job_title || "Job")}
                        </h3>

                        <p>
                            ${escapeHtml(job.company_name || "")}
                        </p>

                    </div>

                    <span>
                        ${date}
                    </span>

                </div>
            `;

        }).join("");


    } catch (error) {

        console.error("Could not load jobs:", error);

    }
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}