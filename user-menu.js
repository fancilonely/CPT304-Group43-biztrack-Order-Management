const THEME_STORAGE_KEY = "bizTrackTheme";
const SETTINGS_AVATAR_LETTER = "S";

let userMenuElements = null;
let settingsElements = null;
let lastSettingsTrigger = null;

function getTextSafe(key) {
  return typeof window.getText === "function" ? window.getText(key) : key;
}

function getSettingsOverlayTemplate() {
  return '<div class="settings-overlay" id="settings-overlay" hidden></div>';
}

function getSettingsPanelTemplate() {
  return `
    <section class="settings-panel" id="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-panel-title" tabindex="-1" hidden>
      <div class="settings-shell">
        <aside class="settings-tabs" aria-label="Settings sections">
          <button type="button" class="settings-tab is-active" data-settings-tab="preferences">
            <i class="fa-solid fa-sliders" aria-hidden="true"></i>
            <span data-i18n="preferences">Preferences</span>
          </button>
          <button type="button" class="settings-tab" data-settings-tab="storage">
            <i class="fa-solid fa-database" aria-hidden="true"></i>
            <span data-i18n="dataStorage">Data &amp; Storage</span>
          </button>
          <button type="button" class="settings-tab" data-settings-tab="privacy">
            <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
            <span data-i18n="privacyPolicy">Privacy Policy</span>
          </button>
        </aside>

        <div class="settings-content">
          <div class="settings-panel-header">
            <h2 id="settings-panel-title" data-i18n="settingsCenter">Settings Center</h2>
            <button type="button" class="settings-close-button" id="settings-close-button" aria-label="Close settings" data-i18n-aria-label="closeSettings">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <section class="settings-section is-active" data-settings-section="preferences">
            <h3 data-i18n="preferences">Preferences</h3>
            <p data-i18n="preferencesDesc">Customize basic interface preferences for this browser.</p>

            <div class="settings-row">
              <div>
                <strong data-i18n="languagePreference">Language Preference</strong>
                <p data-i18n="languagePreferenceDesc">Choose the interface language for this browser.</p>
              </div>
              <button type="button" class="settings-segmented-control" data-segmented="language" data-active="left" role="switch" aria-checked="false" aria-label="Language preference" data-i18n-aria-label="languagePreference">
                <span class="segmented-slider" aria-hidden="true"></span>
                <span class="settings-segment-button" data-language-choice="en" aria-hidden="true">EN</span>
                <span class="settings-segment-button" data-language-choice="zh" aria-hidden="true">CN</span>
              </button>
            </div>

            <div class="settings-row">
              <div>
                <strong data-i18n="themePreference">Theme</strong>
                <p data-i18n="themePreferenceDesc">Choose a light or dark BizTrack interface theme.</p>
              </div>
              <button type="button" class="settings-segmented-control" data-segmented="theme" data-active="right" role="switch" aria-checked="true" aria-label="Theme preference" data-i18n-aria-label="themePreference">
                <span class="segmented-slider" aria-hidden="true"></span>
                <span class="settings-segment-button" data-theme-choice="light" data-i18n="lightTheme" aria-hidden="true">Light</span>
                <span class="settings-segment-button" data-theme-choice="dark" data-i18n="darkTheme" aria-hidden="true">Dark</span>
              </button>
            </div>

            <div class="settings-row">
              <div>
                <strong data-i18n="storageMode">Storage Mode</strong>
                <p data-i18n="browserStorageDesc">Business data is stored in this browser.</p>
              </div>
              <span class="settings-pill" data-i18n="browserStorage">Browser Storage</span>
            </div>
          </section>

          <section class="settings-section" data-settings-section="storage">
            <h3 data-i18n="dataStorage">Data &amp; Storage</h3>
            <p data-i18n="dataStorageDesc">Manage BizTrack data stored in this browser.</p>

            <div class="settings-row">
              <div>
                <strong data-i18n="browserStorage">Browser Storage</strong>
                <p data-i18n="storedDataDesc">Products, inventory, orders, expenses, language preference, theme preference, and cookie choice are stored in this browser.</p>
              </div>
              <span class="settings-pill" data-i18n="enabled">Enabled</span>
            </div>

            <div class="settings-row settings-row--action">
              <div>
                <strong data-i18n="cookieChoice">Cookie Choice</strong>
                <p data-i18n="cookieChoiceDesc">Reset cookie choice.</p>
              </div>
              <button type="button" class="settings-inline-button" id="settings-reset-cookie-choice">
                <i class="fa-solid fa-cookie-bite" aria-hidden="true"></i>
                <span data-i18n="resetCookieChoiceShort">Reset</span>
              </button>
            </div>

            <div class="settings-row settings-row--action">
              <div>
                <strong data-i18n="clearBusinessData">Clear Business Data</strong>
                <p data-i18n="clearBusinessDataDesc">Clear saved products, inventory, orders, and expenses from this browser.</p>
              </div>
              <button type="button" class="settings-inline-button settings-inline-button--danger" id="settings-clear-business-data">
                <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                <span data-i18n="clearBusinessData">Clear Business Data</span>
              </button>
            </div>

            <p class="settings-feedback" id="settings-storage-feedback" hidden></p>
          </section>

          <section class="settings-section" data-settings-section="privacy">
            <h3 data-i18n="privacyPolicy">Privacy Policy</h3>
            <p data-i18n="privacySettingsIntro">This section explains how BizTrack handles browser-stored data in this coursework prototype.</p>

            <div class="settings-info-block">
              <h4 data-i18n="privacyStoredInfoTitle">What BizTrack stores</h4>
              <p data-i18n="privacyStoredInfoDesc">BizTrack stores products, inventory, orders, expenses, language preference, theme preference, and cookie choice.</p>
            </div>

            <div class="settings-info-block">
              <h4 data-i18n="privacyStorageLocationTitle">Where data is stored</h4>
              <p data-i18n="privacyStorageLocationDesc">Data is stored in this browser through localStorage. It is not synchronized to a cloud account or backend database.</p>
            </div>

            <div class="settings-info-block">
              <h4 data-i18n="privacyCookieTitle">Cookie and preference choices</h4>
              <p data-i18n="privacyCookieDesc">BizTrack uses browser storage to remember cookie consent and interface preferences. You can reset cookie choice in Data &amp; Storage.</p>
            </div>

            <div class="settings-info-block">
              <h4 data-i18n="privacySafetyTitle">Security note</h4>
              <p data-i18n="privacySafetyDesc">Because this is a frontend coursework prototype, browser-stored data should not be treated as secure cloud storage.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  `;
}

function ensureSharedPanels() {
  if (!document.getElementById("settings-overlay")) {
    document.body.insertAdjacentHTML("beforeend", getSettingsOverlayTemplate());
  }

  if (!document.getElementById("settings-panel")) {
    document.body.insertAdjacentHTML("beforeend", getSettingsPanelTemplate());
  }

  settingsElements = null;
}

function getUserMenuElements() {
  if (userMenuElements) {
    return userMenuElements;
  }

  const userPanel = document.querySelector(".user-panel");
  const toggleButton = userPanel?.querySelector(".user-panel-button");
  const userMenu = userPanel?.querySelector(".user-menu");
  const sidebar = document.getElementById("sidebar");

  userMenuElements = {
    userPanel,
    toggleButton,
    userMenu,
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
  const clearBusinessDataButton = document.getElementById("settings-clear-business-data");
  const storageFeedback = document.getElementById("settings-storage-feedback");
  const languageButtons = Array.from(document.querySelectorAll("[data-language-choice]"));
  const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const languageControls = Array.from(document.querySelectorAll("[data-segmented='language']"));
  const themeControls = Array.from(document.querySelectorAll("[data-segmented='theme']"));

  settingsElements = {
    overlay,
    panel,
    closeButton,
    tabs,
    sections,
    resetCookieChoiceButton,
    clearBusinessDataButton,
    storageFeedback,
    languageButtons,
    themeButtons,
    languageControls,
    themeControls,
  };

  return settingsElements;
}

function normalizePrivacyMenuItems() {
  document.querySelectorAll('.user-menu-item[data-user-action="privacy"], .user-menu-item[href$="privacy.html"]').forEach((item) => {
    item.dataset.userAction = "privacy";
    if (item.tagName === "A") {
      item.removeAttribute("href");
    }

    const label = item.querySelector("[data-i18n]");
    if (label) {
      label.dataset.i18n = "privacyPolicy";
      label.textContent = getTextSafe("privacyPolicy");
    }
  });
}

function getCurrentTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
}

function applyTheme(theme, { persist = false } = {}) {
  const normalizedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = normalizedTheme;

  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, normalizedTheme);
  }

  updatePreferenceControls();
  document.dispatchEvent(
    new CustomEvent("themeChanged", {
      detail: { theme: normalizedTheme },
    }),
  );
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

function setSettingsBadges() {
  document.querySelectorAll(".user-avatar").forEach((avatar) => {
    avatar.textContent = SETTINGS_AVATAR_LETTER;
  });
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

function updatePreferenceControls() {
  const { languageButtons, themeButtons, languageControls, themeControls } = getSettingsElements();
  const currentLanguage = typeof window.getCurrentLanguage === "function" ? window.getCurrentLanguage() : "en";
  const currentTheme = getCurrentTheme();

  languageControls.forEach((control) => {
    control.dataset.active = currentLanguage === "zh" ? "right" : "left";
    control.setAttribute("aria-checked", currentLanguage === "zh" ? "true" : "false");
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.languageChoice === currentLanguage;
    button.classList.toggle("is-active", isActive);
  });

  themeControls.forEach((control) => {
    control.dataset.active = currentTheme === "light" ? "left" : "right";
    control.setAttribute("aria-checked", currentTheme === "dark" ? "true" : "false");
  });

  themeButtons.forEach((button) => {
    const isActive = button.dataset.themeChoice === currentTheme;
    button.classList.toggle("is-active", isActive);
  });
}

function bindPreferenceControls() {
  const { panel, languageControls, themeControls } = getSettingsElements();

  if (!panel || panel.dataset.preferencesBound === "true") {
    return;
  }

  languageControls.forEach((control) => {
    control.addEventListener("click", () => {
      if (typeof window.setLanguage === "function") {
        const currentLanguage = typeof window.getCurrentLanguage === "function" ? window.getCurrentLanguage() : "en";
        window.setLanguage(currentLanguage === "en" ? "zh" : "en");
      }
    });
  });

  themeControls.forEach((control) => {
    control.addEventListener("click", () => {
      const currentTheme = getCurrentTheme();
      applyTheme(currentTheme === "dark" ? "light" : "dark", { persist: true });
    });
  });

  panel.dataset.preferencesBound = "true";
}

function switchSettingsTab(tabName) {
  const { tabs, sections } = getSettingsElements();

  if (!tabs.length || !sections.length) {
    return;
  }

  const normalizedTab = ["preferences", "storage", "privacy"].includes(tabName) ? tabName : "preferences";

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

function openBizTrackSettings(tab = "preferences") {
  openSettingsPanel(tab);
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

function handleResetCookieChoice() {
  if (typeof window.resetCookieChoice === "function") {
    window.resetCookieChoice();
  }

  showSettingsFeedback("cookieChoiceResetFromSettings");
}

function handleClearBusinessData() {
  const confirmed = window.confirm(getTextSafe("confirmClearBusinessData"));

  if (!confirmed) {
    return;
  }

  ["bizTrackProducts", "bizTrackInventory", "bizTrackOrders", "bizTrackTransactions"].forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // Keep the flow resilient if storage is unavailable.
    }
  });

  showSettingsFeedback("businessDataCleared");
  window.setTimeout(() => {
    window.location.reload();
  }, 700);
}

function bindSettingsPanel() {
  const {
    overlay,
    panel,
    closeButton,
    tabs,
    resetCookieChoiceButton,
    clearBusinessDataButton,
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

  if (clearBusinessDataButton) {
    clearBusinessDataButton.addEventListener("click", handleClearBusinessData);
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
      openSettingsPanel(actionButton.getAttribute("data-user-action"));
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

    const settingsPanel = getSettingsElements().panel;

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

function bindSettingsTriggers() {
  if (document.body.dataset.settingsTriggersBound === "true") {
    return;
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-settings-tab]");
    if (!trigger) {
      return;
    }

    event.preventDefault();
    openBizTrackSettings(trigger.getAttribute("data-open-settings-tab"));
  });

  document.body.dataset.settingsTriggersBound = "true";
}

function refreshVisibleFeedbackTranslations() {
  const { storageFeedback } = getSettingsElements();

  if (storageFeedback && !storageFeedback.hidden && storageFeedback.dataset.messageKey) {
    storageFeedback.textContent = getTextSafe(storageFeedback.dataset.messageKey);
  }
}

function initializeUserMenu() {
  ensureSharedPanels();
  normalizePrivacyMenuItems();
  setSettingsBadges();
  bindPreferenceControls();
  bindSettingsPanel();
  bindUserMenu();
  bindSettingsTriggers();
  applyTheme(getCurrentTheme(), { persist: false });

  if (typeof window.applyLanguage === "function" && typeof window.getCurrentLanguage === "function") {
    window.applyLanguage(window.getCurrentLanguage(), { persist: false, dispatchEvent: false });
  }

  refreshVisibleFeedbackTranslations();
}

window.openSettingsPanel = openSettingsPanel;
window.openBizTrackSettings = openBizTrackSettings;
window.closeSettingsPanel = closeSettingsPanel;
window.switchSettingsTab = switchSettingsTab;
window.bindSettingsPanel = bindSettingsPanel;
window.bindUserMenu = bindUserMenu;
window.applyTheme = applyTheme;

document.addEventListener("languageChanged", () => {
  setSettingsBadges();
  updatePreferenceControls();
  refreshVisibleFeedbackTranslations();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUserMenu);
} else {
  initializeUserMenu();
}
