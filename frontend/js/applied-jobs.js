/**
 * applied-jobs.js
 * Handles CRUD operations for applied jobs tracker using the backend database.
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    const jobsContainer = document.getElementById('jobs-container');
    const modal = document.getElementById('job-modal');
    const btnAddJob = document.getElementById('btn-add-job');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const jobForm = document.getElementById('job-form');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let jobsData = []; // Local state synced with DB

    // Initialize
    loadJobs();

    // Event Listeners
    btnAddJob.addEventListener('click', () => openModal());
    btnCloseModal.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form submit
    jobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const jobId = document.getElementById('job-id').value;
        const companyName = document.getElementById('company').value;
        const jobTitle = document.getElementById('job_title').value;
        const location = document.getElementById('location').value;
        const status = document.getElementById('status').value;
        const jobUrl = document.getElementById('job_url').value;
        const notes = document.getElementById('notes').value;

        // Map frontend fields to backend AppliedJobCreate / AppliedJobUpdate schemas
        const payload = {
            company_name: companyName,
            job_title: jobTitle,
            location: location || null,
            status: status,
            job_url: jobUrl || null,
            notes: notes || null,
            application_date: new Date().toISOString()
        };

        try {
            document.getElementById('btn-save-job').disabled = true;

            if (jobId) {
                // Update via API
                await apiPut(`/applied-jobs/${jobId}`, payload);
                showAlert('Job application updated successfully', 'success');
            } else {
                // Create via API
                await apiPost('/applied-jobs/', payload);
                showAlert('Job application saved successfully', 'success');
            }

            closeModal();
            await loadJobs(); // Reload jobs from backend
        } catch (error) {
            console.error('Error saving job:', error);
            showAlert(error.message || 'Failed to save job application.', 'error');
        } finally {
            document.getElementById('btn-save-job').disabled = false;
        }
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderJobs(e.target.dataset.filter);
        });
    });

    async function loadJobs() {
        try {
            // Fetch from backend
            const response = await apiGet('/applied-jobs/');
            if (Array.isArray(response)) {
                jobsData = response;
            } else {
                jobsData = [];
            }
            const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderJobs(activeFilter);
        } catch (error) {
            console.error("Could not load jobs from backend:", error);
            showAlert("Could not load jobs. Make sure the backend server is running.", "error");
        }
    }

    function renderJobs(filter) {
        jobsContainer.innerHTML = '';
        
        const filteredJobs = filter === 'all' 
            ? jobsData 
            : jobsData.filter(job => job.status === filter);

        if (filteredJobs.length === 0) {
            jobsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <p>No jobs found.</p>
                </div>
            `;
            return;
        }

        filteredJobs.forEach(job => {
            const statusClass = `status-${job.status.replace('_', '-')}`;
            const statusText = job.status.replace('_', ' ');
            const dateStr = job.application_date 
                ? new Date(job.application_date).toLocaleDateString()
                : 'N/A';

            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <div class="job-info">
                    <h3>${job.job_title} at ${job.company_name}</h3>
                    <p>
                        ${job.location ? `<span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>` : ''}
                        <span><i class="fa-regular fa-calendar"></i> Applied: ${dateStr}</span>
                    </p>
                </div>
                <div class="job-actions">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <button class="btn btn-outline edit-btn" data-id="${job.id}" style="padding: 0.5rem; border: none;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-outline delete-btn" data-id="${job.id}" style="padding: 0.5rem; border: none; color: var(--error);"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            jobsContainer.appendChild(card);
        });

        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const job = jobsData.find(j => j.id == id);
                if (job) openModal(job);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Are you sure you want to delete this job application?')) {
                    const id = e.currentTarget.dataset.id;
                    try {
                        await apiDelete(`/applied-jobs/${id}`);
                        showAlert('Job application deleted', 'success');
                        await loadJobs(); // Reload jobs from backend
                    } catch (error) {
                        console.error('Failed to delete job:', error);
                        showAlert('Failed to delete job application.', 'error');
                    }
                }
            });
        });
    }

    function openModal(job = null) {
        document.getElementById('modal-title').innerText = job ? 'Edit Application' : 'Add Job Application';
        document.getElementById('job-id').value = job ? job.id : '';
        document.getElementById('company').value = job ? job.company_name : '';
        document.getElementById('job_title').value = job ? job.job_title : '';
        document.getElementById('location').value = job ? job.location || '' : '';
        document.getElementById('status').value = job ? job.status : 'applied';
        document.getElementById('job_url').value = job ? job.job_url || '' : '';
        document.getElementById('notes').value = job ? job.notes || '' : '';
        
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
        jobForm.reset();
    }
});
