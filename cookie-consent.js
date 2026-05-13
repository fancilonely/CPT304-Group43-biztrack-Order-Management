(function () {
  const STORAGE_KEY = "biztrack_cookie_consent";
  const CONSENT_VERSION = "1.0";
  const PRIVACY_PAGE_URL = "./privacy.html";

  const fallbackText = {
    cookieBannerTitle: "Your privacy matters",
    cookieBannerText:
      "BizTrack uses local storage to remember your language, cookie choice, and locally saved business data.",
    cookieAccept: "Accept",
    cookieReject: "Reject",
    cookiePrivacyPolicy: "Privacy Policy",
    privacyChoiceResetMessage: "Cookie choice has been reset. The banner will appear again.",
  };

  function getConsentText(key) {
    if (typeof window.getText === "function") {
      return window.getText(key);
    }

    return fallbackText[key] || key;
  }

  function getSavedConsent() {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      return rawValue ? JSON.parse(rawValue) : null;
    } catch (error) {
      return null;
    }
  }

  function hasValidSavedConsent() {
    const savedConsent = getSavedConsent();

    if (!savedConsent || typeof savedConsent !== "object") {
      return false;
    }

    return (
      savedConsent.necessary === true &&
      typeof savedConsent.optional === "boolean" &&
      (savedConsent.choice === "accepted" || savedConsent.choice === "rejected") &&
      savedConsent.version === CONSENT_VERSION &&
      typeof savedConsent.timestamp === "string"
    );
  }

  function saveConsent(choice) {
    const consent = {
      necessary: true,
      optional: choice === "accepted",
      choice,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      // Fail quietly so the page still works if storage is unavailable.
    }

    removeCookieBanner();
    return consent;
  }

  function removeCookieBanner() {
    const banner = document.getElementById("cookie-banner");

    if (banner) {
      banner.remove();
    }
  }

  function updateCookieBannerText() {
    const banner = document.getElementById("cookie-banner");

    if (!banner) {
      return;
    }

    banner.querySelectorAll("[data-cookie-i18n]").forEach((element) => {
      element.textContent = getConsentText(element.dataset.cookieI18n);
    });
  }

  function createActionButton(className, textKey, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.dataset.cookieI18n = textKey;
    button.textContent = getConsentText(textKey);

    if (typeof onClick === "function") {
      button.addEventListener("click", onClick);
    }

    return button;
  }

  function createCookieBanner() {
    if (hasValidSavedConsent()) {
      removeCookieBanner();
      return;
    }

    if (document.getElementById("cookie-banner")) {
      updateCookieBannerText();
      return;
    }

    const banner = document.createElement("section");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-labelledby", "cookie-banner-title");

    const content = document.createElement("div");
    content.className = "cookie-banner__content";

    const textWrapper = document.createElement("div");
    textWrapper.className = "cookie-banner__text";

    const title = document.createElement("h2");
    title.id = "cookie-banner-title";
    title.dataset.cookieI18n = "cookieBannerTitle";
    title.textContent = getConsentText("cookieBannerTitle");

    const text = document.createElement("p");
    text.dataset.cookieI18n = "cookieBannerText";
    text.textContent = getConsentText("cookieBannerText");

    textWrapper.append(title, text);

    const actions = document.createElement("div");
    actions.className = "cookie-banner__actions";

    const acceptButton = createActionButton(
      "cookie-button cookie-button--accept",
      "cookieAccept",
      () => saveConsent("accepted"),
    );

    const rejectButton = createActionButton(
      "cookie-button cookie-button--reject",
      "cookieReject",
      () => saveConsent("rejected"),
    );

    const policyLink = document.createElement("a");
    policyLink.href = PRIVACY_PAGE_URL;
    policyLink.className = "cookie-button cookie-button--policy";
    policyLink.dataset.cookieI18n = "cookiePrivacyPolicy";
    policyLink.textContent = getConsentText("cookiePrivacyPolicy");

    actions.append(acceptButton, rejectButton, policyLink);
    content.append(textWrapper, actions);
    banner.appendChild(content);
    document.body.appendChild(banner);
  }

  function resetCookieChoice() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore storage removal failures and continue with UI reset.
    }

    const resetMessage = document.getElementById("privacy-reset-message");

    if (resetMessage) {
      resetMessage.textContent = getConsentText("privacyChoiceResetMessage");
      resetMessage.hidden = false;
    }

    removeCookieBanner();
    createCookieBanner();
  }

  function bindResetCookieChoice() {
    const resetButton = document.getElementById("reset-cookie-choice");

    if (!resetButton || resetButton.dataset.bound === "true") {
      return;
    }

    resetButton.addEventListener("click", resetCookieChoice);
    resetButton.dataset.bound = "true";
  }

  function initializeCookieConsent() {
    bindResetCookieChoice();

    if (!hasValidSavedConsent()) {
      createCookieBanner();
    }
  }

  document.addEventListener("DOMContentLoaded", initializeCookieConsent);
  document.addEventListener("languageChanged", () => {
    updateCookieBannerText();

    const resetMessage = document.getElementById("privacy-reset-message");
    if (resetMessage && !resetMessage.hidden) {
      resetMessage.textContent = getConsentText("privacyChoiceResetMessage");
    }
  });

  window.getSavedConsent = getSavedConsent;
  window.hasValidSavedConsent = hasValidSavedConsent;
  window.saveConsent = saveConsent;
  window.removeCookieBanner = removeCookieBanner;
  window.createCookieBanner = createCookieBanner;
  window.updateCookieBannerText = updateCookieBannerText;
  window.resetCookieChoice = resetCookieChoice;
})();
