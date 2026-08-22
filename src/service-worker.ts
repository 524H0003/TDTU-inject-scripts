const TDTURegex = /^https?:\/\/.*\.tdtu\.edu\.vn(:\d+)?\/.*$/;

// Enable logging with timestamp
const originalLog = console.log;
console.log = function (...args) {
  originalLog.apply(console, [`[${new Date().toISOString()}]`, ...args]);
};

async function executeScript(tab: chrome.tabs.Tab) {
  if (!tab.id || !tab.url) return;
  const target = tab.url.split(".")[0]!.split("/").at(-1);

  try {
    // Check if script is already injected for the current URL to prevent duplicate executions
    const checkResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: () => {
        if (
          window.__scriptInjected &&
          window.__lastInjectedUrl === window.location.href
        ) {
          return true;
        }
        window.__scriptInjected = true;
        window.__lastInjectedUrl = window.location.href;
        return false;
      },
    });

    const isAlreadyInjected = checkResult[0]?.result;
    if (isAlreadyInjected) {
      return;
    }

    let cssText = "";
    try {
      const cssUrl = chrome.runtime.getURL("./dist/index.css");
      const response = await fetch(cssUrl);
      cssText = await response.text();
    } catch (err) {
      console.error("Lỗi khi tải CSS\n", err);
    }

    await chrome.scripting
      .executeScript({
        world: "MAIN",
        target: { tabId: tab.id },
        files: ["./dist/context/" + target + ".js"],
      })
      .then(() => {
        console.log("Đã chèn thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi chèn script\n", err);
      });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      args: [cssText],
      func: (css) => {
        if (typeof window.executeInjectScript === "function") {
          window.executeInjectScript(css);
        }
      },
    });
  } catch (err) {
    console.error("Lỗi khi chèn script\n", err);
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || !TDTURegex.test(tab.url)) return;

  // Trigger on loading, complete, or when URL changes (SPA transitions)
  if (
    changeInfo.status === "loading" ||
    changeInfo.status === "complete" ||
    changeInfo.url
  ) {
    executeScript(tab);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (tab.url && TDTURegex.test(tab.url)) {
      executeScript(tab);
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tab:", error);
  }
});
