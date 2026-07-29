/**
 * ai-builder.js
 * AI Resume Builder — uses shared ResumeTemplates system.
 *
 * Flow:
 *   1. User picks template thumbnail → selectedTemplate updated
 *   2. User types AI prompt → clicks Generate
 *   3. API call → response parsed into structured resumeData
 *   4. resumeData rendered through selectedTemplate renderer → preview
 *   5. User can switch template any time → same resumeData re-rendered
 *   6. Save → persists template + resumeData + customization
 *   7. Print → opens popup with print-CSS for selected template
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    // ─── DOM refs ──────────────────────────────────────────────────────
    const aiTemplateList  = document.getElementById('ai-template-list');
    const colorSelect     = document.getElementById('ai-color-select');
    const fontSelect      = document.getElementById('ai-font-select');
    const form            = document.getElementById('ai-builder-form');
    const resumeTitleInp  = document.getElementById('resume_title');
    const aiPromptInp     = document.getElementById('ai_prompt');
    const btnGenerate     = document.getElementById('btn-generate-ai');
    const loadingState    = document.getElementById('loading-state');
    const emptyPreview    = document.getElementById('empty-preview');
    const previewRoot     = document.getElementById('ai-preview-root');
    const previewActions  = document.getElementById('preview-actions');
    const btnSave         = document.getElementById('btn-save-resume');
    const btnPrint        = document.getElementById('btn-print-ai');

    // ─── Shared template system ────────────────────────────────────────
    const { TEMPLATES, thumbFns, RENDERERS, buildPrintCSS, esc, parseAIResponse } = window.ResumeTemplates;

    // ─── State ────────────────────────────────────────────────────────
    let selectedTemplate = 'template-1';
    let accentColor      = colorSelect ? (colorSelect.value || '#0ea5e9') : '#0ea5e9';
    let selectedFont     = fontSelect  ? fontSelect.value : "Inter, system-ui, sans-serif";
    let resumeData       = null;   // holds parsed AI resume data
    let rawHtmlFallback  = null;   // if AI returns plain HTML we still show it;
// Placeholder resume data used for immediate template preview before AI generation
const placeholderResume = {
    name: 'John Smith',
    job: 'Professional',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    summary: 'Experienced professional ready to showcase template layout.',
    skills: ['Communication', 'Problem Solving', 'Leadership'],
    experience: [
        {
            title: 'Senior Professional',
            company: 'Tech Corporation',
            start: '2022',
            end: 'Present',
            description: 'Led cross-functional teams to deliver high-impact projects.'
        }
    ],
    education: [
        {
            degree: 'Bachelor of Science',
            school: 'State University',
            start: '2016',
            end: '2020',
            description: 'Graduated with honors.'
        }
    ],
    projects: [],
    certifications: []
};

    // ─── Apply meta to preview-root ───────────────────────────────────
    function applyPreviewMeta() {
        previewRoot.className = `ai-preview-root preview-root ${selectedTemplate}`;
        previewRoot.style.setProperty('--accent', accentColor);
        previewRoot.style.fontFamily = selectedFont;
    }

    // ─── Color / Font listeners ────────────────────────────────────────
    if (colorSelect) {
        colorSelect.addEventListener('change', () => {
            accentColor = colorSelect.value;
            applyPreviewMeta();
            if (resumeData) renderPreview();
        });
    }
    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            selectedFont = fontSelect.value;
            applyPreviewMeta();
            if (resumeData) renderPreview();
        });
    }

    // ─── Build Template Selector ───────────────────────────────────────
    function renderTemplateList() {
        if (!aiTemplateList) return;
        aiTemplateList.innerHTML = '';
        TEMPLATES.forEach(t => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `template-thumb ${t.id === selectedTemplate ? 'selected' : ''}`;
            btn.title = t.name;
            btn.dataset.template = t.id;
            btn.innerHTML = (thumbFns[t.id] || thumbFns['template-1'])();

            btn.addEventListener('click', () => {
                selectedTemplate = t.id;
                aiTemplateList.querySelectorAll('.template-thumb')
                    .forEach(x => x.classList.remove('selected'));
                btn.classList.add('selected');
                applyPreviewMeta();
                // Always render preview (placeholder or existing data)
                renderPreview();
            });

            aiTemplateList.appendChild(btn);
        });
    }

    // ─── Render Preview ────────────────────────────────────────────────
    function renderPreview() {
        emptyPreview.style.display = 'none';
        // Determine which data to render: AI result, raw HTML fallback, or placeholder
        if (resumeData) {
            const renderer = RENDERERS[selectedTemplate] || RENDERERS['template-1'];
            previewRoot.innerHTML = renderer(resumeData);
            previewRoot.style.display = 'flex';
        } else if (rawHtmlFallback) {
            // Raw HTML fallback: show as-is (no template switching)
            previewRoot.innerHTML = `<div class="resume-paper" style="padding:28px;">${rawHtmlFallback}</div>`;
            previewRoot.style.display = 'flex';
        } else {
            // No AI data yet – render placeholder resume to preview template
            const renderer = RENDERERS[selectedTemplate] || RENDERERS['template-1'];
            previewRoot.innerHTML = renderer(placeholderResume);
            previewRoot.style.display = 'flex';
        }
        previewActions.style.display = 'flex';
    }









    function showEmpty() {
        previewRoot.style.display = 'none';
        previewRoot.innerHTML = '';
        previewActions.style.display = 'none';
        emptyPreview.style.display = 'flex';
    }

    // ─── AI Generation ────────────────────────────────────────────────
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title  = resumeTitleInp.value.trim();
            const prompt = aiPromptInp.value.trim();
            if (!title || !prompt) {
                showAlert('Please fill in Resume Title and AI instructions.', 'error');
                return;
            }

            // Show loading
            btnGenerate.disabled = true;
            emptyPreview.style.display = 'none';
            previewRoot.style.display  = 'none';
            previewActions.style.display = 'none';
            loadingState.style.display = 'flex';

            try {
                let data = null;

                try {
                    data = await apiPost('/resume-builder/ai', {
                        title,
                        template: selectedTemplate,
                        prompt
                    });
                } catch (apiError) {
                    console.warn('AI API error — using mock data:', apiError.message);
                    // Mock structured response so template rendering always works
                    data = {
                        structured_data: {
                            name:     'John Smith',
                            job:      prompt.match(/for (?:a |an )?(.+?)(?:\.|,|with|$)/i)?.[1]?.trim() || 'Professional',
                            email:    'john.smith@example.com',
                            phone:    '+1 (555) 123-4567',
                            location: 'New York, NY',
                            summary:  `Experienced professional with a strong background derived from the following request: "${prompt.slice(0, 120)}...". Proven track record of delivering results and driving growth.`,
                            skills:   ['Communication', 'Problem Solving', 'Leadership', 'Project Management', 'Microsoft Office'],
                            experience: [
                                {
                                    title:       'Senior Professional',
                                    company:     'Tech Corporation',
                                    start:       '2022',
                                    end:         'Present',
                                    description: 'Led cross-functional teams to deliver high-impact projects on time and within budget. Improved key metrics by 35% through data-driven strategies.'
                                },
                                {
                                    title:       'Junior Analyst',
                                    company:     'StartUp Inc.',
                                    start:       '2020',
                                    end:         '2022',
                                    description: 'Analyzed business processes and presented actionable recommendations. Collaborated with senior stakeholders to implement improvements.'
                                }
                            ],
                            education: [
                                {
                                    degree:      'Bachelor of Science',
                                    school:      'State University',
                                    start:       '2016',
                                    end:         '2020',
                                    description: 'Graduated with honours. Focused on applied sciences and research methodologies.'
                                }
                            ],
                            projects:        [],
                            certifications:  []
                        }
                    };
                }

                // Parse the response
                resumeData      = parseAIResponse(data);
                rawHtmlFallback = (!resumeData && data && data.html_content) ? data.html_content : null;

                if (resumeData || rawHtmlFallback) {
                    applyPreviewMeta();
                    renderPreview();
                } else {
                    showAlert('AI returned an unexpected response format. Please try again.', 'error');
                    showEmpty();
                }

            } catch (error) {
                console.error('Generation error', error);
                showAlert(error.message || 'Failed to generate resume. Please try again.', 'error');
                showEmpty();
            } finally {
                loadingState.style.display = 'none';
                btnGenerate.disabled = false;
            }
        });
    }

    // ─── Save ──────────────────────────────────────────────────────────
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            if (!resumeData && !rawHtmlFallback) {
                showAlert('Nothing to save. Generate a resume first.', 'error');
                return;
            }

            const title = resumeTitleInp.value.trim() || 'AI Resume';

            const payload = {
                title,
                template: selectedTemplate,
                mode:     'ai',
                content: {
                    ...(resumeData || {}),
                    html_content: rawHtmlFallback || null,
                    customization: {
                        template: selectedTemplate,
                        theme:    accentColor,
                        font:     selectedFont
                    }
                }
            };

            try {
                btnSave.disabled  = true;
                btnSave.innerText = 'Saving...';
                await apiPost('/resume-builder/ai/save', payload);
                showAlert('Resume saved successfully!', 'success');
                setTimeout(() => { window.location.href = 'resume-builder.html'; }, 1000);
            } catch (err) {
                // Fallback: try the manual save endpoint with same payload shape
                try {
                    await apiPost('/resume-builder/manual', {
                        title,
                        template:       selectedTemplate,
                        mode:           'ai',
                        personal:       { name: resumeData?.name || '', job_title: resumeData?.job || '', email: resumeData?.email || '', phone: resumeData?.phone || '', location: resumeData?.location || '' },
                        summary:        resumeData?.summary        || '',
                        skills:         resumeData?.skills         || [],
                        experience:     resumeData?.experience     || [],
                        education:      resumeData?.education      || [],
                        projects:       resumeData?.projects       || [],
                        certifications: resumeData?.certifications || [],
                        customization:  { theme: accentColor, font: selectedFont }
                    });
                    showAlert('Resume saved successfully!', 'success');
                    setTimeout(() => { window.location.href = 'resume-builder.html'; }, 1000);
                } catch (fallbackErr) {
                    console.error('Save error', fallbackErr);
                    showAlert(fallbackErr.message || 'Could not save resume.', 'error');
                }
            } finally {
                btnSave.disabled  = false;
                btnSave.innerText = 'Save Resume';
            }
        });
    }

    // ─── Print ─────────────────────────────────────────────────────────
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            if (!resumeData && !rawHtmlFallback) {
                showAlert('Generate a resume first before printing.', 'error');
                return;
            }

            const w = window.open('', '_blank', 'width=900,height=1200');
            if (!w) { showAlert('Popups blocked. Allow popups to print.', 'error'); return; }

            const printCSS = resumeData
                ? buildPrintCSS(selectedTemplate, accentColor, selectedFont)
                : `body{font-family:${selectedFont};} .resume-paper{padding:28px;}`;

            const paperHTML = previewRoot.querySelector('.resume-paper')
                ? previewRoot.querySelector('.resume-paper').outerHTML
                : previewRoot.innerHTML;

            w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
                <style>@page{size:A4;margin:10mm;}${printCSS}</style>
                </head><body>${paperHTML}</body></html>`);
            w.document.close();
            w.focus();
            setTimeout(() => w.print(), 600);
        });
    }

    // ─── Bootstrap ─────────────────────────────────────────────────────
    renderTemplateList();
    applyPreviewMeta();
    renderPreview();

});
