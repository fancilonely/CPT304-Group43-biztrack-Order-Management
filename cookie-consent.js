(function () {
  const STORAGE_KEY = "biztrack_cookie_consent";
  const CONSENT_VERSION = "1.0";

  function getCookieText(key, fallback) {
    if (typeof getText === "function") {
      return getText(key);
    }
    return fallback;
  }

  function getSavedConsent() {
    try {
      const savedConsent = localStorage.getItem(STORAGE_KEY);
      return savedConsent ? JSON.parse(savedConsent) : null;
    } catch (error) {
      return null;
    }
  }

  function hasValidSavedConsent() {
    const savedConsent = getSavedConsent();
    return savedConsent && savedConsent.version === CONSENT_VERSION;
  }

  function getFallbackText() {
    return {
      cookieBannerTitle: "Your privacy matters",
      cookieBannerText:
        "We use cookies and local storage to improve your experience, remember your preferences, and understand how BizTrack is used. You can accept all cookies, reject non-essential cookies, or manage your privacy choices.",
      cookieRejectAll: "Reject All",
      cookieManagePreferences: "Privacy Management",
      cookieAcceptAll: "Accept All",
      cookiePrivacyLink: "Privacy Policy",

      cookiePreferencesTitle: "Privacy Management",
      cookiePreferencesText:
        "Choose which types of cookies or local storage BizTrack can use. Necessary storage is required for the website to work and cannot be disabled.",
      cookieNecessaryTitle: "Necessary Storage",
      cookieNecessaryText:
        "Required for core features such as page navigation, language support, and basic security.",
      cookieAlwaysOn: "Always On",
      cookiePreferenceTitle: "Preference Storage",
      cookiePreferenceText:
        "Remember choices such as language and interface preferences.",
      cookieAnalyticsTitle: "Analytics Cookies",
      cookieAnalyticsText:
        "Help us understand how the system is used so we can improve the experience.",
      cookieSavePreferences: "Save Preferences",
      cookieClosePreferences: "Close privacy management",
      cookieSettingsButton: "Privacy Management",

      privacyPolicyTitle: "Privacy Policy",
      privacyPolicyIntro:
        "BizTrack is a small business management prototype for managing products, orders, and expenses. This policy explains how this prototype uses local data, cookies, and browser storage.",
      privacyPolicyDataTitle: "Information we may use",
      privacyPolicyDataText:
        "BizTrack may use information entered by users, such as product records, order details, expense information, and interface preferences. This coursework prototype is not intended for storing sensitive or confidential business data.",
      privacyPolicyCookiesTitle: "Cookies and local storage",
      privacyPolicyCookiesText:
        "BizTrack uses browser local storage to remember language preferences and privacy choices. Optional analytics cookies are only enabled if the user agrees.",
      privacyPolicyChoicesTitle: "Your choices",
      privacyPolicyChoicesText:
        "You can accept all cookies, reject non-essential cookies, or customise your privacy preferences. You can reopen Privacy Management at any time from the bottom-right button.",
      privacyPolicySecurityTitle: "Security notice",
      privacyPolicySecurityText:
        "BizTrack follows reasonable prototype design practices, but this version is for educational demonstration and should not be treated as a production legal or security solution.",
      privacyPolicyClose: "Close privacy policy"
    };
  }

  function applyCookieTranslations() {
    const fallbackText = getFallbackText();

    document.querySelectorAll("[data-cookie-i18n]").forEach((element) => {
      const key = element.getAttribute("data-cookie-i18n");
      element.textContent = getCookieText(key, fallbackText[key] || key);
    });

    document.querySelectorAll("[data-cookie-i18n-aria-label]").forEach((element) => {
      const key = element.getAttribute("data-cookie-i18n-aria-label");
      element.setAttribute("aria-label", getCookieText(key, fallbackText[key] || key));
    });

    const banner = document.getElementById("cookie-consent-banner");
    if (banner) {
      banner.setAttribute(
        "aria-label",
        getCookieText("cookieBannerTitle", fallbackText.cookieBannerTitle)
      );
    }

    const preferencesModal = document.getElementById("cookie-preferences-modal");
    if (preferencesModal) {
      preferencesModal.setAttribute(
        "aria-label",
        getCookieText("cookiePreferencesTitle", fallbackText.cookiePreferencesTitle)
      );
    }

    const policyModal = document.getElementById("privacy-policy-modal");
    if (policyModal) {
      policyModal.setAttribute(
        "aria-label",
        getCookieText("privacyPolicyTitle", fallbackText.privacyPolicyTitle)
      );
    }
  }

  function saveConsent(choice, options) {
    const consent = {
      necessary: true,
      preferences: options ? Boolean(options.preferences) : choice === "accept_all",
      analytics: options ? Boolean(options.analytics) : choice === "accept_all",
      choice: choice,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      console.warn("Privacy choices could not be saved.", error);
    }

    closePreferencesModal();
    closePrivacyPolicyModal();
    removeFullPrivacyBanner();
    createPrivacyManagementButton();
  }

  function removeFullPrivacyBanner() {
    const banner = document.getElementById("cookie-consent-banner");
    if (banner) {
      banner.remove();
    }
  }

  function removePrivacyManagementButton() {
    const button = document.getElementById("privacy-management-button");
    if (button) {
      button.remove();
    }
  }

  function createFullPrivacyBanner(forceShow) {
    if (hasValidSavedConsent() && !forceShow) {
      createPrivacyManagementButton();
      return;
    }

    if (document.getElementById("cookie-consent-banner")) {
      applyCookieTranslations();
      return;
    }

    removePrivacyManagementButton();

    const banner = document.createElement("section");
    banner.id = "cookie-consent-banner";
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-modal", "false");

    banner.innerHTML = `
      <div class="cookie-consent__text">
        <h2 data-cookie-i18n="cookieBannerTitle">Your privacy matters</h2>
        <p data-cookie-i18n="cookieBannerText">
          We use cookies and local storage to improve your experience, remember your preferences,
          and understand how BizTrack is used. You can accept all cookies, reject non-essential
          cookies, or manage your privacy choices.
        </p>
        <button type="button" class="cookie-consent__link-button" id="open-privacy-policy" data-cookie-i18n="cookiePrivacyLink">
          Privacy Policy
        </button>
      </div>

      <div class="cookie-consent__actions">
        <button type="button" class="cookie-btn cookie-btn--secondary" id="cookie-reject-all" data-cookie-i18n="cookieRejectAll">
          Reject All
        </button>
        <button type="button" class="cookie-btn cookie-btn--outline" id="cookie-manage-preferences" data-cookie-i18n="cookieManagePreferences">
          Privacy Management
        </button>
        <button type="button" class="cookie-btn cookie-btn--primary" id="cookie-accept-all" data-cookie-i18n="cookieAcceptAll">
          Accept All
        </button>
      </div>
    `;

    document.body.appendChild(banner);
    applyCookieTranslations();

    document.getElementById("cookie-accept-all").addEventListener("click", function () {
      saveConsent("accept_all");
    });

    document.getElementById("cookie-reject-all").addEventListener("click", function () {
      saveConsent("reject_all", {
        preferences: false,
        analytics: false
      });
    });

    document.getElementById("cookie-manage-preferences").addEventListener("click", function () {
      openPreferencesModal();
    });

    document.getElementById("open-privacy-policy").addEventListener("click", function () {
      openPrivacyPolicyModal();
    });
  }

  function createPrivacyManagementButton() {
    if (!hasValidSavedConsent()) {
      return;
    }

    if (document.getElementById("cookie-consent-banner")) {
      return;
    }

    if (document.getElementById("privacy-management-button")) {
      applyCookieTranslations();
      return;
    }

    const fallbackText = getFallbackText();

    const button = document.createElement("button");
    button.id = "privacy-management-button";
    button.className = "privacy-management-button";
    button.type = "button";
    button.setAttribute("data-cookie-i18n", "cookieSettingsButton");
    button.textContent = getCookieText("cookieSettingsButton", fallbackText.cookieSettingsButton);

    button.addEventListener("click", function () {
      createFullPrivacyBanner(true);
    });

    document.body.appendChild(button);
    applyCookieTranslations();
  }

  function createPreferencesModal() {
    if (document.getElementById("cookie-preferences-modal")) {
      return;
    }

    const savedConsent = getSavedConsent();

    const preferencesChecked =
      savedConsent && typeof savedConsent.preferences === "boolean"
        ? savedConsent.preferences
        : false;

    const analyticsChecked =
      savedConsent && typeof savedConsent.analytics === "boolean"
        ? savedConsent.analytics
        : false;

    const modal = document.createElement("div");
    modal.id = "cookie-preferences-modal";
    modal.className = "cookie-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="cookie-modal__backdrop" data-cookie-close-preferences="true"></div>

      <div class="cookie-modal__panel">
        <div class="cookie-modal__header">
          <div>
            <h2 data-cookie-i18n="cookiePreferencesTitle">Privacy Management</h2>
            <p data-cookie-i18n="cookiePreferencesText">
              Choose which types of cookies or local storage BizTrack can use. Necessary storage is required for the website to work and cannot be disabled.
            </p>
          </div>

          <button
            type="button"
            class="cookie-modal__close"
            id="cookie-close-preferences"
            data-cookie-i18n-aria-label="cookieClosePreferences"
            aria-label="Close privacy management"
          >
            ×
          </button>
        </div>

        <div class="cookie-modal__body">
          <section class="cookie-category">
            <div>
              <h3 data-cookie-i18n="cookieNecessaryTitle">Necessary Storage</h3>
              <p data-cookie-i18n="cookieNecessaryText">
                Required for core features such as page navigation, language support, and basic security.
              </p>
            </div>
            <span class="cookie-status" data-cookie-i18n="cookieAlwaysOn">Always On</span>
          </section>

          <section class="cookie-category">
            <div>
              <h3 data-cookie-i18n="cookiePreferenceTitle">Preference Storage</h3>
              <p data-cookie-i18n="cookiePreferenceText">
                Remember choices such as language and interface preferences.
              </p>
            </div>

            <label class="cookie-switch">
              <input type="checkbox" id="cookie-preferences-toggle" ${preferencesChecked ? "checked" : ""}>
              <span class="cookie-switch__slider"></span>
            </label>
          </section>

          <section class="cookie-category">
            <div>
              <h3 data-cookie-i18n="cookieAnalyticsTitle">Analytics Cookies</h3>
              <p data-cookie-i18n="cookieAnalyticsText">
                Help us understand how the system is used so we can improve the experience.
              </p>
            </div>

            <label class="cookie-switch">
              <input type="checkbox" id="cookie-analytics-toggle" ${analyticsChecked ? "checked" : ""}>
              <span class="cookie-switch__slider"></span>
            </label>
          </section>
        </div>

        <div class="cookie-modal__actions">
          <button type="button" class="cookie-btn cookie-btn--secondary" id="cookie-modal-reject-all" data-cookie-i18n="cookieRejectAll">
            Reject All
          </button>
          <button type="button" class="cookie-btn cookie-btn--outline" id="cookie-save-preferences" data-cookie-i18n="cookieSavePreferences">
            Save Preferences
          </button>
          <button type="button" class="cookie-btn cookie-btn--primary" id="cookie-modal-accept-all" data-cookie-i18n="cookieAcceptAll">
            Accept All
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    applyCookieTranslations();

    document.getElementById("cookie-close-preferences").addEventListener("click", closePreferencesModal);

    document.getElementById("cookie-modal-reject-all").addEventListener("click", function () {
      saveConsent("reject_all", {
        preferences: false,
        analytics: false
      });
    });

    document.getElementById("cookie-modal-accept-all").addEventListener("click", function () {
      saveConsent("accept_all", {
        preferences: true,
        analytics: true
      });
    });

    document.getElementById("cookie-save-preferences").addEventListener("click", function () {
      const preferences = document.getElementById("cookie-preferences-toggle").checked;
      const analytics = document.getElementById("cookie-analytics-toggle").checked;

      saveConsent("custom", {
        preferences: preferences,
        analytics: analytics
      });
    });

    modal.querySelectorAll("[data-cookie-close-preferences='true']").forEach((element) => {
      element.addEventListener("click", closePreferencesModal);
    });
  }

  function openPreferencesModal() {
    createPreferencesModal();

    const modal = document.getElementById("cookie-preferences-modal");
    if (modal) {
      modal.classList.add("is-visible");
      document.body.classList.add("cookie-modal-open");

      const closeButton = document.getElementById("cookie-close-preferences");
      if (closeButton) {
        closeButton.focus();
      }
    }
  }

  function closePreferencesModal() {
    const modal = document.getElementById("cookie-preferences-modal");
    if (modal) {
      modal.classList.remove("is-visible");
    }

    document.body.classList.remove("cookie-modal-open");
  }

  function createPrivacyPolicyModal() {
    if (document.getElementById("privacy-policy-modal")) {
      return;
    }

    const modal = document.createElement("div");
    modal.id = "privacy-policy-modal";
    modal.className = "cookie-modal privacy-policy-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="cookie-modal__backdrop" data-privacy-policy-close="true"></div>

      <div class="cookie-modal__panel privacy-policy-panel">
        <div class="cookie-modal__header">
          <div>
            <h2 data-cookie-i18n="privacyPolicyTitle">Privacy Policy</h2>
            <p data-cookie-i18n="privacyPolicyIntro">
              BizTrack is a small business management prototype for managing products, orders, and expenses.
              This policy explains how this prototype uses local data, cookies, and browser storage.
            </p>
          </div>

          <button
            type="button"
            class="cookie-modal__close"
            id="privacy-policy-close"
            data-cookie-i18n-aria-label="privacyPolicyClose"
            aria-label="Close privacy policy"
          >
            ×
          </button>
        </div>

        <div class="privacy-policy-content">
          <section>
            <h3 data-cookie-i18n="privacyPolicyDataTitle">Information we may use</h3>
            <p data-cookie-i18n="privacyPolicyDataText">
              BizTrack may use information entered by users, such as product records, order details, expense information,
              and interface preferences. This coursework prototype is not intended for storing sensitive or confidential business data.
            </p>
          </section>

          <section>
            <h3 data-cookie-i18n="privacyPolicyCookiesTitle">Cookies and local storage</h3>
            <p data-cookie-i18n="privacyPolicyCookiesText">
              BizTrack uses browser local storage to remember language preferences and privacy choices.
              Optional analytics cookies are only enabled if the user agrees.
            </p>
          </section>

          <section>
            <h3 data-cookie-i18n="privacyPolicyChoicesTitle">Your choices</h3>
            <p data-cookie-i18n="privacyPolicyChoicesText">
              You can accept all cookies, reject non-essential cookies, or customise your privacy preferences.
              You can reopen Privacy Management at any time from the bottom-right button.
            </p>
          </section>

          <section>
            <h3 data-cookie-i18n="privacyPolicySecurityTitle">Security notice</h3>
            <p data-cookie-i18n="privacyPolicySecurityText">
              BizTrack follows reasonable prototype design practices, but this version is for educational demonstration
              and should not be treated as a production legal or security solution.
            </p>
          </section>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    applyCookieTranslations();

    document.getElementById("privacy-policy-close").addEventListener("click", closePrivacyPolicyModal);

    modal.querySelectorAll("[data-privacy-policy-close='true']").forEach((element) => {
      element.addEventListener("click", closePrivacyPolicyModal);
    });
  }

  function openPrivacyPolicyModal() {
    createPrivacyPolicyModal();

    const modal = document.getElementById("privacy-policy-modal");
    if (modal) {
      modal.classList.add("is-visible");
      document.body.classList.add("cookie-modal-open");

      const closeButton = document.getElementById("privacy-policy-close");
      if (closeButton) {
        closeButton.focus();
      }
    }
  }

  function closePrivacyPolicyModal() {
    const modal = document.getElementById("privacy-policy-modal");
    if (modal) {
      modal.classList.remove("is-visible");
    }

    document.body.classList.remove("cookie-modal-open");
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePreferencesModal();
      closePrivacyPolicyModal();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    createFullPrivacyBanner(false);
  });

  document.addEventListener("languageChanged", applyCookieTranslations);

  window.openCookiePreferences = openPreferencesModal;
  window.openPrivacyPolicy = openPrivacyPolicyModal;
})();