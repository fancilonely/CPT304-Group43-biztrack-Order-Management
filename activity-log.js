(function () {
  const ACTIVITY_LOG_KEY = "bizTrackActivityLog";
  const ACTIVITY_LOG_LIMIT = 50;

  function getTextSafe(key) {
    return typeof window.getText === "function" ? window.getText(key) : key;
  }

  function translateValueSafe(value) {
    return typeof window.translateValue === "function" ? window.translateValue(value) : value;
  }

  function getLocale() {
    const language = typeof window.getCurrentLanguage === "function" ? window.getCurrentLanguage() : "en";
    return language === "zh" ? "zh-CN" : "en";
  }

  function readActivityLog() {
    try {
      const storedLog = window.localStorage.getItem(ACTIVITY_LOG_KEY);
      const parsedLog = storedLog ? JSON.parse(storedLog) : [];
      return Array.isArray(parsedLog) ? parsedLog : [];
    } catch (error) {
      console.warn("Unable to read activity log.", error);
      return [];
    }
  }

  function saveActivityLog(entries) {
    try {
      window.localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(entries));
      return true;
    } catch (error) {
      console.warn("Unable to save activity log.", error);
      return false;
    }
  }

  function recordActivity(activity) {
    const timestamp = new Date().toISOString();
    const entry = {
      id: `activity-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      moduleKey: activity.moduleKey || "",
      actionKey: activity.actionKey || "",
      entityId: activity.entityId || "",
      entityName: activity.entityName || "",
      amount: activity.amount ?? null,
      createdAt: timestamp,
    };
    const nextLog = [entry, ...readActivityLog()].slice(0, ACTIVITY_LOG_LIMIT);

    if (saveActivityLog(nextLog)) {
      window.dispatchEvent(new Event("biztrackActivityChanged"));
    }
  }

  function formatActivityTime(timestamp) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(getLocale(), {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function formatActivityDetail(entry) {
    const parts = [];

    if (entry.entityId) {
      parts.push(String(entry.entityId));
    }

    if (entry.entityName) {
      parts.push(translateValueSafe(entry.entityName));
    }

    if (typeof entry.amount === "number" && Number.isFinite(entry.amount)) {
      parts.push(`$${entry.amount.toFixed(2)}`);
    }

    return parts.join(" - ");
  }

  function createActivityLogItem(entry) {
    const item = document.createElement("li");
    const meta = document.createElement("div");
    const moduleLabel = document.createElement("span");
    const time = document.createElement("time");
    const action = document.createElement("strong");
    const detail = document.createElement("span");

    item.className = "activity-log-item";
    meta.className = "activity-log-meta";
    moduleLabel.className = "activity-log-module";
    time.className = "activity-log-time";
    action.className = "activity-log-action";
    detail.className = "activity-log-detail";

    moduleLabel.textContent = getTextSafe(entry.moduleKey);
    time.dateTime = entry.createdAt;
    time.textContent = formatActivityTime(entry.createdAt);
    action.textContent = getTextSafe(entry.actionKey);
    detail.textContent = formatActivityDetail(entry);

    meta.append(moduleLabel, time);
    item.append(meta, action);

    if (detail.textContent) {
      item.appendChild(detail);
    }

    return item;
  }

  function renderActivityLogList(list, options = {}) {
    const limit = options.limit || 5;
    const entries = readActivityLog().slice(0, limit);

    list.replaceChildren();

    if (entries.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "activity-log-empty";
      emptyItem.textContent = getTextSafe("noActivityYet");
      list.appendChild(emptyItem);
      return;
    }

    entries.forEach((entry) => {
      list.appendChild(createActivityLogItem(entry));
    });
  }

  window.recordActivity = recordActivity;
  window.getActivityLog = readActivityLog;
  window.renderActivityLogList = renderActivityLogList;
})();
