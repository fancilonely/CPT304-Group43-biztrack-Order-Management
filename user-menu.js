const USERS_KEY = "bizTrackUsers";
const CURRENT_USER_KEY = "bizTrackCurrentUser";

// Prototype-only local account storage. This is not secure authentication and should not be used with real passwords.

let userMenuElements = null;
let settingsElements = null;
let authElements = null;
let lastSettingsTrigger = null;
let lastAuthTrigger = null;

function getTextSafe(key) {
  return typeof window.getText === "function" ? window.getText(key) : key;
}

function getUserMenuElements() {
  if (userMenuElements) {
    return userMenuElements;
  }

  const userPanel = document.querySelector(".user-panel");
  const toggleButton = userPanel?.querySelector(".user-panel-button");
  const userMenu = userPanel?.querySelector(".user-menu");
  const authActionContainer = userPanel?.querySelector("#user-menu-auth-action");
  const sidebar = document.getElementById("sidebar");

  userMenuElements = {
    userPanel,
    toggleButton,
    userMenu,
    authActionContainer,
    sidebar,
  };

  return userMenuElements;
}

function getSettingsElements() {
  if (settingsElements) {
    return settingsElements;
  }

  const overlay = document.getElementById("settings-overlay");
  const panel = document.getElementById("settings-panel");
  const closeButton = document.getElementById("settings-close-button");
  const tabs = Array.from(document.querySelectorAll(".settings-tab"));
  const sections = Array.from(document.querySelectorAll(".settings-section"));
  const resetCookieChoiceButton = document.getElementById("settings-reset-cookie-choice");
  const clearLocalDataButton = document.getElementById("settings-clear-local-data");
  const storageFeedback = document.getElementById("settings-storage-feedback");
  const accountSettingsContent = document.getElementById("account-settings-content");
  const accountModePill = document.getElementById("settings-account-mode-pill");

  settingsElements = {
    overlay,
    panel,
    closeButton,
    tabs,
    sections,
    resetCookieChoiceButton,
    clearLocalDataButton,
    storageFeedback,
    accountSettingsContent,
    accountModePill,
  };

  return settingsElements;
}

function getAuthElements() {
  if (authElements) {
    return authElements;
  }

  const overlay = document.getElementById("auth-overlay");
  const panel = document.getElementById("auth-panel");
  const closeButton = document.getElementById("auth-close-button");
  const title = document.getElementById("auth-panel-title");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const feedback = document.getElementById("auth-feedback");
  const modeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));

  authElements = {
    overlay,
    panel,
    closeButton,
    title,
    loginForm,
    registerForm,
    feedback,
    modeButtons,
  };

  return authElements;
}

function safeParseJSON(rawValue, fallbackValue) {
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return fallbackValue;
  }
}

function getUsers() {
  const parsed = safeParseJSON(window.localStorage.getItem(USERS_KEY), []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserById(userId) {
  if (!userId) {
    return null;
  }

  return getUsers().find((user) => user.id === userId) || null;
}

function getCurrentUser() {
  const currentUserId = window.localStorage.getItem(CURRENT_USER_KEY);
  const user = findUserById(currentUserId);

  if (!user && currentUserId) {
    clearCurrentUser();
  }

  return user;
}

function setCurrentUser(user) {
  if (!user?.id) {
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, user.id);
}

function clearCurrentUser() {
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

function findUserByUsername(username) {
  const normalizedUsername = username.trim().toLowerCase();
  return getUsers().find((user) => user.username.toLowerCase() === normalizedUsername) || null;
}

function validateUsername(username) {
  return /^[A-Za-z0-9_-]{3,20}$/.test(username.trim());
}

function getAvatarInitial(user) {
  const sourceText = user?.displayName?.trim() || user?.username?.trim() || "G";
  return sourceText.charAt(0).toUpperCase();
}

function prototypeFallbackHash(password) {
  let hash = 0;

  for (let index = 0; index < password.length; index += 1) {
    hash = ((hash << 5) - hash + password.charCodeAt(index)) | 0;
  }

  return `fallback_${Math.abs(hash).toString(16)}`;
}

async function hashPassword(password) {
  if (window.crypto?.subtle && typeof TextEncoder === "function") {
    try {
      const encodedPassword = new TextEncoder().encode(password);
      const digest = await window.crypto.subtle.digest("SHA-256", encodedPassword);
      const hashBytes = Array.from(new Uint8Array(digest));
      return hashBytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
    } catch (error) {
      // Fall back to a lightweight prototype hash when Web Crypto fails.
    }
  }

  return prototypeFallbackHash(password);
}

function hideSettingsFeedback() {
  const { storageFeedback } = getSettingsElements();

  if (!storageFeedback) {
    return;
  }

  storageFeedback.hidden = true;
  storageFeedback.textContent = "";
  delete storageFeedback.dataset.messageKey;
}

function showSettingsFeedback(messageKey) {
  const { storageFeedback } = getSettingsElements();

  if (!storageFeedback) {
    return;
  }

  storageFeedback.dataset.messageKey = messageKey;
  storageFeedback.textContent = getTextSafe(messageKey);
  storageFeedback.hidden = false;
}

function clearAuthFeedback() {
  const { feedback } = getAuthElements();

  if (!feedback) {
    return;
  }

  feedback.hidden = true;
  feedback.textContent = "";
  feedback.classList.remove("is-error");
  delete feedback.dataset.messageKey;
}

function showAuthFeedback(messageKey, type = "success") {
  const { feedback } = getAuthElements();

  if (!feedback) {
    return;
  }

  feedback.dataset.messageKey = messageKey;
  feedback.textContent = getTextSafe(messageKey);
  feedback.hidden = false;
  feedback.classList.toggle("is-error", type === "error");
}

function focusActiveAuthField() {
  const { loginForm, registerForm, closeButton } = getAuthElements();
  const activeForm = getActiveAuthMode() === "register" ? registerForm : loginForm;
  const firstField = activeForm?.querySelector("input");

  if (firstField) {
    firstField.focus();
  } else if (closeButton) {
    closeButton.focus();
  }
}

function closeUserMenu(options = {}) {
  const { focusButton = false } = options;
  const { toggleButton, userMenu } = getUserMenuElements();

  if (!toggleButton || !userMenu) {
    return;
  }

  toggleButton.setAttribute("aria-expanded", "false");
  userMenu.hidden = true;

  if (focusButton) {
    toggleButton.focus();
  }
}

function openUserMenu() {
  const { toggleButton, userMenu } = getUserMenuElements();

  if (!toggleButton || !userMenu) {
    return;
  }

  toggleButton.setAttribute("aria-expanded", "true");
  userMenu.hidden = false;
}

function getFormattedCreatedAt(createdAt) {
  if (!createdAt) {
    return "";
  }

  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return createdAt;
  }

  const locale = typeof window.getCurrentLanguage === "function" && window.getCurrentLanguage() === "zh"
    ? "zh-CN"
    : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

function createTextElement(tagName, text, className = "") {
  const element = document.createElement(tagName);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

function createAccountSummaryCard(labelKey, valueText) {
  const card = document.createElement("div");
  card.className = "account-summary-card";

  const label = createTextElement("strong", getTextSafe(labelKey), "account-summary-label");
  const value = createTextElement("p", valueText, "account-summary-value");
  card.append(label, value);

  return card;
}

function renderAccountSettings() {
  const { accountSettingsContent } = getSettingsElements();

  if (!accountSettingsContent) {
    return;
  }

  const currentUser = getCurrentUser();
  accountSettingsContent.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "account-summary";

  const statusCard = document.createElement("div");
  statusCard.className = "account-summary-card";

  if (currentUser) {
    statusCard.append(
      createTextElement("strong", getTextSafe("currentUser"), "account-summary-label"),
      createTextElement("p", currentUser.displayName, "account-summary-value"),
    );

    summary.append(
      statusCard,
      createAccountSummaryCard("username", currentUser.username),
      createAccountSummaryCard("accountMode", getTextSafe("localAccount")),
      createAccountSummaryCard("createdAt", getFormattedCreatedAt(currentUser.createdAt)),
    );
  } else {
    statusCard.append(
      createTextElement("strong", getTextSafe("accountMode"), "account-summary-label"),
      createTextElement("p", getTextSafe("guestUser"), "account-summary-value"),
      createTextElement("small", getTextSafe("guestAccountStatus"), "account-summary-note"),
    );

    summary.append(
      statusCard,
      createAccountSummaryCard("localAccount", getTextSafe("notSignedIn")),
    );
  }

  const actions = document.createElement("div");
  actions.className = "account-actions";

  if (currentUser) {
    const logoutButton = createTextElement("button", getTextSafe("logout"), "account-action-button account-action-button--danger");
    logoutButton.type = "button";
    logoutButton.dataset.accountAction = "logout";
    actions.appendChild(logoutButton);
  } else {
    const loginButton = createTextElement("button", getTextSafe("login"), "account-action-button");
    loginButton.type = "button";
    loginButton.dataset.accountAction = "login";

    const registerButton = createTextElement("button", getTextSafe("createLocalAccount"), "account-action-button account-action-button--secondary");
    registerButton.type = "button";
    registerButton.dataset.accountAction = "register";

    actions.append(loginButton, registerButton);
  }

  const notice = createTextElement(
    "p",
    currentUser ? getTextSafe("localAccountNotice") : getTextSafe("guestAccountNotice"),
    "account-notice",
  );

  accountSettingsContent.append(summary, actions, notice);
}

function updateUserPanel() {
  const { userPanel } = getUserMenuElements();
  const { accountModePill } = getSettingsElements();

  if (!userPanel) {
    return;
  }

  const currentUser = getCurrentUser();
  const displayName = currentUser ? currentUser.displayName : getTextSafe("guestUser");
  const subtitle = currentUser ? getTextSafe("localAccount") : getTextSafe("localMode");
  const avatarInitial = getAvatarInitial(currentUser);

  userPanel.querySelectorAll(".user-avatar").forEach((avatar) => {
    avatar.textContent = avatarInitial;
  });

  const userName = userPanel.querySelector(".user-name");
  const userPlan = userPanel.querySelector(".user-plan");
  const profileName = userPanel.querySelector(".user-menu-profile strong");
  const profilePlan = userPanel.querySelector(".user-menu-profile small");

  if (userName) {
    userName.textContent = displayName;
  }

  if (userPlan) {
    userPlan.textContent = subtitle;
  }

  if (profileName) {
    profileName.textContent = displayName;
  }

  if (profilePlan) {
    profilePlan.textContent = subtitle;
  }

  if (accountModePill) {
    accountModePill.textContent = subtitle;
  }
}

function updateUserMenuState() {
  const { userMenu, authActionContainer } = getUserMenuElements();

  if (!userMenu || !authActionContainer) {
    return;
  }

  const currentUser = getCurrentUser();
  renderAuthAction(currentUser);
}

function renderAuthAction(currentUser) {
  const { authActionContainer } = getUserMenuElements();

  if (!authActionContainer) {
    return;
  }

  authActionContainer.replaceChildren();

  const button = document.createElement("button");
  button.type = "button";
  button.className = "user-menu-item user-menu-auth-action";
  button.setAttribute("role", "menuitem");

  const icon = document.createElement("i");
  icon.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");

  if (currentUser) {
    button.dataset.userAction = "logout";
    icon.className = "fa-solid fa-arrow-right-from-bracket";
    label.dataset.i18n = "logout";
    label.textContent = getTextSafe("logout");
  } else {
    button.dataset.userAction = "login";
    icon.className = "fa-solid fa-right-to-bracket";
    label.dataset.i18n = "login";
    label.textContent = getTextSafe("login");
  }

  button.append(icon, label);
  authActionContainer.appendChild(button);
}

function updateUserStateUI() {
  updateUserPanel();
  updateUserMenuState();
  renderAccountSettings();
}

function switchSettingsTab(tabName) {
  const { tabs, sections } = getSettingsElements();

  if (!tabs.length || !sections.length) {
    return;
  }

  const normalizedTab = ["preferences", "storage", "account"].includes(tabName)
    ? tabName
    : "preferences";

  if (normalizedTab !== "storage") {
    hideSettingsFeedback();
  }

  tabs.forEach((tab) => {
    const isActive = tab.dataset.settingsTab === normalizedTab;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  sections.forEach((section) => {
    section.classList.toggle("is-active", section.dataset.settingsSection === normalizedTab);
  });

  if (normalizedTab === "account") {
    renderAccountSettings();
  }
}

function openSettingsPanel(tabName) {
  const { overlay, panel, closeButton } = getSettingsElements();

  if (!overlay || !panel) {
    return;
  }

  lastSettingsTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  hideSettingsFeedback();
  switchSettingsTab(tabName);
  closeUserMenu();
  overlay.hidden = false;
  panel.hidden = false;
  document.body.classList.add("settings-panel-open");

  window.requestAnimationFrame(() => {
    if (closeButton) {
      closeButton.focus();
    } else {
      panel.focus();
    }
  });
}

function closeSettingsPanel(options = {}) {
  const { restoreFocus = true } = options;
  const { overlay, panel } = getSettingsElements();

  if (!overlay || !panel) {
    return;
  }

  overlay.hidden = true;
  panel.hidden = true;
  document.body.classList.remove("settings-panel-open");
  hideSettingsFeedback();

  if (restoreFocus && lastSettingsTrigger && document.contains(lastSettingsTrigger)) {
    lastSettingsTrigger.focus();
  }
}

function switchAuthMode(mode) {
  const { panel, title, loginForm, registerForm } = getAuthElements();
  const normalizedMode = mode === "register" ? "register" : "login";

  if (panel) {
    panel.dataset.authMode = normalizedMode;
  }

  if (title) {
    title.textContent = getTextSafe(normalizedMode === "register" ? "createLocalAccount" : "login");
  }

  if (loginForm) {
    loginForm.classList.toggle("is-active", normalizedMode === "login");
  }

  if (registerForm) {
    registerForm.classList.toggle("is-active", normalizedMode === "register");
  }

  clearAuthFeedback();
}

function openAuthPanel(mode) {
  const { overlay, panel, loginForm, registerForm } = getAuthElements();

  if (!overlay || !panel) {
    return;
  }

  lastAuthTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (loginForm) {
    loginForm.reset();
  }

  if (registerForm) {
    registerForm.reset();
  }

  switchAuthMode(mode);
  closeUserMenu();
  overlay.hidden = false;
  panel.hidden = false;
  document.body.classList.add("auth-panel-open");

  window.requestAnimationFrame(() => {
    focusActiveAuthField();
  });
}

function closeAuthPanel(options = {}) {
  const { restoreFocus = true } = options;
  const { overlay, panel, loginForm, registerForm } = getAuthElements();

  if (!overlay || !panel) {
    return;
  }

  overlay.hidden = true;
  panel.hidden = true;
  document.body.classList.remove("auth-panel-open");
  clearAuthFeedback();

  if (loginForm) {
    loginForm.reset();
  }

  if (registerForm) {
    registerForm.reset();
  }

  if (restoreFocus && lastAuthTrigger && document.contains(lastAuthTrigger)) {
    lastAuthTrigger.focus();
  }
}

function getActiveAuthMode() {
  return getAuthElements().panel?.dataset.authMode === "register" ? "register" : "login";
}

function handleResetCookieChoice() {
  if (typeof window.resetCookieChoice === "function") {
    window.resetCookieChoice();
  }

  showSettingsFeedback("cookieChoiceResetFromSettings");
}

function handleClearLocalBusinessData() {
  const confirmed = window.confirm(getTextSafe("confirmClearLocalBusinessData"));

  if (!confirmed) {
    return;
  }

  ["bizTrackProducts", "bizTrackOrders", "bizTrackTransactions"].forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Keep the flow resilient if storage is unavailable.
    }
  });

  showSettingsFeedback("localBusinessDataCleared");
  window.setTimeout(() => {
    window.location.reload();
  }, 700);
}

function validateAuthFields({ username, displayName, password, confirmPassword, isRegister }) {
  if (!username.trim()) {
    return "usernameRequired";
  }

  if (!validateUsername(username)) {
    return "usernameInvalid";
  }

  if (isRegister && !displayName.trim()) {
    return "displayNameRequired";
  }

  if (!password) {
    return "passwordRequired";
  }

  if (password.length < 6) {
    return "passwordTooShort";
  }

  if (isRegister && password !== confirmPassword) {
    return "passwordMismatch";
  }

  return "";
}

async function handleLogin(event) {
  event.preventDefault();

  const loginForm = event.currentTarget;
  const username = loginForm.querySelector("#login-username")?.value || "";
  const password = loginForm.querySelector("#login-password")?.value || "";
  const validationMessageKey = validateAuthFields({
    username,
    displayName: "placeholder",
    password,
    confirmPassword: password,
    isRegister: false,
  });

  if (validationMessageKey) {
    showAuthFeedback(validationMessageKey, "error");
    return;
  }

  const matchedUser = findUserByUsername(username);
  const passwordHash = await hashPassword(password);

  if (!matchedUser || matchedUser.passwordHash !== passwordHash) {
    showAuthFeedback("invalidLogin", "error");
    return;
  }

  setCurrentUser(matchedUser);
  updateUserStateUI();
  showAuthFeedback("loginSuccess");
  window.setTimeout(() => {
    closeAuthPanel();
  }, 600);
}

async function handleRegister(event) {
  event.preventDefault();

  const registerForm = event.currentTarget;
  const displayName = registerForm.querySelector("#register-display-name")?.value || "";
  const username = registerForm.querySelector("#register-username")?.value || "";
  const password = registerForm.querySelector("#register-password")?.value || "";
  const confirmPassword = registerForm.querySelector("#register-confirm-password")?.value || "";
  const validationMessageKey = validateAuthFields({
    username,
    displayName,
    password,
    confirmPassword,
    isRegister: true,
  });

  if (validationMessageKey) {
    showAuthFeedback(validationMessageKey, "error");
    return;
  }

  if (findUserByUsername(username)) {
    showAuthFeedback("usernameTaken", "error");
    return;
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    username: username.trim(),
    displayName: displayName.trim().slice(0, 40),
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  updateUserStateUI();
  showAuthFeedback("registerSuccess");
  window.setTimeout(() => {
    closeAuthPanel();
  }, 600);
}

function logoutCurrentUser() {
  clearCurrentUser();
  updateUserStateUI();
  closeUserMenu();
}

function bindAuthPanel() {
  const { overlay, panel, closeButton, loginForm, registerForm, modeButtons } = getAuthElements();

  if (!overlay || !panel || panel.dataset.bound === "true") {
    return;
  }

  overlay.addEventListener("click", () => {
    closeAuthPanel();
  });

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeAuthPanel();
    });
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchAuthMode(button.dataset.authMode);
      window.requestAnimationFrame(() => {
        focusActiveAuthField();
      });
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  panel.dataset.bound = "true";
}

function bindSettingsPanel() {
  const {
    overlay,
    panel,
    closeButton,
    tabs,
    resetCookieChoiceButton,
    clearLocalDataButton,
    accountSettingsContent,
  } = getSettingsElements();

  if (!overlay || !panel || panel.dataset.bound === "true") {
    return;
  }

  overlay.addEventListener("click", () => {
    closeSettingsPanel();
  });

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeSettingsPanel();
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchSettingsTab(tab.dataset.settingsTab);
      tab.focus();
    });
  });

  if (resetCookieChoiceButton) {
    resetCookieChoiceButton.addEventListener("click", handleResetCookieChoice);
  }

  if (clearLocalDataButton) {
    clearLocalDataButton.addEventListener("click", handleClearLocalBusinessData);
  }

  if (accountSettingsContent) {
    accountSettingsContent.addEventListener("click", (event) => {
      const accountActionButton = event.target.closest("[data-account-action]");

      if (!accountActionButton) {
        return;
      }

      const action = accountActionButton.dataset.accountAction;

      if (action === "login") {
        openAuthPanel("login");
      } else if (action === "register") {
        openAuthPanel("register");
      } else if (action === "logout") {
        logoutCurrentUser();
      }
    });
  }

  panel.dataset.bound = "true";
}

function bindUserMenu() {
  const { userPanel, toggleButton, userMenu, sidebar } = getUserMenuElements();

  if (!userPanel || !toggleButton || !userMenu || toggleButton.dataset.bound === "true") {
    return;
  }

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (toggleButton.getAttribute("aria-expanded") === "true") {
      closeUserMenu();
    } else {
      openUserMenu();
    }
  });

  userMenu.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-user-action]");

    if (actionButton) {
      event.preventDefault();
      const action = actionButton.getAttribute("data-user-action");

      if (action === "login") {
        openAuthPanel("login");
      } else if (action === "logout") {
        logoutCurrentUser();
      } else if (action === "account") {
        if (getCurrentUser()) {
          openSettingsPanel("account");
        } else {
          openAuthPanel("login");
        }
      } else if (action === "storage") {
        openSettingsPanel("storage");
      } else {
        openSettingsPanel("preferences");
      }

      return;
    }

    const clickedItem = event.target.closest(".user-menu-item");
    if (clickedItem && !clickedItem.hasAttribute("disabled")) {
      closeUserMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!userPanel.contains(event.target)) {
      closeUserMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const authPanel = getAuthElements().panel;
    const settingsPanel = getSettingsElements().panel;

    if (authPanel && !authPanel.hidden) {
      closeAuthPanel();
      return;
    }

    if (settingsPanel && !settingsPanel.hidden) {
      closeSettingsPanel();
      return;
    }

    if (toggleButton.getAttribute("aria-expanded") === "true") {
      closeUserMenu({ focusButton: true });
    }
  });

  const sidebarObserver = new MutationObserver(() => {
    if (document.body.classList.contains("sidebar-collapsed")) {
      closeUserMenu();
    }

    if (sidebar && !sidebar.classList.contains("is-open") && window.matchMedia("(max-width: 768px)").matches) {
      closeUserMenu();
    }
  });

  sidebarObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  if (sidebar) {
    sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ["class"] });
  }

  toggleButton.dataset.bound = "true";
}

function refreshVisibleFeedbackTranslations() {
  const { storageFeedback } = getSettingsElements();
  const { feedback, title } = getAuthElements();

  if (storageFeedback && !storageFeedback.hidden && storageFeedback.dataset.messageKey) {
    storageFeedback.textContent = getTextSafe(storageFeedback.dataset.messageKey);
  }

  if (feedback && !feedback.hidden && feedback.dataset.messageKey) {
    feedback.textContent = getTextSafe(feedback.dataset.messageKey);
  }

  if (title) {
    title.textContent = getTextSafe(getActiveAuthMode() === "register" ? "createLocalAccount" : "login");
  }
}

function initializeUserMenu() {
  bindSettingsPanel();
  bindAuthPanel();
  bindUserMenu();
  updateUserStateUI();
  refreshVisibleFeedbackTranslations();
}

window.openSettingsPanel = openSettingsPanel;
window.closeSettingsPanel = closeSettingsPanel;
window.switchSettingsTab = switchSettingsTab;
window.bindSettingsPanel = bindSettingsPanel;
window.bindUserMenu = bindUserMenu;
window.openAuthPanel = openAuthPanel;
window.closeAuthPanel = closeAuthPanel;

document.addEventListener("languageChanged", () => {
  updateUserStateUI();
  refreshVisibleFeedbackTranslations();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUserMenu);
} else {
  initializeUserMenu();
}
