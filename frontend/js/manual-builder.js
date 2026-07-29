// manual-builder.js
// Manual Resume Builder — uses shared ResumeTemplates system

document.addEventListener('DOMContentLoaded', async () => {

    requireAuth();

    // ─── DOM references ────────────────────────────────────────────────
    const templateListEl     = document.getElementById('template-list');
    const colorSelect        = document.getElementById('color-select');
    const fontSelect         = document.getElementById('font-select');
    const resumeTitle        = document.getElementById('resume-title');

    const fullName           = document.getElementById('full-name');
    const jobTitle           = document.getElementById('job-title');
    const locationInput      = document.getElementById('location');
    const emailInput         = document.getElementById('email');
    const phoneInput         = document.getElementById('phone');
    const summaryInput       = document.getElementById('summary');

    const experienceList     = document.getElementById('experience-list');
    const educationList      = document.getElementById('education-list');
    const projectsList       = document.getElementById('projects-list');
    const certificationsList = document.getElementById('certifications-list');

    const addExperienceBtn   = document.getElementById('add-experience');
    const addEducationBtn    = document.getElementById('add-education');
    const addProjectBtn      = document.getElementById('add-project');
    const addCertBtn         = document.getElementById('add-cert');

    const skillInput         = document.getElementById('skill-input');
    const skillsContainer    = document.getElementById('skills-container');

    const previewRoot        = document.getElementById('preview-root');
    const btnSave            = document.getElementById('btn-save-resume');
    const btnPrint           = document.getElementById('btn-print');

    // ─── Shared template system ────────────────────────────────────────
    const { TEMPLATES, thumbFns, RENDERERS, buildPrintCSS, esc } = window.ResumeTemplates;

    // ─── State ────────────────────────────────────────────────────────
    let selectedTemplate = 'template-1';
    let accentColor      = colorSelect.value || '#0ea5e9';
    let selectedFont     = fontSelect.value;
    let tags             = [];
    let experiences      = [];
    let educations       = [];
    let projects         = [];
    let certifications   = [];

    // ─── Controls → state ─────────────────────────────────────────────
    colorSelect.addEventListener('change', () => {
        accentColor = colorSelect.value;
        applyPreviewMeta();
    });

    fontSelect.addEventListener('change', () => {
        selectedFont = fontSelect.value;
        applyPreviewMeta();
    });

    [fullName, jobTitle, locationInput, emailInput, phoneInput, summaryInput, resumeTitle]
        .forEach(el => el.addEventListener('input', renderPreview));

    // ─── Apply accent / font to preview-root ──────────────────────────
    function applyPreviewMeta() {
        previewRoot.className = `preview-root ${selectedTemplate}`;
        previewRoot.style.setProperty('--accent', accentColor);
        previewRoot.style.fontFamily = selectedFont;
    }

    // ─── Template Selector ────────────────────────────────────────────
    function renderTemplateList() {
        templateListEl.innerHTML = '';
        TEMPLATES.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `template-thumb ${t.id === selectedTemplate ? 'selected' : ''}`;
            btn.title = t.name;
            btn.dataset.template = t.id;
            btn.innerHTML = (thumbFns[t.id] || thumbFns['template-1'])();
            btn.addEventListener('click', () => {
                selectedTemplate = t.id;
                document.querySelectorAll('#template-list .template-thumb')
                    .forEach(x => x.classList.remove('selected'));
                btn.classList.add('selected');
                applyPreviewMeta();
                renderPreview();
            });
            templateListEl.appendChild(btn);
        });
    }

    // ─── Skills ───────────────────────────────────────────────────────
    skillInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && skillInput.value.trim()) {
            e.preventDefault();
            tags.push(skillInput.value.trim());
            skillInput.value = '';
            renderSkillsControls();
            renderPreview();
        }
    });

    function renderSkillsControls() {
        skillsContainer.innerHTML = '';
        tags.forEach((t, idx) => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerText = t;
            const rem = document.createElement('button');
            rem.className = 'tag-remove';
            rem.innerText = '×';
            rem.title = 'Remove';
            rem.addEventListener('click', () => {
                tags.splice(idx, 1);
                renderSkillsControls();
                renderPreview();
            });
            tag.appendChild(rem);
            skillsContainer.appendChild(tag);
        });
    }

    // ─── Experience ───────────────────────────────────────────────────
    addExperienceBtn.addEventListener('click', () => {
        experiences.push({ company:'', title:'', start:'', end:'', description:'' });
        renderExperienceControls();
    });

    function renderExperienceControls() {
        experienceList.innerHTML = '';
        experiences.forEach((item, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'dynamic-item';
            wrapper.innerHTML = `
                <div class="two-col">
                    <input data-idx="${idx}" data-field="title" placeholder="Position title" class="form-control" value="${esc(item.title)}">
                    <input data-idx="${idx}" data-field="company" placeholder="Company" class="form-control" value="${esc(item.company)}">
                </div>
                <div class="two-col">
                    <input data-idx="${idx}" data-field="start" placeholder="Start year" class="form-control" value="${esc(item.start)}">
                    <input data-idx="${idx}" data-field="end" placeholder="End year or Present" class="form-control" value="${esc(item.end)}">
                </div>
                <textarea data-idx="${idx}" data-field="description" class="form-control" placeholder="Short description">${esc(item.description)}</textarea>
                <div class="control-row">
                    <button data-idx="${idx}" class="btn btn-outline remove-experience">Remove</button>
                </div>
            `;
            wrapper.querySelectorAll('[data-field]').forEach(inp => {
                inp.addEventListener('input', e => {
                    experiences[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
                    renderPreview();
                });
            });
            wrapper.querySelector('.remove-experience').addEventListener('click', () => {
                experiences.splice(idx, 1);
                renderExperienceControls();
                renderPreview();
            });
            experienceList.appendChild(wrapper);
        });
    }

    // ─── Education ────────────────────────────────────────────────────
    addEducationBtn.addEventListener('click', () => {
        educations.push({ school:'', degree:'', start:'', end:'', description:'' });
        renderEducationControls();
    });

    function renderEducationControls() {
        educationList.innerHTML = '';
        educations.forEach((item, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'dynamic-item';
            wrapper.innerHTML = `
                <div class="two-col">
                    <input data-idx="${idx}" data-field="degree" placeholder="Degree" class="form-control" value="${esc(item.degree)}">
                    <input data-idx="${idx}" data-field="school" placeholder="Institution" class="form-control" value="${esc(item.school)}">
                </div>
                <div class="two-col">
                    <input data-idx="${idx}" data-field="start" placeholder="Start year" class="form-control" value="${esc(item.start)}">
                    <input data-idx="${idx}" data-field="end" placeholder="End year" class="form-control" value="${esc(item.end)}">
                </div>
                <textarea data-idx="${idx}" data-field="description" class="form-control" placeholder="Additional notes">${esc(item.description)}</textarea>
                <div class="control-row">
                    <button data-idx="${idx}" class="btn btn-outline remove-education">Remove</button>
                </div>
            `;
            wrapper.querySelectorAll('[data-field]').forEach(inp => {
                inp.addEventListener('input', e => {
                    educations[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
                    renderPreview();
                });
            });
            wrapper.querySelector('.remove-education').addEventListener('click', () => {
                educations.splice(idx, 1);
                renderEducationControls();
                renderPreview();
            });
            educationList.appendChild(wrapper);
        });
    }

    // ─── Projects ─────────────────────────────────────────────────────
    addProjectBtn.addEventListener('click', () => {
        projects.push({ title:'', description:'' });
        renderProjectsControls();
    });

    function renderProjectsControls() {
        projectsList.innerHTML = '';
        projects.forEach((p, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'dynamic-item';
            wrapper.innerHTML = `
                <input data-idx="${i}" data-field="title" class="form-control" placeholder="Project title" value="${esc(p.title)}">
                <textarea data-idx="${i}" data-field="description" class="form-control" placeholder="Short description">${esc(p.description)}</textarea>
                <div class="control-row">
                    <button data-idx="${i}" class="btn btn-outline remove-project">Remove</button>
                </div>
            `;
            wrapper.querySelectorAll('[data-field]').forEach(inp => {
                inp.addEventListener('input', e => {
                    projects[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
                    renderPreview();
                });
            });
            wrapper.querySelector('.remove-project').addEventListener('click', () => {
                projects.splice(i, 1);
                renderProjectsControls();
                renderPreview();
            });
            projectsList.appendChild(wrapper);
        });
    }

    // ─── Certifications ───────────────────────────────────────────────
    addCertBtn.addEventListener('click', () => {
        certifications.push({ name:'', issuer:'', year:'' });
        renderCertificationsControls();
    });

    function renderCertificationsControls() {
        certificationsList.innerHTML = '';
        certifications.forEach((c, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'dynamic-item';
            wrapper.innerHTML = `
                <div class="two-col">
                    <input data-idx="${i}" data-field="name" class="form-control" placeholder="Certification" value="${esc(c.name)}">
                    <input data-idx="${i}" data-field="issuer" class="form-control" placeholder="Issuer" value="${esc(c.issuer)}">
                </div>
                <div class="two-col">
                    <input data-idx="${i}" data-field="year" class="form-control" placeholder="Year" value="${esc(c.year)}">
                    <div></div>
                </div>
                <div class="control-row">
                    <button data-idx="${i}" class="btn btn-outline remove-cert">Remove</button>
                </div>
            `;
            wrapper.querySelectorAll('[data-field]').forEach(inp => {
                inp.addEventListener('input', e => {
                    certifications[+e.target.dataset.idx][e.target.dataset.field] = e.target.value;
                    renderPreview();
                });
            });
            wrapper.querySelector('.remove-cert').addEventListener('click', () => {
                certifications.splice(i, 1);
                renderCertificationsControls();
                renderPreview();
            });
            certificationsList.appendChild(wrapper);
        });
    }

    // ─── Render Preview ───────────────────────────────────────────────
    function getData() {
        return {
            name:           fullName.value       || '',
            job:            jobTitle.value        || '',
            location:       locationInput.value   || '',
            email:          emailInput.value      || '',
            phone:          phoneInput.value      || '',
            summary:        summaryInput.value    || '',
            skills:         tags,
            experience:     experiences,
            education:      educations,
            projects:       projects,
            certifications: certifications
        };
    }

    function renderPreview() {
        const renderer = RENDERERS[selectedTemplate] || RENDERERS['template-1'];
        previewRoot.innerHTML = renderer(getData());
    }

    // ─── Save ─────────────────────────────────────────────────────────
    btnSave.addEventListener('click', async () => {
        const d = getData();
        const title = resumeTitle.value || (d.name ? `${d.name} - Resume` : 'Manual Resume');

        const payload = {
            title,
            template: selectedTemplate,
            mode: 'manual',
            personal: { name: d.name, job_title: d.job, location: d.location, email: d.email, phone: d.phone },
            summary:        d.summary,
            skills:         d.skills,
            experience:     d.experience,
            education:      d.education,
            projects:       d.projects,
            certifications: d.certifications,
            customization:  { theme: accentColor, font: selectedFont }
        };

        try {
            btnSave.disabled = true;
            btnSave.innerText = 'Saving...';
            await apiPost('/resume-builder/manual', payload);
            showAlert('Resume saved successfully!', 'success');
            setTimeout(() => { window.location.href = 'resume-builder.html'; }, 900);
        } catch (error) {
            console.error('Save error', error);
            showAlert(error.message || 'Could not save resume', 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.innerText = 'Save Resume';
        }
    });

    // ─── Print ────────────────────────────────────────────────────────
    btnPrint.addEventListener('click', () => {
        const w = window.open('', '_blank', 'width=900,height=1200');
        if (!w) { showAlert('Popups blocked. Allow popups to print.', 'error'); return; }
        const printCSS = buildPrintCSS(selectedTemplate, accentColor, selectedFont);
        const paperHTML = previewRoot.querySelector('.resume-paper')
            ? previewRoot.querySelector('.resume-paper').outerHTML
            : previewRoot.innerHTML;
        w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
            <style>@page{size:A4;margin:10mm;}${printCSS}</style></head><body>${paperHTML}</body></html>`);
        w.document.close();
        w.focus();
        setTimeout(() => w.print(), 600);
    });

    // ─── Bootstrap ────────────────────────────────────────────────────
    applyPreviewMeta();
    renderTemplateList();
    renderPreview();

});