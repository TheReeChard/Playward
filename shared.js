// ========================================
// PlayWard - Shared JavaScript
// State management via localStorage
// ========================================

// ========================================
// Application State Management
// ========================================
const defaultAppData = {
  activityType: "",
  themeType: "",
  theme: "",
  customTheme: "",
  themeFocus: "",
  themeCharacter: "",
  ageRange: "",
  medicalConsiderations: [],
  customization: {},
};

// Load state from localStorage
function loadAppData() {
  const stored = localStorage.getItem("playwardData");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading app data:", e);
      return { ...defaultAppData };
    }
  }
  return { ...defaultAppData };
}

// Save state to localStorage
function saveAppData(data) {
  localStorage.setItem("playwardData", JSON.stringify(data));
}

// Get current app data
let appData = loadAppData();

// Reset all data
function resetAppData() {
  appData = { ...defaultAppData };
  saveAppData(appData);
}

// ========================================
// Activity Configuration
// ========================================
const activityConfig = {
  coloring: {
    name: "Coloring Page",
    icon: "images/coloringpage1.png",
    color: "#e8f5e9",
  },
  "spot-the-difference": {
    name: "Spot the Difference",
    icon: "images/spotdiff1.png",
    color: "#fff3e0",
  },
  "hidden-objects": {
    name: "Hidden Objects",
    icon: "images/hiddenobject1.png",
    color: "#e3f2fd",
  },
  crossword: {
    name: "Crossword",
    icon: "images/crossword1.png",
    color: "#fce4ec",
  },
  wordsearch: {
    name: "Word Search",
    icon: "images/wordsearch1.png",
    color: "#f3e5f5",
  },
};

// Medical icons mapping
const medicalIcons = {
  wheelchair: "images/wheelchair.png",
  syringe: "images/syringe.png",
  pain: "images/pain.png",
  iv: "images/iv.png",
  surgery: "images/surgery.png",
  halo: "images/halo.png",
  anxiety: "images/anxiety.png",
  ngtube: "images/ngtube.png",
};

// ========================================
// Header Generation
// ========================================
function generateHeader() {
  const header = document.getElementById("main-header");
  if (!header) return;

  // Detect which nav link should be "active" based on current page
  const page = window.location.pathname.split("/").pop() || "index.html";
  const aboutActive = page === "about.html" ? ' class="active"' : "";
  const supportActive = page === "support.html" ? ' class="active"' : "";

  header.className = "header visible";
  header.innerHTML = `
    <div class="header-logo" onclick="goToPage('index.html')" style="cursor:pointer">
      <img src="images/logo.png" alt="PlayWard Logo" class="header-logo-img" />
      <span class="logo-text">PlayWard</span>
    </div>
    <nav class="header-nav">
      <a href="about.html"${aboutActive}>About Us</a>
      <span>|</span>
      <a href="support.html"${supportActive}>Need Help?</a>
    </nav>
  `;
}

// Auto-run on every page that has the header element
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", generateHeader);
} else {
  generateHeader();
}

// ========================================
// Navigation
// ========================================
function goToPage(pageName) {
  window.location.href = pageName;
}

// ========================================
// Prompt Templates
// ========================================
const promptTemplates = {
  coloring: `Create a personalized, printable PDF coloring page for a {AGE_GROUP} year old {GENDER} with the theme of {THEME}.

Activity Requirements:
- Page Type: Standard Coloring Page
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}{GENDER_LINE}- Medical Context: {MEDICAL_CONTEXT}
{CHILD_DESCRIPTION_LINE}

The page should be a standard coloring page with medium complexity and bold cartoon lines.{NICKNAME_INSTRUCTION}{NICKNAME_TEXT_INSTRUCTION}`,

  "spot-the-difference": `Create a personalized, printable spot-the-difference activity for a {AGE_GROUP} year old {GENDER} with the theme of {THEME}.

Activity Requirements:
- Page Type: Spot the Difference
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}
- Number of Differences: {NUM_DIFFERENCES}
- Objects to Include: {OBJECTS_TO_INCLUDE}

Personalization:
{NICKNAME_LINE}{GENDER_LINE}- Medical Context: {MEDICAL_CONTEXT}
{CHILD_DESCRIPTION_LINE}

Create two nearly identical side-by-side illustrations based on the theme, with {NUM_DIFFERENCES} subtle differences between them. Include a checklist or answer key at the bottom.{NICKNAME_INSTRUCTION}`,

  "hidden-objects": `Create an image of a personalized hidden objects activity for a {AGE_GROUP} year old {GENDER} with the theme of {THEME}.

Activity Requirements:
- Page Type: Hidden Objects Activity
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}
- Objects to Include: {OBJECTS_TO_INCLUDE}

Personalization:
{NICKNAME_LINE}{GENDER_LINE}- Medical Context: {MEDICAL_CONTEXT}
{CHILD_DESCRIPTION_LINE}

Create a detailed scene with hidden objects that are challenging but findable. Include a checklist of items to find.{NICKNAME_INSTRUCTION}`,

  crossword: `Create a personalized, printable crossword puzzle for a {AGE_GROUP} year old {GENDER} with the theme of {THEME}.

Activity Requirements:
- Page Type: Crossword Puzzle
- Word Count: {WORD_COUNT}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}{GENDER_LINE}- Medical Context: {MEDICAL_CONTEXT}

Generate age-appropriate crossword clues and answers themed around {THEME}. Include an answer key on a separate section.{NICKNAME_INSTRUCTION}`,

  wordsearch: `Create a personalized, printable word search puzzle for a {AGE_GROUP} year old {GENDER} with the theme of {THEME}.

Activity Requirements:
- Page Type: Word Search
- Grid Size: {GRID_SIZE}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}{GENDER_LINE}- Medical Context: {MEDICAL_CONTEXT}

Generate a {GRID_SIZE} word search grid filled with theme-related words. Include the word list below the grid and an answer key.{NICKNAME_INSTRUCTION}`,
};

// ========================================
// Helper Functions
// ========================================
function formatTheme(theme) {
  if (!theme) return "Superheroes Adventure";
  return theme.charAt(0).toUpperCase() + theme.slice(1).replace("-", " ");
}

function formatGender() {
  const g = appData.gender;
  if (!g || g === "do-not-specify") return "";
  if (g === "male") return "boy";
  if (g === "female") return "girl";
  return "";
}

function formatMedicalContext() {
  if (appData.medicalConsiderations.length === 0) {
    return "";
  }
  return appData.medicalConsiderations
    .map((m) => {
      const names = {
        wheelchair: "Wheelchair",
        syringe: "IV/Injections",
        pain: "Pain",
        iv: "IV",
        surgery: "Surgery",
        halo: "Halo",
        anxiety: "Anxiety",
        ngtube: "NG Tube",
      };
      return names[m] || m;
    })
    .join(", ");
}

function generateSidebar(currentPage) {
  const sidebarContainer = document.getElementById("dynamic-sidebar");
  if (!sidebarContainer) return;

  const activity = activityConfig[appData.activityType];

  if (!activity) {
    sidebarContainer.innerHTML = `
      <div class="sidebar-item active" onclick="goToPage('activity-select.html')">
        <div class="sidebar-icon-bg rectangle">
          <img src="images/coloringpage.png" alt="Select Activity">
        </div>
      </div>
    `;
    return;
  }

  // Determine how many sidebar icons to show based on current page
  const stepOrder = [
    "theme-type",
    "default-themes",
    "custom-theme",
    "personalization",
    "personalization2",
    "customization",
    "review",
    "final",
  ];
  const stepIndex = stepOrder.indexOf(currentPage);

  let html = `<div class="sidebar-previous-label" style="text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: calc(-0.9rem + 2px); padding: 0 6px; line-height: 1.3;">Previous<br>Choices</div>`;

  // 1. Activity — always show (rectangle)
  const activityLabel = activity.name || "";
  html += `
    <div class="sidebar-item ${currentPage === "activity-select" ? "active" : ""}" onclick="goToPage('activity-select.html')" title="Change Activity">
      <div class="sidebar-icon-bg rectangle" style="background: none; border: none; box-shadow: none; width: 110px; height: 100px;">
        <img src="${activity.icon}" alt="${activity.name}" style="width: 100px; height: 100px; object-fit: contain;">
      </div>
      ${currentPage !== "activity-select" ? `<span class="sidebar-label">${activityLabel}</span>` : ""}
    </div>
  `;

  // 2. Theme Type — show from default-themes/custom-theme onward (stepIndex >= 1)
  if (stepIndex >= 1) {
    const themeTypeIcon =
      appData.themeType === "custom"
        ? "images/customtheme.png"
        : "images/defaulttheme.png";
    const themeTypeLabel =
      appData.themeType === "custom" ? "Custom" : "Default";
    const isThemeTypeActive =
      currentPage === "default-themes" || currentPage === "custom-theme";
    html += `
      <div class="sidebar-item ${isThemeTypeActive ? "active" : ""}" onclick="goToPage('theme-type.html')" title="Change Theme Type">
        <div class="sidebar-icon-bg rectangle" style="width: 95px; height: 70px;">
          <img src="${themeTypeIcon}" alt="Theme Type" style="width: 55px; height: 55px; object-fit: contain;">
        </div>
        ${themeTypeLabel ? `<span class="sidebar-label">${themeTypeLabel}</span>` : ""}
      </div>
    `;
  }

  // 3. Specific Theme — show from personalization onward (stepIndex >= 3)
  if (stepIndex >= 3) {
    const themeIconMap = {
      superheroes: "images/superhero.png",
      animals: "images/animal.png",
      sports: "images/sport.png",
      space: "images/space.png",
      ocean: "images/ocean.png",
      nature: "images/nature.png",
    };
    const themeLabel = appData.customTheme
      ? appData.customTheme
      : appData.theme
        ? appData.theme.charAt(0).toUpperCase() + appData.theme.slice(1)
        : "";
    const themeIcon = appData.customTheme
      ? "images/customtheme.png"
      : appData.theme
        ? themeIconMap[appData.theme] || "images/defaulttheme.png"
        : "images/defaulttheme.png";
    html += `
      <div class="sidebar-item" onclick="goToPage(appData.themeType === 'custom' ? 'custom-theme.html' : 'default-themes.html')" title="Change Theme">
        <div class="sidebar-icon-bg square">
          <img src="${themeIcon}" alt="Theme">
        </div>
        ${themeLabel ? `<span class="sidebar-label">${themeLabel}</span>` : ""}
      </div>
    `;
  }

  // 4. Personalization (medical) — show from personalization2 onward (stepIndex >= 4)
  if (stepIndex >= 4) {
    let medicalIcon = "images/girl1.png";
    let medicalLabel = "";
    if (appData.medicalConsiderations.length > 1) {
      medicalIcon = "images/Multislect.png";
      medicalLabel = "Multiple";
    } else if (appData.medicalConsiderations.length === 1) {
      medicalIcon =
        medicalIcons[appData.medicalConsiderations[0]] || "images/girl1.png";
      medicalLabel =
        appData.medicalConsiderations[0].charAt(0).toUpperCase() +
        appData.medicalConsiderations[0].slice(1);
    }
    const isPersonalizationActive =
      currentPage === "personalization" || currentPage === "personalization2";
    html += `
      <div class="sidebar-item ${isPersonalizationActive ? "active" : ""}" onclick="goToPage('personalization.html')" title="Edit Personalization">
        <div class="sidebar-icon-bg diamond">
          <img src="${medicalIcon}" alt="Personalization">
        </div>
        ${medicalLabel ? `<span class="sidebar-label">${medicalLabel}</span>` : ""}
      </div>
    `;
  }

  // 5. Age/Gender — show from customization onward (stepIndex >= 5)
  if (stepIndex >= 5) {
    const ageLabel = appData.ageRange ? appData.ageRange : "";
    html += `
      <div class="sidebar-item" onclick="goToPage('personalization2.html')" title="Edit Age/Gender">
        <img src="images/age.png" alt="Age/Gender" style="width: 80px; height: 80px; object-fit: contain;">
        ${ageLabel ? `<span class="sidebar-label">${ageLabel}</span>` : ""}
      </div>
    `;
  }

  // 6. Customization — show from review onward (stepIndex >= 6)
  if (stepIndex >= 6) {
    let customIcon = "images/girl2.png";
    let customLabel = "";
    if (appData.customization.artStyle) {
      const artStyleIcons = {
        "3d-rendering": "images/3drender.png",
        "comic-book": "images/comic-book.png",
        geometric: "images/geometric.png",
        anime: "images/Anime.png",
        realistic: "images/Realistic.png",
        drawing: "images/drawing.png",
      };
      const artStyleLabels = {
        "3d-rendering": "3D Rendering",
        "comic-book": "Comic Book",
        geometric: "Geometric",
        anime: "Anime",
        realistic: "Realistic",
        drawing: "Drawing",
      };
      customIcon = artStyleIcons[appData.customization.artStyle] || customIcon;
      customLabel = artStyleLabels[appData.customization.artStyle] || "";
    }
    html += `
      <div class="sidebar-item" onclick="goToPage('customization.html')" title="Edit Customization">
        <img src="${customIcon}" alt="Customization" style="width: 65px; height: 65px; object-fit: contain; filter: grayscale(100%);">
        ${customLabel ? `<span class="sidebar-label">${customLabel}</span>` : ""}
      </div>
    `;
  }

  sidebarContainer.innerHTML = html;
}

// ========================================
// Breadcrumb Navigation
// ========================================
// Page to step mapping
const pageToStep = {
  "activity-select": 0,
  "theme-type": 1,
  "default-themes": 2,
  "custom-theme": 2,
  personalization: 3,
  personalization2: 3,
  customization: 4,
  review: 5,
  final: 6,
};

// Runner images for each step
const stepRunnerImages = {
  0: "images/girl1.png",
  1: "images/girl1.png",
  2: "images/girl2.png",
  3: "images/girl2.png",
  4: "images/girl2.png",
  5: "images/girl3.png",
  6: "images/girl4.png",
};

function generateBreadcrumb(currentPage) {
  const breadcrumbContainer = document.getElementById("progress-breadcrumb");
  if (!breadcrumbContainer) return;

  const currentStep = pageToStep[currentPage] ?? 0;
  const totalSteps = 7;

  // Determine which steps are completed based on app state
  const completedSteps = getCompletedSteps();

  // Calculate progress percentage for the runner position
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;

  // Calculate fill width
  const fillPercent =
    currentStep > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  let dotsHtml = "";

  for (let i = 0; i < totalSteps; i++) {
    const isActive = i === currentStep;
    const isCompleted = completedSteps.includes(i) || i < currentStep;
    const isClickable = isCompleted || i <= currentStep;

    dotsHtml += `
      <div class="progress-dot ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${!isClickable ? "disabled" : ""}" 
           onclick="${isClickable ? `navigateToStep(${i})` : ""}" 
           title="Step ${i + 1}">
      </div>
    `;
  }

  // Get the appropriate runner image for this step
  const runnerImage = stepRunnerImages[currentStep] || "images/girl1.png";

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

  // Step 0: Activity selected
  if (appData.activityType) {
    completed.push(0);
  }

  // Step 1: Theme type selected
  if (appData.themeType) {
    completed.push(1);
  }

  // Step 2: Theme selected
  if (appData.theme || appData.customTheme) {
    completed.push(2);
  }

  // Step 3: Personalization
  if (appData.ageRange || appData.medicalConsiderations.length > 0) {
    completed.push(3);
  }

  // Step 4: Customization
  if (Object.keys(appData.customization).length > 0) {
    completed.push(4);
  }

  // Steps 5 & 6 are completed when visited
  return completed;
}

function navigateToStep(step) {
  switch (step) {
    case 0:
      goToPage("activity-select.html");
      break;
    case 1:
      goToPage("theme-type.html");
      break;
    case 2:
      if (appData.themeType === "custom") {
        goToPage("custom-theme.html");
      } else {
        goToPage("default-themes.html");
      }
      break;
    case 3:
      goToPage("personalization.html");
      break;
    case 4:
      goToPage("customization.html");
      break;
    case 5:
      goToPage("review.html");
      break;
    case 6:
      goToPage("final.html");
      break;
  }
}

// ========================================
// Generate Final Prompt
// ========================================
function generatePrompt() {
  const template = promptTemplates[appData.activityType];
  if (!template) return "";

  let prompt = template;

  const baseTheme = appData.customTheme || formatTheme(appData.theme);
  const themeToUse = appData.themeFocus
    ? `${baseTheme} (focus: ${appData.themeFocus})`
    : baseTheme;
  const nickname = appData.customization["child-nickname"] || "";

  // Conditional nickname content
  const nicknameLineText = nickname ? `- Child's Nickname: ${nickname}\n` : "";
  const nicknameInstruction = nickname
    ? ` Personalize the content by using the child's nickname "${nickname}".`
    : "";
  const nicknameTextInstruction = nickname
    ? ` Add the optional text "Super ${nickname} Saves the Day!" on the page.`
    : "";

  const childDescription = appData.childDescription || "";
  const childDescriptionLine = childDescription
    ? `- Child Description: ${childDescription}\n`
    : "";

  const genderText = formatGender();
  // Inline: replaces "child" in the opening line when gender is known
  const genderInline = genderText || "child";
  // Personalization block line: only shown when gender is known
  const genderLine = genderText ? `- Gender: ${genderText}\n` : "";

  const replacements = {
    "{AGE_GROUP}": appData.ageRange || "",
    "{GENDER}": genderInline,
    "{GENDER_LINE}": genderLine,
    "{THEME}": themeToUse || "",
    "{CHARACTER_INFO}": appData.themeCharacter || "",
    "{MEDICAL_CONTEXT}": formatMedicalContext(),
    "{ART_STYLE}": appData.customization.artStyle || "",
    "{NICKNAME_LINE}": nicknameLineText,
    "{NICKNAME_INSTRUCTION}": nicknameInstruction,
    "{NICKNAME_TEXT_INSTRUCTION}": nicknameTextInstruction,
    "{CHILD_DESCRIPTION_LINE}": childDescriptionLine,
    "{OBJECTS_TO_INCLUDE}": appData.customization["objects-include"] || "",
    "{WORD_COUNT}": appData.customization["word-count"] || "",
    "{GRID_SIZE}": appData.customization["grid-size"] || "",
    "{NUM_DIFFERENCES}": appData.customization["num-differences"] || "5",
  };

  for (const [key, value] of Object.entries(replacements)) {
    prompt = prompt.replace(
      new RegExp(key.replace(/[{}]/g, "\\$&"), "g"),
      value,
    );
  }

  return prompt;
}

// ========================================
// Copy to Clipboard
// ========================================
function copyPrompt() {
  const promptElement = document.getElementById("generated-prompt");
  if (!promptElement) return;

  const promptText =
    promptElement.value !== undefined
      ? promptElement.value
      : promptElement.textContent;
  navigator.clipboard
    .writeText(promptText)
    .then(() => {
      showNotification("Prompt copied to clipboard!");
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = promptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showNotification("Prompt copied to clipboard!");
    });
}

// ========================================
// Open in AI Platform
// ========================================
function openInAI(platform) {
  const promptElement = document.getElementById("generated-prompt");
  if (!promptElement) return;

  const promptText =
    promptElement.value !== undefined
      ? promptElement.value
      : promptElement.textContent;

  navigator.clipboard.writeText(promptText).then(() => {
    let url = "";
    switch (platform) {
      case "chatgpt":
        url = "https://chat.openai.com/";
        break;
      case "gemini":
        url = "https://gemini.google.com/app";
        break;
      case "claude":
        url = "https://claude.ai/new";
        break;
    }

    window.open(url, "_blank");
    showNotification(`Prompt copied! Opening ${platform}...`);
  });
}

// ========================================
// Show Notification
// ========================================
function showNotification(message) {
  const notification = document.getElementById("copy-notification");
  if (!notification) return;

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ========================================
// Activity Customization Content Generation
// ========================================
function getCustomizationContent() {
  const activityType = appData.activityType;

  switch (activityType) {
    case "coloring":
      return getColoringCustomization();
    case "spot-the-difference":
      return getSpotDiffCustomization();
    case "hidden-objects":
      return getHiddenObjectsCustomization();
    case "crossword":
      return getCrosswordCustomization();
    case "wordsearch":
      return getWordsearchCustomization();
    default:
      return "<p>Please select an activity type first.</p>";
  }
}

function sel(val, match) {
  return val === match ? "selected" : "";
}

function artStyleGrid(styles, autoAdvance = true) {
  const labels = {
    "3d-rendering": "3D Rendering",
    "comic-book": "Comic Book",
    geometric: "Geometric",
    anime: "Anime",
    realistic: "Realistic",
    drawing: "Drawing",
  };
  const imgs = {
    "3d-rendering": "images/3drender.png",
    "comic-book": "images/comic-book.png",
    geometric: "images/geometric.png",
    anime: "images/Anime.png",
    realistic: "images/Realistic.png",
    drawing: "images/drawing.png",
  };
  const autoAdvanceAttr = autoAdvance ? "true" : "false";
  return styles
    .map(
      (s) =>
        `<div class="art-style-item ${sel(appData.customization.artStyle, s)}" data-style="${s}" data-auto-advance="${autoAdvanceAttr}" style="cursor:pointer;">
        <img src="${imgs[s]}" alt="${labels[s]}" style="width: 160px; height: 160px; object-fit: contain; pointer-events: none;">
        <span class="art-style-label" style="pointer-events: none;">${labels[s]}</span>
      </div>`,
    )
    .join("");
}

function getColoringCustomization() {
  const styles = [
    "drawing",
    "anime",
    "3d-rendering",
    "geometric",
    "comic-book",
    "realistic",
  ];
  return `
    <div class="art-style-grid">
      ${artStyleGrid(styles)}
    </div>
  `;
}

function getSpotDiffCustomization() {
  const styles = [
    "drawing",
    "anime",
    "3d-rendering",
    "geometric",
    "comic-book",
    "realistic",
  ];
  const objectsVal = appData.customization["objects-include"] || "";
  const ndVal = appData.customization["num-differences"] || "";
  return `
    <div class="art-style-grid">
      ${artStyleGrid(styles, false)}
    </div>
    <div style="display: flex; gap: 24px; margin-top: 24px;">
      <div class="form-group" style="flex: 1;">
        <label>Objects to Include</label>
        <span class="hint">This is optional</span>
        <input type="text" id="objects-include" placeholder="" value="${objectsVal}">
      </div>
      <div class="form-group" style="flex: 1;">
        <label>Number of Differences</label>
        <span class="hint">This is optional</span>
        <input type="text" id="num-differences" placeholder="" value="${ndVal}">
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <button class="btn btn-primary" onclick="saveCustomization()" style="color: #000000;">Next</button>
    </div>
  `;
}

function getHiddenObjectsCustomization() {
  const styles = [
    "drawing",
    "anime",
    "3d-rendering",
    "geometric",
    "comic-book",
    "realistic",
  ];
  const objectsVal = appData.customization["objects-include"] || "";
  return `
    <div class="art-style-grid">
      ${artStyleGrid(styles, false)}
    </div>
    <div class="form-group" style="margin-top: 24px;">
      <label>Objects to Include</label>
      <span class="hint"><em>This is optional</em></span>
      <input type="text" id="objects-include" placeholder="Enter any specific objects" value="${objectsVal}">
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
      <button class="btn btn-primary" onclick="saveCustomization()" style="color: #000000;">Next</button>
    </div>
  `;
}

function getCrosswordCustomization() {
  const diff = appData.customization["difficulty"] || "";
  const wc = appData.customization["word-count"] || "";
  const nick = appData.customization["child-nickname"] || "";
  return `
    <div class="dropdowns-grid">
      <div class="form-group">
        <label>Difficulty <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="difficulty">
          <option value="">Select...</option>
          <option value="easy" ${sel(diff, "easy")}>Easy</option>
          <option value="medium" ${sel(diff, "medium")}>Medium</option>
          <option value="hard" ${sel(diff, "hard")}>Hard</option>
        </select>
      </div>
      <div class="form-group">
        <label>Word Count <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="word-count">
          <option value="">Select...</option>
          <option value="10" ${sel(wc, "10")}>10 Words</option>
          <option value="15" ${sel(wc, "15")}>15 Words</option>
          <option value="20" ${sel(wc, "20")}>20 Words</option>
        </select>
      </div>
      <div class="form-group">
        <label>Child's Nickname <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <input type="text" id="child-nickname" placeholder="" value="${nick}">
      </div>
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function getWordsearchCustomization() {
  const diff = appData.customization["difficulty"] || "";
  const gs = appData.customization["grid-size"] || "";
  const nick = appData.customization["child-nickname"] || "";
  return `
    <div class="dropdowns-grid">
      <div class="form-group">
        <label>Difficulty <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="difficulty">
          <option value="">Select...</option>
          <option value="easy" ${sel(diff, "easy")}>Easy</option>
          <option value="medium" ${sel(diff, "medium")}>Medium</option>
          <option value="hard" ${sel(diff, "hard")}>Hard</option>
        </select>
      </div>
      <div class="form-group">
        <label>Grid Size <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="grid-size">
          <option value="">Select...</option>
          <option value="small" ${sel(gs, "small")}>Small (10x10)</option>
          <option value="medium" ${sel(gs, "medium")}>Medium (15x15)</option>
          <option value="large" ${sel(gs, "large")}>Large (20x20)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Child's Nickname <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <input type="text" id="child-nickname" placeholder="" value="${nick}">
      </div>
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function selectArtStyle(style) {
  appData.customization.artStyle = style;
  saveAppData(appData);

  document.querySelectorAll(".art-style-item").forEach((item) => {
    item.classList.remove("selected");
  });
  const selectedItem = document.querySelector(
    `.art-style-item[data-style="${style}"]`,
  );
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }
}

function selectArtStyleAndAdvance(style) {
  appData.customization.artStyle = style;
  saveAppData(appData);

  document.querySelectorAll(".art-style-item").forEach((item) => {
    item.classList.remove("selected");
  });
  const selectedItem = document.querySelector(
    `.art-style-item[data-style="${style}"]`,
  );
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }

  // Auto-advance to review after short delay
  setTimeout(() => {
    goToPage("review.html");
  }, 300);
}

function saveCustomization() {
  // Gather all customization data
  const inputs = document.querySelectorAll(
    "#customization-content input, #customization-content select",
  );
  inputs.forEach((input) => {
    if (input.id && input.value) {
      appData.customization[input.id] = input.value;
    }
  });

  saveAppData(appData);
  goToPage("review.html");
}

// ========================================
// Quick Create State Management
// ========================================
function loadQCData() {
  const stored = localStorage.getItem("playwardQCData");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return { activity: "", theme: "" };
}

function saveQCData() {
  localStorage.setItem("playwardQCData", JSON.stringify(qcData));
}

let qcData = loadQCData();

// QC activity config — 3 activities only
const qcActivityConfig = {
  coloring: { name: "Coloring Page", icon: "images/coloringpage1.png" },
  "spot-the-difference": {
    name: "Spot the Differences",
    icon: "images/spotdiff1.png",
  },
  "hidden-objects": {
    name: "Hidden Objects",
    icon: "images/hiddenobject1.png",
  },
};

// QC theme config — icons match default-themes
const qcThemeConfig = {
  superheroes: { name: "Superheroes", icon: "images/superhero.png" },
  animals: { name: "Animals", icon: "images/animal.png" },
  sports: { name: "Sports", icon: "images/sport.png" },
  space: { name: "Space", icon: "images/space.png" },
  ocean: { name: "Ocean", icon: "images/ocean.png" },
  nature: { name: "Nature", icon: "images/nature.png" },
};

// Generate QC sidebar — step 1 shows activity icon, step 2 shows activity + theme
function generateQCSidebar(step) {
  const container = document.getElementById("dynamic-sidebar");
  if (!container) return;

  let html = `<div class="sidebar-previous-label" style="text-align: center; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: calc(-0.9rem + 2px); padding: 0 6px; line-height: 1.3;">Previous<br>Choices</div>`;

  // 1. Activity — always show once selected
  const activity = qcActivityConfig[qcData.activity];
  if (activity) {
    html += `
      <div class="sidebar-item" onclick="goToPage('qc-select.html')" title="Change Activity">
        <div class="sidebar-icon-bg rectangle" style="background: none; border: none; box-shadow: none; width: 110px; height: 100px;">
          <img src="${activity.icon}" alt="${activity.name}" style="width: 100px; height: 100px; object-fit: contain;">
        </div>
        <span class="sidebar-label">${activity.name}</span>
      </div>
    `;
  }

  // 2. Theme — show at step 2 once selected
  if (step >= 2 && qcData.theme) {
    const theme = qcThemeConfig[qcData.theme];
    if (theme) {
      html += `
        <div class="sidebar-item" onclick="goToPage('qc-theme.html')" title="Change Theme">
          <div class="sidebar-icon-bg square">
            <img src="${theme.icon}" alt="${theme.name}">
          </div>
          <span class="sidebar-label">${theme.name}</span>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

// ========================================
// Input Enhancement: Placeholders + Char Counters
// ========================================

// Placeholder text keyed by input id.
// Max char limits: default 100, overrides below.
const inputConfig = {
  // custom-theme.html
  "custom-theme-input": {
    placeholder: "e.g. cars, beach, dinosaurs, space",
    max: 60,
  },
  "theme-focus-input": {
    placeholder: "e.g. the Lakers, Great Barrier Reef",
    max: 60,
  },
  "theme-character-input": {
    placeholder: "e.g. Michael Jordan, SpongeBob",
    max: 60,
  },

  // personalization.html — no text inputs (medical icons only)

  // personalization2.html
  "child-description": {
    placeholder: "e.g. loves soccer, has curly red hair",
    max: 120,
  },

  // customization.html (injected via shared.js)
  "objects-include": {
    placeholder: "e.g. ball, rocket, umbrella, dog",
    max: 100,
  },
  "num-differences": { placeholder: "e.g. 5", max: 3 },
  "child-nickname": { placeholder: "e.g. Jay, Mia, Buddy", max: 40 },

  // final.html / qc-final.html — large prompt textarea
  "generated-prompt": {
    placeholder: "Your generated prompt will appear here…",
    max: 3000,
  },
  "qc-generated-prompt": {
    placeholder: "Your generated prompt will appear here…",
    max: 3000,
  },
};

const DEFAULT_MAX = 100;

function initInputs() {
  // Covers both static inputs (already in DOM) and dynamic ones injected later
  function enhance(el) {
    if (el.dataset.pwEnhanced) return; // don't double-attach
    el.dataset.pwEnhanced = "true";

    const id = el.id || "";
    const cfg = inputConfig[id] || {};
    const max = cfg.max || DEFAULT_MAX;

    // Set placeholder if not already set or is empty
    if (cfg.placeholder && !el.getAttribute("placeholder")) {
      el.setAttribute("placeholder", cfg.placeholder);
    }

    // Skip the generated-prompt textareas — they're filled programmatically
    // and a counter there would be distracting; just set placeholder & bail.
    if (id === "generated-prompt" || id === "qc-generated-prompt") return;

    el.setAttribute("maxlength", max);

    // Build counter element
    const counter = document.createElement("span");
    counter.className = "pw-char-counter";
    counter.textContent = `0 / ${max}`;

    // Insert after the input (inside its parent .input-with-icon if present,
    // otherwise directly after the element)
    el.parentNode.insertBefore(counter, el.nextSibling);

    function update() {
      const len = el.value.length;
      counter.textContent = `${len} / ${max}`;
      counter.classList.toggle("pw-char-counter--warn", len >= max * 0.85);
      counter.classList.toggle("pw-char-counter--full", len >= max);
    }

    el.addEventListener("input", update);

    // Show on focus, hide on blur (unless there's already content)
    el.addEventListener("focus", () => {
      update();
      counter.classList.add("pw-char-counter--visible");
    });
    el.addEventListener("blur", () => {
      if (!el.value.length)
        counter.classList.remove("pw-char-counter--visible");
    });

    // If field already has a value (e.g. restored from appData), show counter
    if (el.value.length) {
      update();
      counter.classList.add("pw-char-counter--visible");
    }
  }

  // Enhance all text inputs and textareas currently in the DOM
  document.querySelectorAll("input[type='text'], textarea").forEach(enhance);

  // Watch for dynamically injected inputs (customization.html injects via innerHTML)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches("input[type='text'], textarea")) enhance(node);
        node.querySelectorAll &&
          node
            .querySelectorAll("input[type='text'], textarea")
            .forEach(enhance);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Auto-run after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInputs);
} else {
  initInputs();
}

// Generate QC breadcrumb — 2 dots with girl3/girl4 runner
function generateQCBreadcrumb(currentStep) {
  const container = document.getElementById("progress-breadcrumb");
  if (!container) return;

  const runnerImg = currentStep === 1 ? "images/girl3.png" : "images/girl4.png";
  // 2 dots: step 1 = dot index 0 = 0%, step 2 = dot index 1 = 100%
  const runnerPercent = currentStep === 1 ? 0 : 100;
  const fillWidth = currentStep === 2 ? "calc(100% - 40px)" : "0px";

  const dots = [1, 2]
    .map(
      (i) => `
    <div class="progress-dot ${i < currentStep ? "completed" : ""} ${i === currentStep ? "active" : ""}"></div>
  `,
    )
    .join("");

  container.innerHTML = `
    <div class="progress-track">
      <div class="progress-line"></div>
      <div class="progress-line-fill" style="width: ${fillWidth};"></div>
      <div class="progress-dots">${dots}</div>
      <img src="${runnerImg}" alt="Runner" class="progress-runner" style="left: calc(${runnerPercent}% + 0px);">
    </div>
  `;
}
