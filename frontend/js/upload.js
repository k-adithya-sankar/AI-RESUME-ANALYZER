/**
 * upload.js
 * Handles resume upload and manual AI analysis trigger.
 */

document.addEventListener('DOMContentLoaded', () => {

    requireAuth();

    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const loadingState = document.getElementById('loading-state');
    const resultContainer = document.getElementById('result-container');
    const resumeIdDisplay = document.getElementById('resume-id-display');
    const btnAnalyze = document.getElementById('btn-analyze');

    let currentResumeId = null;


    // ==========================================
    // DRAG & DROP
    // ==========================================

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {

        uploadArea.addEventListener(
            eventName,
            preventDefaults,
            false
        );

        document.body.addEventListener(
            eventName,
            preventDefaults,
            false
        );
    });


    ['dragenter', 'dragover'].forEach(eventName => {

        uploadArea.addEventListener(
            eventName,
            highlight,
            false
        );
    });


    ['dragleave', 'drop'].forEach(eventName => {

        uploadArea.addEventListener(
            eventName,
            unhighlight,
            false
        );
    });


    uploadArea.addEventListener(
        'drop',
        handleDrop,
        false
    );


    // ==========================================
    // FILE SELECT
    // ==========================================

    fileInput.addEventListener('change', function () {

        if (this.files && this.files.length > 0) {

            uploadFile(this.files[0]);

        }

    });


    function preventDefaults(event) {

        event.preventDefault();
        event.stopPropagation();

    }


    function highlight() {

        uploadArea.classList.add('dragover');

    }


    function unhighlight() {

        uploadArea.classList.remove('dragover');

    }


    function handleDrop(event) {

        const files = event.dataTransfer.files;

        if (files && files.length > 0) {

            uploadFile(files[0]);

        }

    }


    // ==========================================
    // UPLOAD FILE
    // ==========================================

    async function uploadFile(file) {

        console.log("Selected file:", file.name);


        // Validate file type

        const fileName = file.name.toLowerCase();

        const isPDF = fileName.endsWith('.pdf');
        const isDOCX = fileName.endsWith('.docx');

        if (!isPDF && !isDOCX) {

            showAlert(
                'Please upload a PDF or DOCX file.',
                'error'
            );

            return;
        }


        // Validate file size - 5MB

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {

            showAlert(
                'File size must be less than 5MB.',
                'error'
            );

            return;
        }


        // Create FormData

        const formData = new FormData();

        formData.append('file', file);


        try {

            // Show loading

            uploadArea.style.display = 'none';

            resultContainer.style.display = 'none';

            loadingState.style.display = 'block';


            console.log("Uploading resume...");


            // ==========================================
            // CALL BACKEND
            // POST /upload/
            // ==========================================

            const response = await apiPost(
                '/upload/',
                formData,
                true
            );


            console.log("Upload response:", response);


            // Hide loading

            loadingState.style.display = 'none';


            // ==========================================
            // GET RESUME ID
            // ==========================================

            if (
                response &&
                response.resume_id !== undefined &&
                response.resume_id !== null
            ) {

                currentResumeId = response.resume_id;


                console.log(
                    "Resume ID:",
                    currentResumeId
                );


                // Display uploaded information

                resumeIdDisplay.innerHTML = `
                    <strong>${escapeHtml(file.name)}</strong>
                    <br>
                    <span style="font-size: 0.85rem;">
                        Resume ID: ${escapeHtml(String(currentResumeId))}
                    </span>
                `;


                // ==========================================
                // SHOW SUCCESS + ANALYZE BUTTON
                // ==========================================

                resultContainer.style.display = 'block';

                btnAnalyze.style.display = 'inline-flex';

                btnAnalyze.disabled = false;

                btnAnalyze.innerText = 'Analyze Resume';


                showAlert(
                    'Resume uploaded successfully!',
                    'success'
                );

            }

            else {

                console.error(
                    "Upload response did not contain resume_id:",
                    response
                );


                uploadArea.style.display = 'block';


                showAlert(
                    'Resume uploaded, but the server did not return a resume ID.',
                    'error'
                );

            }


        } catch (error) {

            console.error(
                "Upload error:",
                error
            );


            loadingState.style.display = 'none';

            uploadArea.style.display = 'block';


            showAlert(
                error.message || 'Failed to upload resume.',
                'error'
            );

        }

    }


    // ==========================================
    // ANALYZE BUTTON
    // ==========================================

    btnAnalyze.addEventListener('click', async () => {

        if (!currentResumeId) {

            showAlert(
                'No resume found. Please upload your resume again.',
                'error'
            );

            return;
        }


        try {

            console.log(
                "Starting analysis for resume:",
                currentResumeId
            );


            // Disable button

            btnAnalyze.disabled = true;

            btnAnalyze.innerText = 'Analyzing Resume...';


            // ==========================================
            // CALL AI ANALYSIS
            // POST /analyze/{resume_id}
            // ==========================================

            const data = await apiPost(
                `/analyze/${currentResumeId}`
            );


            console.log(
                "Analysis response:",
                data
            );


            // ==========================================
            // SAVE RESULT
            // ==========================================

            sessionStorage.setItem(
                'resumeAnalysisData',
                JSON.stringify(data)
            );


            // ==========================================
            // GO TO ANALYSIS PAGE
            // ==========================================

            window.location.href =
                `analysis.html?id=${currentResumeId}`;


        } catch (error) {

            console.error(
                "Analysis error:",
                error
            );


            btnAnalyze.disabled = false;

            btnAnalyze.innerText = 'Analyze Resume';


            showAlert(
                error.message || 'Failed to analyze resume.',
                'error'
            );

        }

    });


    // ==========================================
    // HTML ESCAPE
    // ==========================================

    function escapeHtml(value) {

        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    }

});