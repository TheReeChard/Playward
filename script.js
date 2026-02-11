// ========================================
// Application State
// ========================================
let appData = {
    activityType: '',
    themeType: '', // 'default' or 'custom'
    theme: '',
    customTheme: '',
    themeFocus: '',
    themeCharacter: '',
    ageRange: '',
    diversity: '',
    medicalConsiderations: [],
    customization: {}
};

// Activity configuration for dynamic sidebar
const activityConfig = {
    'coloring': {
        name: 'Coloring Page',
        icon: 'images/coloringpage.png',
        color: '#e8f5e9'
    },
    'trivia': {
        name: 'Trivia',
        icon: 'images/trivia.png',
        color: '#fff3e0'
    },
    'hidden-objects': {
        name: 'Hidden Objects',
        icon: 'images/hiddenobject.png',
        color: '#e3f2fd'
    },
    'story': {
        name: 'Short Story',
        icon: 'images/shortstory.png',
        color: '#fce4ec'
    },
    'activity-game': {
        name: 'Game',
        icon: 'images/activity.png',
        color: '#f3e5f5'
    }
};

// Medical icons mapping
const medicalIcons = {
    'wheelchair': 'images/wheelchair.png',
    'syringe': 'images/syringe.png',
    'anxiety': 'images/anxiety.png',
    'surgery': 'images/surgery.png',
    'cast': 'images/cast.png',
    'pain': 'images/Pain.png'
};

// Breadcrumb page order
const pageOrder = [
    'instructions',
    'activity-select',
    'theme-type',
    'default-themes',
    'custom-theme',
    'personalization',
    'customization',
    'review',
    'final'
];

// Map pages to breadcrumb steps (some pages share the same step)
const pageToBreadcrumbStep = {
    'instructions': 0,
    'activity-select': 0,
    'theme-type': 1,
    'default-themes': 1,
    'custom-theme': 1,
    'personalization': 2,
    'customization': 2,
    'review': 3,
    'final': 3
};

// Prompt Templates
const promptTemplates = {
    'coloring': `Create a personalized, printable PDF coloring page for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Page Type: Standard Coloring Page
- Complexity / Age Level: {DIFFICULTY}
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}

Personalization:
- Child's Nickname: {NICKNAME}
- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

The page should be a standard coloring page with medium complexity and bold cartoon lines. The main character should be a kid superhero flying over the city. Personalize the illustration by using the child's nickname, and show that the superhero saves a cool, futuristic flying wheelchair. Include action stars, clouds, and motion lines throughout the scene. The overall feeling should highlight strength and confidence. Add the optional text "Super Jay Saves the Day!" on the page.`,

    'trivia': `Create a personalized trivia game for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Game Style: {GAME_STYLE}
- Question Count: {QUESTION_COUNT}
- Story Complexity: {STORY_COMPLEXITY}
- Theme or Character: {CHARACTER_INFO}

Personalization:
- Child's Nickname: {NICKNAME}
- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create engaging, age-appropriate trivia questions that are fun and educational. Include interesting facts and explanations with each answer.`,

    'hidden-objects': `Create a personalized hidden objects activity for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Page Type: Hidden Objects Activity
- Complexity / Age Level: {DIFFICULTY}
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}
- Objects to Include: {OBJECTS_TO_INCLUDE}

Personalization:
- Child's Nickname: {NICKNAME}
- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create a detailed scene with hidden objects that are challenging but findable. Include a checklist of items to find.`,

    'story': `Create a personalized short story for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Story Style: {STORY_STYLE}
- Story Setting: {STORY_SETTING}
- Story Genre: {STORY_GENRE}
- Story Complexity: {STORY_COMPLEXITY}
- Writing Style: {WRITING_STYLE}
- Theme or Character: {CHARACTER_INFO}

Personalization:
- Child's Nickname: {NICKNAME}
- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create an engaging, age-appropriate story with relatable characters and positive messages.`,

    'activity-game': `Create a personalized activity game for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Activity Location: {ACTIVITY_LOCATION}
- Number of Participants: {NUM_PARTICIPANTS}
- Specific Restrictions: {RESTRICTIONS}
- Theme or Character: {CHARACTER_INFO}

Personalization:
- Child's Nickname: {NICKNAME}
- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create clear game instructions with variations for different skill levels. The activity should be achievable and provide positive engagement.`
};

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    updateHeaderVisibility();
});

// ========================================
// Page Navigation
// ========================================
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update header visibility
    updateHeaderVisibility();
    
    // Update sidebar for pages that have one
    updateDynamicSidebar(pageId);
    
    // Update breadcrumb for all pages except landing
    updateBreadcrumb(pageId);
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function updateHeaderVisibility() {
    const header = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    const landingPage = document.getElementById('page-landing');
    
    if (landingPage && landingPage.classList.contains('active')) {
        header.classList.remove('visible');
        mainContent.classList.remove('with-header');
    } else {
        header.classList.add('visible');
        mainContent.classList.add('with-header');
    }
}

// ========================================
// Dynamic Sidebar
// ========================================
function updateDynamicSidebar(pageId) {
    const pagesWithSidebar = [
        'theme-type',
        'default-themes',
        'custom-theme',
        'personalization',
        'customization',
        'review'
    ];
    
    if (!pagesWithSidebar.includes(pageId)) return;
    
    const sidebarId = 'sidebar-' + pageId;
    const sidebar = document.getElementById(sidebarId);
    
    if (!sidebar) return;
    
    sidebar.innerHTML = generateSidebarContent(pageId);
}

function generateSidebarContent(currentPage) {
    const activity = activityConfig[appData.activityType];
    
    if (!activity) {
        return `
            <div class="sidebar-item" onclick="showPage('activity-select')">
                <img src="images/coloringpage.png" alt="Select Activity">
                <span>Select Activity</span>
            </div>
        `;
    }
    
    // Build navigation items based on progress
    let html = '';
    
    // Activity (always show selected activity)
    html += `
        <div class="sidebar-item ${currentPage === 'activity-select' ? 'active' : ''}" onclick="showPage('activity-select')" title="Change Activity">
            <img src="${activity.icon}" alt="${activity.name}">
            <span>${activity.name}</span>
        </div>
    `;
    
    // Theme (if set)
    if (appData.theme || appData.customTheme) {
        const themeName = appData.customTheme || formatTheme(appData.theme);
        const themeIcon = appData.themeType === 'custom' ? 'images/customtheme.png' : 'images/defaulttheme.png';
        html += `
            <div class="sidebar-item ${currentPage === 'default-themes' || currentPage === 'custom-theme' ? 'active' : ''}" onclick="showPage('theme-type')" title="Change Theme">
                <img src="${themeIcon}" alt="Theme">
                <span>${themeName}</span>
            </div>
        `;
    }
    
    // Medical/Personalization indicator
    if (appData.medicalConsiderations.length > 0 || appData.ageRange || appData.diversity) {
        let medicalIcon;
        let medicalLabel;
        
        if (appData.medicalConsiderations.length > 1) {
            // Multiple selections - use Multiselect icon
            medicalIcon = 'images/Multislect.png';
            medicalLabel = 'Multiple';
        } else if (appData.medicalConsiderations.length === 1) {
            // Single selection - use that medical consideration's icon
            const singleMedical = appData.medicalConsiderations[0];
            medicalIcon = medicalIcons[singleMedical] || 'images/girl1.png';
            medicalLabel = singleMedical.charAt(0).toUpperCase() + singleMedical.slice(1);
        } else {
            // No medical but has age/diversity
            medicalIcon = 'images/girl1.png';
            medicalLabel = 'Personal';
        }
        
        html += `
            <div class="sidebar-item ${currentPage === 'personalization' ? 'active' : ''}" onclick="showPage('personalization')" title="Edit Personalization">
                <img src="${medicalIcon}" alt="Personalization">
                <span>${medicalLabel}</span>
            </div>
        `;
    }
    
    // Customization indicator
    if (Object.keys(appData.customization).length > 0) {
        html += `
            <div class="sidebar-item ${currentPage === 'customization' ? 'active' : ''}" onclick="showPage('customization')" title="Edit Customization">
                <img src="images/girl2.png" alt="Customization">
                <span>Custom</span>
            </div>
        `;
    }
    
    return html;
}

// ========================================
// Quick Create
// ========================================
function quickCreate() {
    // Set defaults and skip to activity selection
    showPage('activity-select');
}

// ========================================
// Breadcrumb Navigation
// ========================================
function updateBreadcrumb(currentPageId) {
    // Don't show breadcrumb on landing page
    if (currentPageId === 'landing') return;
    
    const breadcrumbContainer = document.getElementById('breadcrumb-' + currentPageId);
    if (!breadcrumbContainer) return;
    
    const currentStep = pageToBreadcrumbStep[currentPageId] || 0;
    const totalSteps = 4;
    
    // Determine which steps are completed based on app state
    const completedSteps = getCompletedSteps();
    
    // Calculate progress percentage for the runner position
    const progressPercent = (currentStep / (totalSteps - 1)) * 100;
    
    // Calculate fill width (percentage of line to fill)
    const fillPercent = currentStep > 0 ? ((currentStep) / (totalSteps - 1)) * 100 : 0;
    
    let dotsHtml = '';
    
    for (let i = 0; i < totalSteps; i++) {
        const isActive = i === currentStep;
        const isCompleted = completedSteps.includes(i) || i < currentStep;
        const isClickable = isCompleted || i <= currentStep;
        
        dotsHtml += `
            <div class="progress-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isClickable ? 'disabled' : ''}" 
                 onclick="${isClickable ? `navigateToStep(${i})` : ''}" 
                 title="Step ${i + 1}">
            </div>
        `;
    }
    
    // Use girljumpright for the running animation
    const runnerImage = 'images/girljumpright.png';
    
    breadcrumbContainer.innerHTML = `
        <div class="progress-track">
            <div class="progress-line"></div>
            <div class="progress-line-fill" style="width: calc(${fillPercent}% - 30px);"></div>
            <div class="progress-dots">
                ${dotsHtml}
            </div>
            <img src="${runnerImage}" alt="Progress" class="progress-runner" style="left: calc(${progressPercent}% + 0px);">
        </div>
    `;
}

function getCompletedSteps() {
    const completed = [];
    
    // Step 0 is completed if activity is selected
    if (appData.activityType) {
        completed.push(0);
    }
    
    // Step 1 is completed if theme is selected
    if (appData.theme || appData.customTheme) {
        completed.push(1);
    }
    
    // Step 2 is completed if personalization page was visited (has any data or explicitly passed)
    if (appData.ageRange || appData.diversity || appData.medicalConsiderations.length > 0 || Object.keys(appData.customization).length > 0) {
        completed.push(2);
    }
    
    // Step 3 is completed if we're on the final page
    const finalPage = document.getElementById('page-final');
    if (finalPage && finalPage.classList.contains('active')) {
        completed.push(3);
    }
    
    return completed;
}

function navigateToStep(step) {
    // Map step number to a page
    switch(step) {
        case 0:
            showPage('activity-select');
            break;
        case 1:
            if (appData.themeType === 'custom') {
                showPage('custom-theme');
            } else if (appData.theme) {
                showPage('default-themes');
            } else {
                showPage('theme-type');
            }
            break;
        case 2:
            if (Object.keys(appData.customization).length > 0) {
                showPage('customization');
            } else {
                showPage('personalization');
            }
            break;
        case 3:
            showPage('review');
            break;
    }
}

// ========================================
// Activity Selection
// ========================================
function selectActivity(activity) {
    appData.activityType = activity;
    
    // Update visual selection
    document.querySelectorAll('.activity-item').forEach(item => {
        item.classList.remove('selected');
    });
    const selectedItem = document.querySelector(`.activity-item[data-activity="${activity}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
    
    // Auto-advance after short delay
    setTimeout(() => {
        showPage('theme-type');
    }, 300);
}

// ========================================
// Theme Type Selection
// ========================================
function selectThemeType(type) {
    appData.themeType = type;
    
    if (type === 'default') {
        showPage('default-themes');
    } else {
        showPage('custom-theme');
    }
}

// ========================================
// Default Theme Selection
// ========================================
function selectTheme(theme) {
    appData.theme = theme;
    appData.customTheme = '';
    
    // Update visual selection
    document.querySelectorAll('.theme-item').forEach(item => {
        item.classList.remove('selected');
    });
    const selectedItem = document.querySelector(`.theme-item[data-theme="${theme}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
    
    // Auto-advance
    setTimeout(() => {
        showPage('personalization');
    }, 300);
}

// ========================================
// Save Custom Theme
// ========================================
function saveCustomTheme() {
    appData.customTheme = document.getElementById('custom-theme-input').value;
    appData.themeFocus = document.getElementById('theme-focus-input').value;
    appData.themeCharacter = document.getElementById('theme-character-input').value;
    appData.theme = appData.customTheme;
    
    showPage('personalization');
}

// ========================================
// Medical Toggle
// ========================================
function toggleMedical(medical) {
    const item = document.querySelector(`.medical-item[data-medical="${medical}"]`);
    if (!item) return;
    
    item.classList.toggle('selected');
    
    if (item.classList.contains('selected')) {
        if (!appData.medicalConsiderations.includes(medical)) {
            appData.medicalConsiderations.push(medical);
        }
    } else {
        appData.medicalConsiderations = appData.medicalConsiderations.filter(m => m !== medical);
    }
}

// ========================================
// Save Personalization
// ========================================
function savePersonalization() {
    appData.ageRange = document.getElementById('age-range').value;
    appData.diversity = document.getElementById('diversity-select').value;
    
    loadCustomizationPage();
    showPage('customization');
}

// ========================================
// Load Customization Page
// ========================================
function loadCustomizationPage() {
    const container = document.getElementById('customization-content');
    const title = document.getElementById('customization-title');
    const subtitle = document.getElementById('customization-subtitle');
    
    if (!container || !title || !subtitle) return;
    
    let html = '';
    
    switch(appData.activityType) {
        case 'coloring':
            title.textContent = 'Coloring Page Customization';
            subtitle.textContent = 'Select the style of the visuals on your final piece from one of the icons below.';
            html = getArtStyleHTML();
            break;
            
        case 'trivia':
            title.textContent = 'Trivia Customization';
            subtitle.textContent = 'Select the aspects of the trivia game you want to adjust here. These selections are optional.';
            html = `
                <div class="dropdowns-grid">
                    <div class="form-group">
                        <label>Game Style <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="game-style">
                            <option value="">Select...</option>
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true-false">True/False</option>
                            <option value="fill-blank">Fill in the Blank</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Question Count <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="question-count">
                            <option value="">Select...</option>
                            <option value="5">5 Questions</option>
                            <option value="10">10 Questions</option>
                            <option value="15">15 Questions</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Story Complexity <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="story-complexity">
                            <option value="">Select...</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Child's Nickname <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <input type="text" id="child-nickname" placeholder="">
                    </div>
                </div>
                <div class="form-actions right">
                    <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
                </div>`;
            break;
            
        case 'hidden-objects':
            title.textContent = 'Hidden Objects Customization';
            subtitle.textContent = 'Select the style of the visuals on your final piece from one of the icons below. You can also choose to add any specific objects you want to include by typing them in the text box below.';
            html = getArtStyleHTML() + `
                <div class="form-group">
                    <label>Objects to Include <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                    <input type="text" id="objects-include" placeholder="Enter any specific objects you want to be included">
                </div>
                <div class="form-actions right">
                    <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
                </div>`;
            break;
            
        case 'story':
            title.textContent = 'Short Story Customization';
            subtitle.textContent = 'Select the story components from the options below. All selections are optional, and if you wish to skip this section simply press the "Next" button.';
            html = `
                <div class="dropdowns-grid">
                    <div class="form-group">
                        <label>Story Style <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="story-style">
                            <option value="">Select...</option>
                            <option value="adventure">Adventure</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="educational">Educational</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Story Setting <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="story-setting">
                            <option value="">Select...</option>
                            <option value="forest">Forest</option>
                            <option value="city">City</option>
                            <option value="space">Space</option>
                            <option value="ocean">Ocean</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Story Genre <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="story-genre">
                            <option value="">Select...</option>
                            <option value="comedy">Comedy</option>
                            <option value="mystery">Mystery</option>
                            <option value="action">Action</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Story Complexity <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="story-complexity">
                            <option value="">Select...</option>
                            <option value="simple">Simple</option>
                            <option value="medium">Medium</option>
                            <option value="complex">Complex</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Writing Style <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <select id="writing-style">
                            <option value="">Select...</option>
                            <option value="playful">Playful</option>
                            <option value="descriptive">Descriptive</option>
                            <option value="simple">Simple</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Child's Nickname <i class="fa-solid fa-circle-info info-tooltip"></i></label>
                        <input type="text" id="child-nickname" placeholder="">
                    </div>
                </div>
                <div class="form-actions right">
                    <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
                </div>`;
            break;
            
        case 'activity-game':
            title.textContent = 'Activity Customization';
            subtitle.textContent = 'Input the location you want the activity to take place at, the number of participants, and any restrictions the participants have in the provided text box below.';
            html = `
                <div class="form-group">
                    <label>Activity Location</label>
                    <span class="hint">Example: bedroom, floor, wheelchair, etc.</span>
                    <input type="text" id="activity-location" placeholder="">
                </div>
                <div class="form-group">
                    <label>Number of Participants</label>
                    <span class="hint">The number of individuals participating in the activity</span>
                    <input type="text" id="num-participants" placeholder="">
                </div>
                <div class="form-group">
                    <label>Specific Restrictions</label>
                    <span class="hint">Example: low mobility, limited dexterity, bed rest, etc.</span>
                    <input type="text" id="restrictions" placeholder="">
                </div>
                <div class="form-actions right">
                    <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
                </div>`;
            break;
            
        default:
            html = '<p>Please select an activity type first.</p>';
    }
    
    container.innerHTML = html;
}

// ========================================
// Get Art Style HTML
// ========================================
function getArtStyleHTML() {
    return `
        <div class="art-style-grid">
            <div class="art-style-item" data-style="3d-rendering" onclick="selectArtStyle('3d-rendering')">
                <div class="art-style-box">
                    <img src="images/3drender.png" alt="3D Rendering">
                </div>
                <span class="art-style-label">3D Rendering</span>
            </div>
            <div class="art-style-item" data-style="comic-book" onclick="selectArtStyle('comic-book')">
                <div class="art-style-box">
                    <img src="images/ComicBook.png" alt="Comic Book">
                </div>
                <span class="art-style-label">Comic Book</span>
            </div>
            <div class="art-style-item" data-style="geometric" onclick="selectArtStyle('geometric')">
                <div class="art-style-box">
                    <img src="images/geometric.png" alt="Geometric">
                </div>
                <span class="art-style-label">Geometric</span>
            </div>
            <div class="art-style-item" data-style="anime" onclick="selectArtStyle('anime')">
                <div class="art-style-box">
                    <img src="images/Anime.png" alt="Anime">
                </div>
                <span class="art-style-label">Anime</span>
            </div>
            <div class="art-style-item" data-style="realistic" onclick="selectArtStyle('realistic')">
                <div class="art-style-box">
                    <img src="images/Realistic.png" alt="Realistic">
                </div>
                <span class="art-style-label">Realistic</span>
            </div>
            <div class="art-style-item" data-style="drawing" onclick="selectArtStyle('drawing')">
                <div class="art-style-box">
                    <img src="images/drawing.png" alt="Drawing">
                </div>
                <span class="art-style-label">Drawing</span>
            </div>
        </div>
        <div class="form-actions right">
            <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
        </div>`;
}

// ========================================
// Select Art Style
// ========================================
function selectArtStyle(style) {
    appData.customization.artStyle = style;
    
    document.querySelectorAll('.art-style-item').forEach(item => {
        item.classList.remove('selected');
    });
    const selectedItem = document.querySelector(`.art-style-item[data-style="${style}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

// ========================================
// Save Customization
// ========================================
function saveCustomization() {
    // Gather all customization data
    const inputs = document.querySelectorAll('#customization-content input, #customization-content select');
    inputs.forEach(input => {
        if (input.id && input.value) {
            appData.customization[input.id] = input.value;
        }
    });
    
    loadReviewPage();
    showPage('review');
}

// ========================================
// Load Review Page
// ========================================
function loadReviewPage() {
    const container = document.getElementById('review-summary');
    if (!container) return;
    
    const activityNames = {
        'coloring': 'Coloring Page',
        'trivia': 'Trivia',
        'hidden-objects': 'Hidden Objects',
        'story': 'Short Story',
        'activity-game': 'Activity Game'
    };
    
    let html = `<p>Create a personalized <strong>${activityNames[appData.activityType]}</strong> for a <strong>${appData.ageRange || '7'}-year-old</strong> child with the theme of <strong>${formatTheme(appData.theme)}</strong>.</p><br>`;
    
    html += `<strong>Activity Requirements:</strong><br>`;
    html += `- Page Type: ${activityNames[appData.activityType]}<br>`;
    html += `- Complexity / Age Level: ${getDifficulty()}<br>`;
    
    if (appData.customization.artStyle) {
        html += `- Art Style: ${appData.customization.artStyle}<br>`;
    }
    
    if (appData.themeCharacter) {
        html += `- Theme Character: ${appData.themeCharacter}<br>`;
    }
    
    html += `<br><strong>Personalization:</strong><br>`;
    
    if (appData.customization['child-nickname']) {
        html += `- Child's Nickname: ${appData.customization['child-nickname']}<br>`;
    }
    
    html += `- Medical Context: ${formatMedicalContext()}<br>`;
    
    if (appData.diversity) {
        html += `- Diversity: ${formatDiversityShort()}<br>`;
    }
    
    container.innerHTML = html;
}

// ========================================
// Edit Choices
// ========================================
function editChoices() {
    showPage('personalization');
}

// ========================================
// Generate Prompt
// ========================================
function generatePrompt() {
    const template = promptTemplates[appData.activityType];
    if (!template) return;
    
    let prompt = template;
    
    const themeToUse = appData.customTheme || formatTheme(appData.theme);
    
    const replacements = {
        '{AGE_GROUP}': appData.ageRange || '7',
        '{THEME}': themeToUse,
        '{CHARACTER_INFO}': appData.themeCharacter || 'A kid superhero flying over the city',
        '{MEDICAL_CONTEXT}': formatMedicalContext(),
        '{DIVERSITY_REQUIREMENTS}': formatDiversityRequirements(),
        '{DIFFICULTY}': getDifficulty(),
        '{ART_STYLE}': appData.customization.artStyle || 'Bold Cartoon Lines',
        '{NICKNAME}': appData.customization['child-nickname'] || 'Jay',
        '{GAME_STYLE}': appData.customization['game-style'] || 'Multiple Choice',
        '{QUESTION_COUNT}': appData.customization['question-count'] || '10',
        '{STORY_COMPLEXITY}': appData.customization['story-complexity'] || 'Medium',
        '{STORY_STYLE}': appData.customization['story-style'] || 'Adventure',
        '{STORY_SETTING}': appData.customization['story-setting'] || 'Forest',
        '{STORY_GENRE}': appData.customization['story-genre'] || 'Comedy',
        '{WRITING_STYLE}': appData.customization['writing-style'] || 'Playful',
        '{OBJECTS_TO_INCLUDE}': appData.customization['objects-include'] || 'Various themed objects',
        '{ACTIVITY_LOCATION}': appData.customization['activity-location'] || 'Bedroom',
        '{NUM_PARTICIPANTS}': appData.customization['num-participants'] || '1',
        '{RESTRICTIONS}': appData.customization['restrictions'] || 'None'
    };
    
    for (const [key, value] of Object.entries(replacements)) {
        prompt = prompt.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    
    const promptElement = document.getElementById('generated-prompt');
    if (promptElement) {
        promptElement.textContent = prompt;
    }
    
    showPage('final');
}

// ========================================
// Helper Functions
// ========================================
function formatTheme(theme) {
    if (!theme) return 'Superheroes Adventure';
    return theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ');
}

function getDifficulty() {
    const age = appData.ageRange;
    if (age === '3-5') return 'Very Easy';
    if (age === '6-8') return 'Easy';
    if (age === '9-11') return 'Medium';
    if (age === '12-14') return 'Medium-Hard';
    if (age === '15-18') return 'Hard';
    return 'Medium';
}

function formatMedicalContext() {
    if (appData.medicalConsiderations.length === 0) {
        return 'None specified';
    }
    return appData.medicalConsiderations.map(m => {
        const names = {
            'wheelchair': 'Wheelchair',
            'syringe': 'IV/Injections',
            'anxiety': 'Anxiety',
            'surgery': 'Surgery',
            'cast': 'Cast',
            'pain': 'Pain'
        };
        return names[m] || m;
    }).join(', ');
}

function formatDiversityShort() {
    const names = {
        'multicultural': 'Multicultural',
        'gender-inclusive': 'Gender-inclusive',
        'accessibility': 'Visual accessibility',
        'language': 'Simplified language'
    };
    return names[appData.diversity] || appData.diversity;
}

function formatDiversityRequirements() {
    if (!appData.diversity) {
        return '';
    }
    switch(appData.diversity) {
        case 'multicultural': return 'Include diverse cultural representations and backgrounds.';
        case 'gender-inclusive': return 'Use gender-inclusive language and diverse character representations.';
        case 'accessibility': return 'Ensure visual accessibility with high contrast, clear images, and large text.';
        case 'language': return 'Use simplified language appropriate for ESL learners.';
        default: return '';
    }
}

// ========================================
// Copy Prompt
// ========================================
function copyPrompt() {
    const promptElement = document.getElementById('generated-prompt');
    if (!promptElement) return;
    
    const promptText = promptElement.textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        showNotification('Prompt copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Prompt copied to clipboard!');
    });
}

// ========================================
// Open in AI Platform
// ========================================
function openInAI(platform) {
    const promptElement = document.getElementById('generated-prompt');
    if (!promptElement) return;
    
    const promptText = promptElement.textContent;
    
    navigator.clipboard.writeText(promptText).then(() => {
        let url = '';
        switch(platform) {
            case 'chatgpt':
                url = 'https://chat.openai.com/';
                break;
            case 'gemini':
                url = 'https://gemini.google.com/app';
                break;
            case 'claude':
                url = 'https://claude.ai/new';
                break;
        }
        
        window.open(url, '_blank');
        showNotification(`Prompt copied! Opening ${platform}...`);
    });
}

// ========================================
// Show Notification
// ========================================
function showNotification(message) {
    const notification = document.getElementById('copy-notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
