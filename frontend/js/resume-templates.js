/**
 * resume-templates.js
 * ─────────────────────────────────────────────────────────────────────────
 * SHARED template system for Manual Builder AND AI Builder.
 *
 * Exports (as window globals so both builders can consume without a bundler):
 *   window.ResumeTemplates.TEMPLATES          — template definition array
 *   window.ResumeTemplates.thumbFns           — thumbnail HTML generators
 *   window.ResumeTemplates.RENDERERS          — full resume HTML renderers
 *   window.ResumeTemplates.buildPrintCSS()    — per-template print CSS
 *   window.ResumeTemplates.esc()              — HTML-escape helper
 *   window.ResumeTemplates.parseAIResponse()  — parse AI text → data object
 * ─────────────────────────────────────────────────────────────────────────
 */

(function (window) {
    'use strict';

    // ─── Template list ────────────────────────────────────────────────
    const TEMPLATES = [
        { id: 'template-1', name: 'Classic Sidebar' },
        { id: 'template-2', name: 'Dark Banner' },
        { id: 'template-3', name: 'Minimal' }
    ];

    // ─── Escape helper ────────────────────────────────────────────────
    function esc(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ─── SVG icons (template-1 sidebar) ─────────────────────────────
    const ICONS = {
        location: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,
        email:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
        phone:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`,
        calendar: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`,
    };

    function contactIcon(type) {
        return `<span class="ci-icon">${ICONS[type] || ICONS.phone}</span>`;
    }

    // ═══════════════════════════════════════════════════════════════════
    // THUMBNAIL HTML GENERATORS
    // ═══════════════════════════════════════════════════════════════════

    function thumbHTML_T1() {
        return `
        <div class="thumb-t1">
            <div class="t1-left">
                <div class="t1-name"></div>
                <div class="t1-job"></div>
                <div class="t1-divider"></div>
                <div class="t1-sh"></div>
                <div class="t1-row"></div>
                <div class="t1-row sm"></div>
                <div class="t1-row sm"></div>
                <div class="t1-divider"></div>
                <div class="t1-sh"></div>
                <div class="t1-row"></div>
                <div class="t1-row sm"></div>
            </div>
            <div class="t1-right">
                <div class="t1-rh"></div>
                <div class="t1-rrow"></div>
                <div class="t1-rrow"></div>
                <div class="t1-rrow"></div>
                <div class="t1-divider"></div>
                <div class="t1-rh"></div>
                <div class="t1-rrow"></div>
                <div class="t1-rrow"></div>
                <div class="t1-divider"></div>
                <div class="t1-rh"></div>
                <div class="t1-rrow"></div>
                <div class="t1-rrow"></div>
            </div>
        </div>
        <span class="thumb-label">Classic Sidebar</span>`;
    }

    function thumbHTML_T2() {
        return `
        <div class="thumb-t2">
            <div class="t2-banner"></div>
            <div class="t2-body">
                <div class="t2-left">
                    <div class="t2-sh"></div>
                    <div class="t2-row"></div>
                    <div class="t2-row sm"></div>
                    <div class="t2-row sm"></div>
                    <div class="t2-sh" style="margin-top:4px"></div>
                    <div class="t2-row"></div>
                    <div class="t2-row sm"></div>
                </div>
                <div class="t2-right">
                    <div class="t2-name"></div>
                    <div class="t2-job"></div>
                    <div class="t2-divider"></div>
                    <div class="t2-rh"></div>
                    <div class="t2-rrow"></div>
                    <div class="t2-rrow"></div>
                    <div class="t2-rh" style="margin-top:4px"></div>
                    <div class="t2-rrow"></div>
                    <div class="t2-rrow"></div>
                </div>
            </div>
        </div>
        <span class="thumb-label">Dark Banner</span>`;
    }

    function thumbHTML_T3() {
        return `
        <div class="thumb-t3">
            <div class="t3-header">
                <div class="t3-hl">
                    <div class="t3-name"></div>
                    <div class="t3-job"></div>
                </div>
                <div class="t3-hr">
                    <div class="t3-ci"></div>
                    <div class="t3-ci"></div>
                </div>
            </div>
            <div class="t3-divider"></div>
            <div class="t3-sh"></div>
            <div class="t3-shdiv"></div>
            <div class="t3-row"></div>
            <div class="t3-row sm"></div>
            <div class="t3-sh" style="margin-top:4px"></div>
            <div class="t3-shdiv"></div>
            <div class="t3-row"></div>
            <div class="t3-row sm"></div>
            <div class="t3-row"></div>
            <div class="t3-sh" style="margin-top:4px"></div>
            <div class="t3-shdiv"></div>
            <div class="t3-row sm"></div>
        </div>
        <span class="thumb-label">Minimal</span>`;
    }

    const thumbFns = {
        'template-1': thumbHTML_T1,
        'template-2': thumbHTML_T2,
        'template-3': thumbHTML_T3
    };

    // ═══════════════════════════════════════════════════════════════════
    // SHARED ROW BUILDERS
    // ═══════════════════════════════════════════════════════════════════

    function expRowsT1(exps) {
        if (!exps || !exps.length) return '<p style="font-size:11px;color:#9ca3af;">No experience added yet.</p>';
        return exps.map(e => `
            <div class="exp-item">
                <div class="exp-left">
                    <div class="exp-pos">${esc(e.title || e.position || '')}</div>
                    <div class="exp-co">${esc(e.company || e.organization || '')}</div>
                </div>
                <div class="exp-right">
                    <div class="exp-dates">${esc(e.start || e.start_date || '')}${(e.end || e.end_date) ? ' – ' + esc(e.end || e.end_date) : ''}</div>
                    <p class="exp-desc">${esc(e.description || e.summary || '')}</p>
                </div>
            </div>`).join('');
    }

    function eduRowsT1(edus) {
        if (!edus || !edus.length) return '<p style="font-size:11px;color:#9ca3af;">No education added yet.</p>';
        return edus.map(e => `
            <div class="edu-item">
                <div class="edu-left">
                    <div class="edu-years">${esc(e.start || e.start_date || '')}<br>${esc(e.end || e.end_date || '')}</div>
                </div>
                <div class="edu-right">
                    <div class="edu-deg">${esc(e.degree || '')}${(e.school || e.institution) ? ' – ' + esc(e.school || e.institution) : ''}</div>
                    <p class="edu-desc">${esc(e.description || '')}</p>
                </div>
            </div>`).join('');
    }

    function expRowsYears(exps) {
        if (!exps || !exps.length) return '<p style="font-size:11px;color:#9ca3af;">No experience added yet.</p>';
        return exps.map(e => `
            <div class="exp-item">
                <div class="exp-years-col">
                    ${esc(e.start || e.start_date || '')}<br>${esc(e.end || e.end_date || '')}
                </div>
                <div class="exp-content">
                    <div class="exp-heading">${esc(e.title || e.position || '')}${(e.company || e.organization) ? ' – ' + esc(e.company || e.organization) : ''}</div>
                    <p class="exp-desc">${esc(e.description || e.summary || '')}</p>
                </div>
            </div>`).join('');
    }

    function eduRowsYears(edus) {
        if (!edus || !edus.length) return '<p style="font-size:11px;color:#9ca3af;">No education added yet.</p>';
        return edus.map(e => `
            <div class="edu-item">
                <div class="edu-years-col">
                    ${esc(e.start || e.start_date || '')}<br>${esc(e.end || e.end_date || '')}
                </div>
                <div class="edu-content">
                    <div class="edu-deg">${esc(e.degree || '')}</div>
                    <div class="edu-school">${esc(e.school || e.institution || '')}</div>
                    <p class="edu-desc">${esc(e.description || '')}</p>
                </div>
            </div>`).join('');
    }

    function projectRows(prjs) {
        if (!prjs || !prjs.length) return '';
        return prjs.map(p => `
            <div class="proj-item">
                <div class="proj-title">${esc(p.title || p.name || '')}</div>
                <p class="proj-desc">${esc(p.description || '')}</p>
            </div>`).join('');
    }

    function certRows(certs) {
        if (!certs || !certs.length) return '';
        return certs.map(c => `
            <div class="cert-item-rp">
                <div class="cert-name">${esc(c.name || c.title || '')}</div>
                <div class="cert-meta">${esc(c.issuer || '')}${(c.year || c.date) ? ' · ' + esc(c.year || c.date) : ''}</div>
            </div>`).join('');
    }

    // normalise skills — handles string[], object[] and comma-strings
    function normaliseSkills(skills) {
        if (!skills) return [];
        if (typeof skills === 'string') return skills.split(/[,;]/).map(s => s.trim()).filter(Boolean);
        if (Array.isArray(skills)) {
            return skills.map(s => (typeof s === 'string' ? s : (s.name || s.skill || ''))).filter(Boolean);
        }
        return [];
    }

    // ═══════════════════════════════════════════════════════════════════
    // TEMPLATE RENDERERS
    // ═══════════════════════════════════════════════════════════════════

    // ── Template 1: Classic Two-Column Sidebar ──────────────────────
    function renderTemplate1(d) {
        const skills = normaliseSkills(d.skills);
        const projCertHtml = (projectRows(d.projects) + certRows(d.certifications)) ||
            '<p style="font-size:11px;color:#9ca3af;">No projects or certifications added.</p>';

        return `
        <div class="resume-paper">
            <div class="rp-header">
                <h1>${esc(d.name) || 'Name and Surname'}</h1>
                <p class="rp-jobtitle">${esc(d.job || d.job_title || d.title || '') || 'Job Title'}</p>
            </div>
            <div class="rp-body">
                <div class="rp-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Profile</div>
                        ${d.location ? `
                        <div class="contact-item">
                            ${contactIcon('location')}
                            <div class="ci-text">
                                <span class="ci-label">Personal Address</span>
                                ${esc(d.location)}
                            </div>
                        </div>` : ''}
                        ${d.email ? `
                        <div class="contact-item">
                            ${contactIcon('email')}
                            <div class="ci-text">
                                <span class="ci-label">Email</span>
                                ${esc(d.email)}
                            </div>
                        </div>` : ''}
                        ${d.phone ? `
                        <div class="contact-item">
                            ${contactIcon('phone')}
                            <div class="ci-text">
                                <span class="ci-label">Mobile</span>
                                ${esc(d.phone)}
                            </div>
                        </div>` : ''}
                        ${(!d.location && !d.email && !d.phone) ?
                            '<p style="font-size:11px;color:#9ca3af;">Contact details will appear here.</p>' : ''}
                    </div>
                    ${skills.length ? `
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Skills</div>
                        <ul class="sidebar-list">
                            ${skills.map(s => `<li>${esc(s)}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                </div>
                <div class="rp-main">
                    <div class="rp-section">
                        <div class="rp-section-title">About Me</div>
                        <p class="rp-about">${esc(d.summary) || 'Professional summary will appear here.'}</p>
                    </div>
                    <div class="rp-section">
                        <div class="rp-section-title">Professional Experience</div>
                        ${expRowsT1(d.experience || d.experiences)}
                    </div>
                    <div class="rp-section">
                        <div class="rp-section-title">Education</div>
                        ${eduRowsT1(d.education || d.educations)}
                    </div>
                    ${((d.projects && d.projects.length) || (d.certifications && d.certifications.length)) ? `
                    <div class="rp-section">
                        <div class="rp-section-title">Projects &amp; Certifications</div>
                        ${projCertHtml}
                    </div>` : ''}
                </div>
            </div>
        </div>`;
    }

    // ── Template 2: Dark Banner + Two-Column ────────────────────────
    function renderTemplate2(d) {
        const skills = normaliseSkills(d.skills);
        const projCertHtml = (projectRows(d.projects) + certRows(d.certifications)) ||
            '<p style="font-size:11px;color:#9ca3af;">No projects or certifications added.</p>';

        return `
        <div class="resume-paper">
            <div class="rp-banner"></div>
            <div class="rp-body">
                <div class="rp-sidebar">
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Profile</div>
                        ${d.location ? `
                        <div class="contact-row">
                            <span class="cr-label">Personal Address</span>
                            <span class="cr-value">${esc(d.location)}</span>
                        </div>` : ''}
                        ${d.email ? `
                        <div class="contact-row">
                            <span class="cr-label">Email</span>
                            <span class="cr-value">${esc(d.email)}</span>
                        </div>` : ''}
                        ${d.phone ? `
                        <div class="contact-row">
                            <span class="cr-label">Mobile</span>
                            <span class="cr-value">${esc(d.phone)}</span>
                        </div>` : ''}
                        ${(!d.location && !d.email && !d.phone) ?
                            '<p style="font-size:11px;color:#9ca3af;">Contact details will appear here.</p>' : ''}
                    </div>
                    ${skills.length ? `
                    <div class="sidebar-section">
                        <div class="sidebar-section-title">Skills</div>
                        <ul class="sidebar-list">
                            ${skills.map(s => `<li>${esc(s)}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                </div>
                <div class="rp-main">
                    <div class="rp-name-block">
                        <h1>${esc(d.name) || 'NAME AND SURNAME'}</h1>
                        <p class="rp-jobtitle">${esc(d.job || d.job_title || d.title || '') || 'Job Title'}</p>
                    </div>
                    <div class="rp-divider"></div>
                    <p class="rp-about">${esc(d.summary) || 'Professional summary will appear here.'}</p>
                    <div class="rp-section">
                        <div class="rp-section-title">Professional Experience</div>
                        ${expRowsYears(d.experience || d.experiences)}
                    </div>
                    <div class="rp-section">
                        <div class="rp-section-title">Education</div>
                        ${eduRowsYears(d.education || d.educations)}
                    </div>
                    ${((d.projects && d.projects.length) || (d.certifications && d.certifications.length)) ? `
                    <div class="rp-section">
                        <div class="rp-section-title">Projects &amp; Certifications</div>
                        ${projCertHtml}
                    </div>` : ''}
                </div>
            </div>
        </div>`;
    }

    // ── Template 3: Minimal Single-Column ───────────────────────────
    function renderTemplate3(d) {
        const skills = normaliseSkills(d.skills);
        const skillsText = skills.length
            ? '- ' + skills.map(s => esc(s)).join(', - ')
            : '<span style="color:#9ca3af;">No skills added yet.</span>';
        const projCertHtml = (projectRows(d.projects) + certRows(d.certifications)) ||
            '<p style="font-size:11px;color:#9ca3af;">No projects or certifications added.</p>';

        return `
        <div class="resume-paper">
            <div class="rp-header">
                <div class="rp-header-left">
                    <h1>${esc(d.name) || 'NAME AND SURNAME'}</h1>
                    <p class="rp-jobtitle">${esc(d.job || d.job_title || d.title || '') || 'Job Title'}</p>
                </div>
                <div class="rp-contact-right">
                    ${d.location ? `<div>${esc(d.location)}</div>` : ''}
                    ${d.phone    ? `<div>${esc(d.phone)}</div>`    : ''}
                    ${d.email    ? `<div>${esc(d.email)}</div>`    : ''}
                    ${(!d.location && !d.phone && !d.email) ?
                        '<span style="color:#9ca3af;">email / phone</span>' : ''}
                </div>
            </div>
            <div class="rp-section">
                <div class="rp-section-title">About me</div>
                <p class="rp-about">${esc(d.summary) || 'Professional summary will appear here.'}</p>
            </div>
            <div class="rp-section">
                <div class="rp-section-title">Professional experience</div>
                ${expRowsYears(d.experience || d.experiences)}
            </div>
            <div class="rp-section">
                <div class="rp-section-title">Education</div>
                ${eduRowsYears(d.education || d.educations)}
            </div>
            <div class="rp-section">
                <div class="rp-section-title">Skills</div>
                <p class="skills-inline">${skillsText}</p>
            </div>
            ${((d.projects && d.projects.length) || (d.certifications && d.certifications.length)) ? `
            <div class="rp-section">
                <div class="rp-section-title">Projects &amp; Certifications</div>
                ${projCertHtml}
            </div>` : ''}
        </div>`;
    }

    const RENDERERS = {
        'template-1': renderTemplate1,
        'template-2': renderTemplate2,
        'template-3': renderTemplate3
    };

    // ═══════════════════════════════════════════════════════════════════
    // PRINT CSS BUILDER
    // ═══════════════════════════════════════════════════════════════════

    function buildPrintCSS(tpl, accent, font) {
        const base = `
            * { box-sizing: border-box; }
            body { margin:0; font-family:${font}; color:#111; }
            .resume-paper { width:100%; background:#fff; color:#111827; }
            h1,h2,h3,h4,h5,h6 { margin:0; }
            p { margin:0; }
            .rp-about { font-size:12px; color:#374151; line-height:1.55; }
            .rp-section { margin-bottom:14px; }
            .rp-divider { height:1.5px; background:#e5e7eb; margin:10px 0; }
        `;

        if (tpl === 'template-1') return base + `
            .resume-paper { display:flex; flex-direction:column; padding:0; }
            .rp-header { padding:22px 28px 14px; border-bottom:2px solid ${accent}; }
            .rp-header h1 { font-size:26px; font-weight:800; }
            .rp-header .rp-jobtitle { font-size:14px; color:#6b7280; }
            .rp-body { display:flex; }
            .rp-sidebar { width:210px; padding:18px 16px; border-right:1px solid #e5e7eb; }
            .sidebar-section { margin-bottom:16px; }
            .sidebar-section-title { font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:${accent}; border-bottom:1.5px solid ${accent}; padding-bottom:4px; margin-bottom:8px; }
            .contact-item { display:flex; gap:7px; margin-bottom:7px; }
            .ci-icon { width:18px; height:18px; border-radius:50%; background:${accent}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
            .ci-icon svg { width:10px; height:10px; fill:#fff; }
            .ci-text { font-size:11px; color:#374151; }
            .ci-label { font-size:10px; font-weight:700; color:#111; display:block; }
            .sidebar-list { list-style:none; margin:0; padding:0; }
            .sidebar-list li { font-size:11px; color:#374151; padding:2px 0; }
            .sidebar-list li::before { content:'- '; }
            .rp-main { flex:1; padding:18px 22px; }
            .rp-section-title { font-size:12px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:${accent}; border-bottom:1.5px solid ${accent}; padding-bottom:4px; margin-bottom:10px; }
            .exp-item { display:flex; gap:10px; margin-bottom:10px; }
            .exp-left { width:90px; flex-shrink:0; }
            .exp-pos { font-size:11px; font-weight:600; color:#111; }
            .exp-co { font-size:11px; color:#6b7280; }
            .exp-dates { font-size:11px; font-weight:700; color:#111; margin-bottom:2px; }
            .exp-desc { font-size:11px; color:#374151; line-height:1.5; }
            .edu-item { display:flex; gap:10px; margin-bottom:10px; }
            .edu-left { width:60px; flex-shrink:0; }
            .edu-years { font-size:11px; color:#6b7280; }
            .edu-deg { font-size:11px; font-weight:700; color:#111; }
            .edu-desc { font-size:11px; color:#374151; line-height:1.5; }
            .proj-title,.cert-name { font-size:12px; font-weight:700; color:#111; }
            .proj-desc,.cert-meta { font-size:11px; color:#374151; margin:2px 0 0; }
            .proj-item,.cert-item-rp { margin-bottom:8px; }
        `;

        if (tpl === 'template-2') return base + `
            .resume-paper { display:flex; flex-direction:column; padding:0; }
            .rp-banner { background:${accent}; height:32px; }
            .rp-body { display:flex; }
            .rp-sidebar { width:200px; padding:18px 14px; border-right:1px solid #f0f0f0; }
            .sidebar-section { margin-bottom:16px; }
            .sidebar-section-title { font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#111; margin-bottom:8px; }
            .contact-row { margin-bottom:8px; }
            .cr-label { font-size:10px; font-weight:700; color:#111; display:block; }
            .cr-value { font-size:11px; color:#374151; }
            .sidebar-list { list-style:none; margin:0; padding:0; }
            .sidebar-list li { font-size:11px; color:#374151; padding:2px 0; }
            .sidebar-list li::before { content:'- '; }
            .rp-main { flex:1; padding:18px 22px; }
            .rp-name-block h1 { font-size:26px; font-weight:900; text-transform:uppercase; letter-spacing:1px; }
            .rp-jobtitle { font-size:14px; color:#6b7280; }
            .rp-section-title { font-size:12px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#111; margin-bottom:10px; }
            .exp-item,.edu-item { display:flex; gap:12px; margin-bottom:10px; }
            .exp-years-col,.edu-years-col { width:70px; flex-shrink:0; font-size:11px; color:#6b7280; }
            .exp-heading,.edu-deg { font-size:12px; font-weight:700; color:#111; text-transform:uppercase; }
            .edu-school { font-size:11px; color:#6b7280; }
            .exp-desc,.edu-desc { font-size:11px; color:#374151; line-height:1.5; }
            .proj-title,.cert-name { font-size:12px; font-weight:700; color:#111; }
            .proj-desc,.cert-meta { font-size:11px; color:#374151; margin:2px 0 0; }
            .proj-item,.cert-item-rp { margin-bottom:8px; }
        `;

        // template-3
        return base + `
            .resume-paper { padding:32px 36px; }
            .rp-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; }
            .rp-header h1 { font-size:22px; font-weight:900; text-transform:uppercase; letter-spacing:.5px; }
            .rp-jobtitle { font-size:13px; color:#6b7280; }
            .rp-contact-right { text-align:right; font-size:11px; color:#374151; line-height:1.6; }
            .rp-section-title { font-size:13px; font-weight:700; color:${accent}; padding-bottom:4px; border-bottom:1.5px solid ${accent}; margin-bottom:10px; }
            .exp-item,.edu-item { display:flex; gap:14px; margin-bottom:10px; }
            .exp-years-col,.edu-years-col { width:60px; flex-shrink:0; font-size:11px; color:#6b7280; }
            .exp-heading,.edu-deg { font-size:12px; font-weight:700; color:#111; }
            .edu-school { font-size:11px; color:#6b7280; }
            .exp-desc,.edu-desc { font-size:11px; color:#374151; line-height:1.5; }
            .skills-inline { font-size:12px; color:#374151; line-height:1.6; }
            .proj-title,.cert-name { font-size:12px; font-weight:700; color:#111; }
            .proj-desc,.cert-meta { font-size:11px; color:#374151; margin:2px 0 0; }
            .proj-item,.cert-item-rp { margin-bottom:8px; }
        `;
    }

    // ═══════════════════════════════════════════════════════════════════
    // AI RESPONSE PARSER
    // Tries to pull structured data from whatever the backend returns.
    // Handles:
    //   - {structured_data: {...}}
    //   - {content: {...}}          (when content is JSON)
    //   - {html_content: "..."}     (fallback — wraps raw HTML)
    //   - plain JSON string
    // ═══════════════════════════════════════════════════════════════════

    function parseAIResponse(data) {
        if (!data) return null;

        // 1. Prefer structured_data key
        if (data.structured_data && typeof data.structured_data === 'object') {
            return normaliseResumeData(data.structured_data);
        }

        // 2. content key that is an object
        if (data.content && typeof data.content === 'object') {
            return normaliseResumeData(data.content);
        }

        // 3. content key that is a JSON string
        if (data.content && typeof data.content === 'string') {
            try {
                const parsed = JSON.parse(data.content);
                return normaliseResumeData(parsed);
            } catch (e) { /* fall through */ }
        }

        // 4. The response itself looks like resume data
        if (data.name || data.personal || data.summary || data.experience) {
            return normaliseResumeData(data);
        }

        // 5. Raw HTML fallback — cannot render with templates, return null
        return null;
    }

    /**
     * Normalise various field naming conventions into a single flat shape:
     * { name, job, email, phone, location, summary, skills[], experience[], education[], projects[], certifications[] }
     */
    function normaliseResumeData(raw) {
        const personal = raw.personal || {};
        const out = {
            name:     raw.name     || personal.name     || '',
            job:      raw.job      || raw.job_title     || personal.job_title || personal.position || '',
            email:    raw.email    || personal.email    || '',
            phone:    raw.phone    || personal.phone    || '',
            location: raw.location || personal.location || personal.address   || '',
            summary:  raw.summary  || raw.profile       || raw.objective      || '',
            skills:        normaliseSkills(raw.skills),
            experience:    raw.experience    || raw.experiences    || raw.work_experience || [],
            education:     raw.education     || raw.educations     || [],
            projects:      raw.projects      || [],
            certifications:raw.certifications|| raw.certificates   || []
        };
        return out;
    }

    // ─── Expose as window.ResumeTemplates ─────────────────────────────
    window.ResumeTemplates = {
        TEMPLATES,
        thumbFns,
        RENDERERS,
        buildPrintCSS,
        esc,
        parseAIResponse,
        normaliseSkills
    };

}(window));
