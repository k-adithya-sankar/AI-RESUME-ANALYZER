document.addEventListener("DOMContentLoaded", async () => {

    requireAuth();

    await loadResumes();

});


async function loadResumes() {

    const container = document.getElementById("resumes-container");

    try {

        const resumes = await apiGet("/resumes/");

        console.log("Saved resumes:", resumes);


        if (!resumes || resumes.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <i class="fa-solid fa-folder-open"></i>

                    <h2>No resumes yet</h2>

                    <p>
                        Upload your first resume to get started.
                    </p>

                    <a
                        href="upload.html"
                        class="btn btn-primary"
                    >
                        Upload Resume
                    </a>

                </div>
            `;

            return;
        }


        container.innerHTML = `

            <div class="data-header">

                <h2>
                    My Resumes (${resumes.length})
                </h2>

            </div>


            <div class="resume-list">

                ${resumes.map(resume => {

                    const date = resume.created_at
                        ? new Date(
                            resume.created_at
                          ).toLocaleDateString()
                        : "Unknown date";


                    const analyzed =
                        resume.analysis !== null &&
                        resume.analysis !== "";


                    return `

                        <div class="resume-item">

                            <div class="resume-info">

                                <div class="resume-icon">

                                    <i class="fa-solid fa-file-pdf"></i>

                                </div>


                                <div>

                                    <h3>
                                        ${escapeHtml(
                                            resume.filename ||
                                            "Resume"
                                        )}
                                    </h3>

                                    <p>
                                        Uploaded ${date}
                                    </p>

                                    <p>

                                        ${
                                            analyzed
                                            ? `
                                                <span
                                                    style="
                                                        color:green;
                                                        font-weight:600;
                                                    "
                                                >
                                                    <i class="fa-solid fa-circle-check"></i>
                                                    Analyzed
                                                </span>
                                              `
                                            : `
                                                <span
                                                    style="
                                                        color:#777;
                                                    "
                                                >
                                                    Not analyzed
                                                </span>
                                              `
                                        }

                                    </p>

                                </div>

                            </div>


                            <div class="resume-actions">

                                <button
                                    class="btn btn-primary"
                                    onclick="openResume(${resume.id})"
                                >

                                    <i class="fa-solid fa-chart-line"></i>

                                    ${
                                        analyzed
                                        ? "View Analysis"
                                        : "Analyze"
                                    }

                                </button>


                                <button
                                    class="btn btn-outline"
                                    onclick="deleteResume(${resume.id})"
                                >

                                    <i class="fa-solid fa-trash"></i>

                                </button>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h2>Unable to load resumes</h2>

                <p>
                    Please make sure you are logged in.
                </p>

            </div>

        `;
    }

}


// =====================================================
// OPEN RESUME
// =====================================================

function openResume(resumeId) {

    localStorage.setItem(
        "selectedResumeId",
        resumeId
    );

    window.location.href =
        `analysis.html?resume_id=${resumeId}`;

}


// =====================================================
// DELETE RESUME
// =====================================================

async function deleteResume(resumeId) {

    const confirmed = confirm(
        "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
        return;
    }


    try {

        await apiDelete(
            `/resumes/${resumeId}`
        );

        await loadResumes();

    } catch (error) {

        console.error(error);

        alert(
            "Could not delete resume."
        );

    }

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}