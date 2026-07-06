/**
 * LewdTagger — Frontend Application Logic
 * Manages image gallery, tagging, detail panel, F95 tags, and exports.
 */

// ── State ──
const state = {
    images: [],
    selectedImageId: null,
    tagsCache: {},
    isProcessing: false,
    f95Enabled: false,
    f95ActiveTags: new Set(),
};

// ── F95 Tag Mapping (WD tagger tag → F95 tag) ──
const F95_TAG_MAP = {
    'anal': 'Anal Sex', 'anal_sex': 'Anal Sex', 'anal_penetration': 'Anal Sex',
    'ahegao': 'Ahegao', 'rolling_eyes': 'Ahegao',
    'bdsm': 'Bdsm', 'bondage': 'Bdsm', 'bound': 'Bdsm', 'handcuffs': 'Bdsm', 'rope': 'Bdsm', 'chains': 'Bdsm', 'collar': 'Bdsm', 'leash': 'Bdsm',
    'bestiality': 'Bestiality', 'zoophilia': 'Bestiality',
    'large_ass': 'Big Ass', 'huge_ass': 'Big Ass', 'big_ass': 'Big Ass', 'thick_thighs': 'Big Ass',
    'large_breasts': 'Big Tits', 'huge_breasts': 'Big Tits', 'gigantic_breasts': 'Big Tits', 'big_breasts': 'Big Tits',
    'blackmail': 'Blackmail',
    'bukkake': 'Bukkake', 'facial': 'Bukkake', 'cum_on_face': 'Bukkake', 'cum_on_body': 'Bukkake',
    'cheating': 'Cheating', 'netorare': 'Netorare', 'ntr': 'Netorare',
    'corruption': 'Corruption',
    'creampie': 'Creampie', 'cum_in_pussy': 'Creampie', 'cum_in_ass': 'Creampie', 'internal_cumshot': 'Creampie',
    'old_man': 'Dilf', 'dilf': 'Dilf',
    'drugs': 'Drugs', 'syringe': 'Drugs',
    'exhibitionism': 'Exhibitionism', 'public_nudity': 'Exhibitionism', 'flashing': 'Exhibitionism',
    'femdom': 'Female domination', 'female_domination': 'Female domination', 'dominatrix': 'Female domination',
    'footjob': 'Footjob', 'feet': 'Footjob',
    'furry': 'Furry', 'animal_ears': 'Furry', 'tail': 'Furry', 'kemonomimi': 'Furry',
    'futanari': 'Futa/Trans', 'futa': 'Futa/Trans', 'newhalf': 'Futa/Trans', 'transgender': 'Futa/Trans', 'penis_girl': 'Futa/Trans',
    'yaoi': 'Gay', 'male_on_male': 'Gay', 'gay': 'Gay', '2boys': 'Gay',
    'group_sex': 'Group sex', 'orgy': 'Group sex', 'threesome': 'Group sex', 'gangbang': 'Group sex', 'mmf_threesome': 'Group sex', 'ffm_threesome': 'Group sex',
    'groping': 'Groping', 'breast_grab': 'Groping', 'ass_grab': 'Groping',
    'handjob': 'Handjob',
    'harem': 'Harem',
    'humiliation': 'Humiliation', 'public_humiliation': 'Humiliation',
    'incest': 'Incest', 'mother_and_son': 'Incest', 'father_and_daughter': 'Incest', 'siblings': 'Incest', 'brother_and_sister': 'Incest',
    'x-ray': 'Internal view', 'cross-section': 'Internal view', 'internal_cumshot': 'Internal view', 'uterus': 'Internal view',
    'interracial': 'Interracial', 'dark-skinned_male': 'Interracial',
    'lactation': 'Lactation', 'breast_milk': 'Lactation', 'milking': 'Lactation',
    'yuri': 'Lesbian', 'girl_on_girl': 'Lesbian', 'lesbian': 'Lesbian', '2girls': 'Lesbian',
    'loli': 'Loli', 'flat_chest': 'Loli', 'child': 'Loli',
    'maledom': 'Male Domination', 'male_domination': 'Male Domination',
    'masturbation': 'Masturbation', 'fingering': 'Masturbation', 'female_masturbation': 'Masturbation', 'male_masturbation': 'Masturbation',
    'milf': 'Milf', 'mature_female': 'Milf',
    'double_penetration': 'Multiple Penetration', 'triple_penetration': 'Multiple Penetration', 'multiple_penetration': 'Multiple Penetration',
    'necrophilia': 'Necrophilia',
    'oral': 'Oral Sex', 'fellatio': 'Oral Sex', 'blowjob': 'Oral Sex', 'cunnilingus': 'Oral Sex', 'deepthroat': 'Oral Sex', 'irrumatio': 'Oral Sex',
    'pregnant': 'Pregnancy', 'pregnancy': 'Pregnancy', 'impregnation': 'Pregnancy',
    'prostitution': 'Prostitution',
    'rape': 'Rape', 'forced': 'Rape',
    'scat': 'Scat',
    'sex_toy': 'Sex Toys', 'dildo': 'Sex Toys', 'vibrator': 'Sex Toys', 'sex_machine': 'Sex Toys',
    'sexual_harassment': 'Sexual Harassment', 'molestation': 'Sexual Harassment', 'groping': 'Sexual Harassment',
    'shota': 'Shota', 'young_boy': 'Shota',
    'sissification': 'Sissification', 'crossdressing': 'Sissification', 'otoko_no_ko': 'Sissification',
    'slave': 'Slave', 'slavery': 'Slave',
    'sleeping': 'Sleep Sex', 'sleep_sex': 'Sleep Sex', 'unconscious': 'Sleep Sex',
    'spanking': 'Spanking', 'ass_slap': 'Spanking',
    'stripping': 'Stripping', 'undressing': 'Stripping', 'striptease': 'Stripping',
    'swinging': 'Swinging', 'wife_swapping': 'Swinging', 'partner_swapping': 'Swinging',
    'tentacles': 'Tentacles', 'tentacle': 'Tentacles', 'tentacle_sex': 'Tentacles',
    'teasing': 'Teasing',
    'paizuri': 'Titfuck', 'titfuck': 'Titfuck', 'titjob': 'Titfuck',
    'transformation': 'Transformation', 'gender_bender': 'Transformation',
    'trap': 'Trap', 'otoko_no_ko': 'Trap', 'crossdressing': 'Trap', 'male_crossdressing': 'Trap',
    'urination': 'Urination', 'peeing': 'Urination', 'golden_shower': 'Urination', 'pee': 'Urination',
    'vaginal': 'Vaginal Sex', 'vaginal_penetration': 'Vaginal Sex', 'sex': 'Vaginal Sex', 'vaginal_sex': 'Vaginal Sex',
    'virgin': 'Virgin', 'virginity': 'Virgin', 'first_time': 'Virgin',
    'vore': 'Vore', 'unbirthing': 'Vore',
    'voyeurism': 'Voyeurism', 'voyeur': 'Voyeurism', 'peeping': 'Voyeurism', 'watching': 'Voyeurism',
    'censored': 'Censored', 'mosaic_censoring': 'Censored', 'bar_censor': 'Censored', 'light_censor': 'Censored',
    '3d': '3DCG', '3dcg': '3DCG',
    '2d': '2DCG', '2dcg': '2DCG',
    'ai_generated': 'AI CG', 'ai-generated': 'AI CG',
};

// ── DOM References ──
const $ = (id) => document.getElementById(id);
const dom = {
    folderInput: $('folderInput'), scanBtn: $('scanBtn'), actionBar: $('actionBar'),
    imageCount: $('imageCount'), taggedCount: $('taggedCount'),
    tagAllBtn: $('tagAllBtn'), exportAllBtn: $('exportAllBtn'),
    progressContainer: $('progressContainer'), progressText: $('progressText'),
    progressPercent: $('progressPercent'), progressFill: $('progressFill'),
    emptyState: $('emptyState'), imageGrid: $('imageGrid'),
    detailPanel: $('detailPanel'), detailTitle: $('detailTitle'),
    detailImage: $('detailImage'), detailFilename: $('detailFilename'), detailHash: $('detailHash'),
    tagSingleBtn: $('tagSingleBtn'),
    characterSection: $('characterSection'), characterTags: $('characterTags'),
    ratingSection: $('ratingSection'), ratingTags: $('ratingTags'),
    generalSection: $('generalSection'), generalTags: $('generalTags'),
    exportSingleBtn: $('exportSingleBtn'), modelStatus: $('modelStatus'),
    generalThreshold: $('generalThreshold'), generalThresholdValue: $('generalThresholdValue'),
    charThreshold: $('charThreshold'), charThresholdValue: $('charThresholdValue'),
    f95Toggle: $('f95Toggle'), f95Panel: $('f95Panel'),
    f95Count: $('f95Count'), f95TagsList: $('f95TagsList'),
    f95ResultArea: $('f95ResultArea'), f95ResultText: $('f95ResultText'), f95CopyBtn: $('f95CopyBtn'),
    renameToggle: $('renameToggle'), applyRenameBtn: $('applyRenameBtn')
};

// ── Utilities ──
function showToast(msg, type = 'info') {
    const c = $('toastContainer'), t = document.createElement('div');
    t.className = `toast ${type}`; t.textContent = msg; c.appendChild(t);
    setTimeout(() => { t.classList.add('exit'); setTimeout(() => t.remove(), 300); }, 3500);
}

async function apiCall(url, opts = {}) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) { const e = await res.json().catch(() => ({ detail: res.statusText })); throw new Error(e.detail || 'Request error'); }
    return res;
}

function getThresholds() {
    return { general_threshold: parseFloat(dom.generalThreshold.value), character_threshold: parseFloat(dom.charThreshold.value) };
}

// ── F95 Tag Matching ──
// Maps F95 tag name -> Set of image IDs that contributed to it
let f95TagSources = {};

function computeF95Tags() {
    if (!state.f95Enabled) { dom.f95Panel.style.display = 'none'; return; }
    f95TagSources = {};
    for (const [imageId, cache] of Object.entries(state.tagsCache)) {
        const addSource = (f95tag) => {
            if (!f95TagSources[f95tag]) f95TagSources[f95tag] = new Set();
            f95TagSources[f95tag].add(imageId);
        };
        
        const allTags = [...Object.keys(cache.general || {}), ...Object.keys(cache.characters || {}), ...Object.keys(cache.rating || {})];
        for (const tag of allTags) {
            const normalized = tag.toLowerCase().replace(/ /g, '_');
            if (F95_TAG_MAP[normalized]) {
                addSource(F95_TAG_MAP[normalized]);
            }
        }
        
        // If there are any characters detected, add the 'Parody' tag
        if (cache.characters && Object.keys(cache.characters).length > 0) {
            addSource('Parody');
        }
    }
    const matched = Object.keys(f95TagSources).sort();
    dom.f95Panel.style.display = 'block';
    dom.f95Count.textContent = `${matched.length} tag${matched.length !== 1 ? 's' : ''}`;
    
    state.f95ActiveTags = new Set(matched);
    
    if (matched.length === 0) {
        dom.f95TagsList.innerHTML = '<span class="f95-empty">No F95 tags matched from the detected tags</span>';
        updateF95ResultArea();
    } else {
        dom.f95TagsList.innerHTML = matched.map(t => {
            const count = f95TagSources[t].size;
            const safeTag = t.replace(/'/g, "\\'");
            return `<span class="tag-badge f95 active">
                <span class="f95-toggle-section" onclick="toggleF95Tag('${safeTag}', this.parentElement, event)" title="Enable/Disable tag">
                    <span class="f95-dot"></span>
                </span>
                <span class="f95-content-section clickable" onclick="showF95Sources('${safeTag}')" title="Click to see ${count} source image${count !== 1 ? 's' : ''}">
                    ${t} <span class="tag-score">${count}</span>
                </span>
            </span>`;
        }).join('');
        updateF95ResultArea();
    }
}

function toggleF95Tag(tag, element, event) {
    event.stopPropagation();
    if (state.f95ActiveTags.has(tag)) {
        state.f95ActiveTags.delete(tag);
        element.classList.remove('active');
    } else {
        state.f95ActiveTags.add(tag);
        element.classList.add('active');
    }
    updateF95ResultArea();
}

function updateF95ResultArea() {
    if (state.f95ActiveTags.size === 0) {
        dom.f95ResultArea.style.display = 'none';
        dom.f95ResultText.textContent = '';
    } else {
        dom.f95ResultArea.style.display = 'flex';
        const sortedTags = Array.from(state.f95ActiveTags).sort();
        dom.f95ResultText.textContent = sortedTags.join(', ');
    }
}

function copyF95Tags() {
    const text = dom.f95ResultText.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Tags copied to clipboard!', 'success');
    }).catch(err => {
        showToast('Failed to copy tags: ' + err, 'error');
    });
}

function showF95Sources(f95Tag) {
    const imageIds = f95TagSources[f95Tag];
    if (!imageIds || imageIds.size === 0) return;

    // Remove existing modal if any
    const existing = document.getElementById('f95Modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'f95Modal';
    modal.className = 'f95-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) closeF95Modal(); };

    const imageCards = [...imageIds].map(id => {
        const img = state.images.find(i => i.id === id);
        const filename = img ? img.filename : id;
        return `<div class="f95-source-card" onclick="closeF95Modal(); selectImage('${id}')">
            <img src="/api/thumbnail/${id}" alt="${filename}" loading="lazy">
            <div class="f95-source-name">${filename}</div>
        </div>`;
    }).join('');

    modal.innerHTML = `<div class="f95-modal-content glass-card">
        <div class="f95-modal-header">
            <h3><span class="tag-badge f95" style="font-size:0.9rem;padding:6px 16px;">${f95Tag}</span></h3>
            <span class="f95-modal-subtitle">${imageIds.size} source image${imageIds.size !== 1 ? 's' : ''}</span>
            <button class="btn-icon" onclick="closeF95Modal()" title="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div class="f95-source-grid">${imageCards}</div>
    </div>`;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('visible'));
}

function closeF95Modal() {
    const modal = document.getElementById('f95Modal');
    if (modal) {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 250);
    }
}

// ── F95 Toggle ──
dom.f95Toggle.addEventListener('change', () => {
    state.f95Enabled = dom.f95Toggle.checked;
    if (state.f95Enabled && Object.keys(state.tagsCache).length > 0) computeF95Tags();
    else dom.f95Panel.style.display = 'none';
});

// ── Generic API Wrapper ──
dom.renameToggle.addEventListener('change', () => {
    dom.applyRenameBtn.style.display = dom.renameToggle.checked ? 'inline-flex' : 'none';
});

async function applyRenames() {
    if (Object.keys(state.tagsCache).length === 0) {
        showToast('No tagged images to rename.', 'error');
        return;
    }
    
    dom.applyRenameBtn.disabled = true;
    const originalText = dom.applyRenameBtn.innerHTML;
    dom.applyRenameBtn.innerHTML = '<div class="spinner"></div> Renaming...';
    
    try {
        const res = await apiCall('/api/rename', { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
            let count = 0;
            for (const [imgId, newFilename] of Object.entries(data.renames)) {
                const img = state.images.find(i => i.id === imgId);
                if (img) img.filename = newFilename;
                
                const card = document.querySelector(`.image-card[data-id="${imgId}"]`);
                if (card) {
                    const nameEl = card.querySelector('.image-card-name');
                    if (nameEl) nameEl.textContent = newFilename;
                }
                
                if (state.selectedImageId === imgId) {
                    dom.detailFilename.textContent = newFilename;
                }
                count++;
            }
            showToast(`Successfully renamed ${count} files by character!`, 'success');
        }
    } catch (e) {
        showToast('Failed to apply renames: ' + e.message, 'error');
    } finally {
        dom.applyRenameBtn.disabled = false;
        dom.applyRenameBtn.innerHTML = originalText;
    }
}

// ── Model Status Polling ──
let statusInterval = null;
async function checkModelStatus() {
    try {
        const res = await apiCall('/api/status');
        const data = await res.json();
        const dot = dom.modelStatus.querySelector('.status-dot');
        const text = dom.modelStatus.querySelector('span:last-child');
        dot.className = 'status-dot';
        if (data.status === 'ready') {
            dot.classList.add('ready'); text.textContent = 'Model ready';
            if (statusInterval) { clearInterval(statusInterval); statusInterval = null; }
        } else if (data.status === 'loading') {
            dot.classList.add('loading'); text.textContent = 'Loading model...';
        } else if (data.status === 'error') {
            dot.classList.add('error'); text.textContent = 'Model error';
            showToast('Failed to load model: ' + (data.error || ''), 'error');
            if (statusInterval) { clearInterval(statusInterval); statusInterval = null; }
        }
    } catch (e) { /* server not ready */ }
}

// ── Folder Scanning & Browsing ──
async function browseFolder() {
    try {
        const btn = document.getElementById('browseBtn');
        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span>';
        
        const res = await apiCall('/api/browse-folder');
        const data = await res.json();
        if (data.folder_path) {
            dom.folderInput.value = data.folder_path;
        }
        
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    } catch (e) {
        showToast('Failed to open folder dialog: ' + e.message, 'error');
        document.getElementById('browseBtn').disabled = false;
    }
}

async function scanFolder() {
    const folderPath = dom.folderInput.value.trim();
    if (!folderPath) { showToast('Paste a folder path first', 'error'); return; }
    dom.scanBtn.disabled = true;
    dom.scanBtn.innerHTML = '<span class="spinner"></span> Scanning...';
    try {
        const res = await apiCall('/api/scan', { method: 'POST', body: JSON.stringify({ folder_path: folderPath }) });
        const data = await res.json();
        state.images = data.images; state.tagsCache = {}; state.selectedImageId = null;
        renderGallery();
        dom.actionBar.style.display = 'flex';
        dom.imageCount.textContent = `${data.total} images`;
        dom.taggedCount.textContent = '0 tagged';
        dom.exportAllBtn.disabled = true;
        if (state.f95Enabled) computeF95Tags();
        else dom.f95Panel.style.display = 'none';
        closeDetailPanel();
        showToast(`${data.total} images found!`, 'success');
    } catch (e) { showToast(e.message, 'error'); }
    finally {
        dom.scanBtn.disabled = false;
        dom.scanBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> Scan';
    }
}

// ── Gallery Rendering (Infinite Scroll) ──
let galleryRenderCount = 0;
const RENDER_BATCH_SIZE = 50;
let galleryObserver = null;

function renderGallery(reset = true) {
    if (reset) {
        dom.imageGrid.innerHTML = '';
        galleryRenderCount = 0;
        dom.emptyState.style.display = state.images.length === 0 ? 'flex' : 'none';
        
        if (galleryObserver) {
            galleryObserver.disconnect();
        }
        galleryObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                renderNextBatch();
            }
        }, { rootMargin: '400px' });
    }
    
    renderNextBatch();
}

function renderNextBatch() {
    if (galleryRenderCount >= state.images.length) return;
    
    const fragment = document.createDocumentFragment();
    const end = Math.min(galleryRenderCount + RENDER_BATCH_SIZE, state.images.length);
    
    for (let i = galleryRenderCount; i < end; i++) {
        const img = state.images[i];
        const card = document.createElement('div');
        card.className = 'image-card'; 
        card.id = `card-${img.id}`;
        card.dataset.id = img.id;
        
        if (galleryRenderCount === 0) card.style.animationDelay = `${i * 30}ms`;
        if (state.tagsCache[img.id]) card.classList.add('tagged');
        if (state.selectedImageId === img.id) card.classList.add('selected');
        
        const charName = state.tagsCache[img.id]?.characters ? Object.keys(state.tagsCache[img.id].characters).join(', ') : '';
        
        card.innerHTML = `<img src="/api/thumbnail/${img.id}" alt="${img.filename}" loading="lazy">
            <div class="image-card-overlay">
                <div class="image-card-name">${img.filename}</div>
                ${charName ? `<div class="image-card-char">${charName}</div>` : ''}
            </div>`;
            
        card.addEventListener('click', () => selectImage(img.id));
        fragment.appendChild(card);
    }
    
    const oldSentinel = document.getElementById('gallerySentinel');
    if (oldSentinel) {
        galleryObserver.unobserve(oldSentinel);
        oldSentinel.remove();
    }
    
    dom.imageGrid.appendChild(fragment);
    galleryRenderCount = end;
    
    if (galleryRenderCount < state.images.length) {
        const sentinel = document.createElement('div');
        sentinel.id = 'gallerySentinel';
        sentinel.style.width = '100%';
        sentinel.style.height = '1px';
        dom.imageGrid.appendChild(sentinel);
        galleryObserver.observe(sentinel);
    }
}

// ── Image Selection & Detail Panel ──
function selectImage(imageId) {
    state.selectedImageId = imageId;
    document.querySelectorAll('.image-card').forEach(c => c.classList.remove('selected'));
    const card = $(`card-${imageId}`); if (card) card.classList.add('selected');
    const img = state.images.find(i => i.id === imageId); if (!img) return;
    dom.detailPanel.style.display = 'block';
    dom.detailTitle.textContent = 'Details';
    dom.detailImage.src = `/api/image/${imageId}`;
    dom.detailFilename.textContent = img.filename;
    dom.detailHash.textContent = '';
    const cached = state.tagsCache[imageId];
    if (cached) { renderDetailTags(cached); }
    else { dom.characterSection.style.display = 'none'; dom.ratingSection.style.display = 'none'; dom.generalSection.style.display = 'none'; dom.exportSingleBtn.style.display = 'none'; dom.tagSingleBtn.style.display = 'flex'; }
}

function renderDetailTags(result) {
    if (result._hash) dom.detailHash.textContent = result._hash.substring(0, 24) + '...';
    if (result.characters && Object.keys(result.characters).length > 0) {
        dom.characterSection.style.display = 'block';
        dom.characterTags.innerHTML = Object.entries(result.characters).map(([n, s]) => `<span class="tag-badge character">${n.replace(/_/g, ' ')} <span class="tag-score">${(s*100).toFixed(1)}%</span></span>`).join('');
    } else { dom.characterSection.style.display = 'none'; }
    if (result.rating && Object.keys(result.rating).length > 0) {
        dom.ratingSection.style.display = 'block';
        dom.ratingTags.innerHTML = Object.entries(result.rating).map(([n, s]) => `<span class="tag-badge rating">${n} <span class="tag-score">${(s*100).toFixed(1)}%</span></span>`).join('');
    } else { dom.ratingSection.style.display = 'none'; }
    if (result.general && Object.keys(result.general).length > 0) {
        dom.generalSection.style.display = 'block';
        dom.generalTags.innerHTML = Object.entries(result.general).map(([n, s]) => `<span class="tag-badge general">${n.replace(/_/g, ' ')} <span class="tag-score">${(s*100).toFixed(1)}%</span></span>`).join('');
    } else { dom.generalSection.style.display = 'none'; }
    dom.tagSingleBtn.style.display = 'none';
    dom.exportSingleBtn.style.display = 'flex';
}

function closeDetailPanel() {
    dom.detailPanel.style.display = 'none'; state.selectedImageId = null;
    document.querySelectorAll('.image-card').forEach(c => c.classList.remove('selected'));
}

// ── Tagging ──
function updateCardChar(imageId, tags) {
    const card = $(`card-${imageId}`); if (!card) return;
    card.classList.add('tagged');
    const charName = Object.keys(tags.characters).join(', ');
    if (charName) {
        const overlay = card.querySelector('.image-card-overlay');
        let el = overlay.querySelector('.image-card-char');
        if (!el) { el = document.createElement('div'); el.className = 'image-card-char'; overlay.appendChild(el); }
        el.textContent = charName;
    }
}

async function tagCurrentImage() {
    const imageId = state.selectedImageId; if (!imageId) return;
    try {
        dom.tagSingleBtn.disabled = true; dom.tagSingleBtn.innerHTML = '<span class="spinner"></span>';
        const res = await apiCall(`/api/tag/${imageId}`, { method: 'POST', body: JSON.stringify(getThresholds()) });
        const data = await res.json();
        
        state.tagsCache[imageId] = { ...data.tags, _hash: data.hash };
        updateCardChar(imageId, data.tags);
        renderDetailTags(state.tagsCache[imageId]);
        dom.detailHash.textContent = data.hash ? data.hash.substring(0, 24) + '...' : '';
        updateTaggedCount();
        if (state.f95Enabled) computeF95Tags();
        showToast('Image tagged successfully!', 'success');
    } catch (e) { showToast(e.message, 'error'); }
    finally {
        dom.tagSingleBtn.disabled = false;
        dom.tagSingleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Tag this image';
    }
}

async function tagAllImages() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    dom.tagAllBtn.disabled = true;
    dom.tagAllBtn.innerHTML = '<span class="spinner"></span> Processing...';
    dom.progressContainer.style.display = 'block';
    const total = state.images.length; let processed = 0;
    try {
        for (const img of state.images) {
            dom.progressText.textContent = `Processing ${img.filename}...`;
            try {
                const res = await apiCall(`/api/tag/${img.id}`, { method: 'POST', body: JSON.stringify(getThresholds()) });
                const data = await res.json();
                
                state.tagsCache[img.id] = { ...data.tags, _hash: data.hash };
                updateCardChar(img.id, data.tags);
            } catch (e) { console.error(`Error tagging ${img.id}:`, e); }
            processed++;
            const pct = Math.round((processed / total) * 100);
            dom.progressPercent.textContent = `${pct}%`;
            dom.progressFill.style.width = `${pct}%`;
            if (state.selectedImageId === img.id && state.tagsCache[img.id]) renderDetailTags(state.tagsCache[img.id]);
        }
        updateTaggedCount();
        if (state.f95Enabled) computeF95Tags();
        showToast(`${processed} images tagged successfully!`, 'success');
        dom.exportAllBtn.disabled = false;
    } catch (e) { showToast(e.message, 'error'); }
    finally {
        state.isProcessing = false; dom.tagAllBtn.disabled = false;
        dom.tagAllBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Tag All';
        dom.progressText.textContent = 'Done!';
        setTimeout(() => { dom.progressContainer.style.display = 'none'; }, 2000);
    }
}

function updateTaggedCount() {
    const c = Object.keys(state.tagsCache).length;
    dom.taggedCount.textContent = `${c} tagged`;
    if (c > 0) dom.exportAllBtn.disabled = false;
}

// ── Export ──
async function exportSingle() {
    const imageId = state.selectedImageId; if (!imageId) return;
    try {
        const res = await fetch('/api/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image_id: imageId, use_hash: false }) });
        if (!res.ok) throw new Error('Export failed');
        const blob = await res.blob();
        const cd = res.headers.get('Content-Disposition'); let fn = 'tags.txt';
        if (cd) { const m = cd.match(/filename="?(.+?)"?$/); if (m) fn = m[1]; }
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = fn; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        showToast('Tags exported!', 'success');
    } catch (e) { showToast(e.message, 'error'); }
}

async function exportAll() {
    try {
        dom.exportAllBtn.disabled = true;
        dom.exportAllBtn.innerHTML = '<span class="spinner"></span> Exporting...';
        const res = await fetch('/api/export-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ use_hash: false }) });
        if (!res.ok) throw new Error('Export failed');
        const blob = await res.blob();
        const cd = res.headers.get('Content-Disposition'); let fn = 'lewdtagger_export.zip';
        if (cd) { const m = cd.match(/filename="?(.+?)"?$/); if (m) fn = m[1]; }
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = fn; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        showToast('All tags exported as ZIP!', 'success');
    } catch (e) { showToast(e.message, 'error'); }
    finally {
        dom.exportAllBtn.disabled = false;
        dom.exportAllBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export ZIP';
    }
}

// ── Threshold sliders ──
dom.generalThreshold.addEventListener('input', () => { dom.generalThresholdValue.textContent = parseFloat(dom.generalThreshold.value).toFixed(2); });
dom.charThreshold.addEventListener('input', () => { dom.charThresholdValue.textContent = parseFloat(dom.charThreshold.value).toFixed(2); });

// ── Keyboard shortcuts ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('f95Modal');
        if (modal) closeF95Modal();
        else closeDetailPanel();
    }
    if (e.key === 'Enter' && e.target === dom.folderInput) scanFolder();
});

// ── Init ──
checkModelStatus();
statusInterval = setInterval(checkModelStatus, 2000);
