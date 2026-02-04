if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const SCROLL_KEY = "fg_scrollY";

window.addEventListener("pagehide", () => {
  // pagehide 比 beforeunload 更稳（Safari/部分浏览器）
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || 0));
});

window.addEventListener("DOMContentLoaded", () => {
  const y = Number(sessionStorage.getItem(SCROLL_KEY) || "0");
  if (!Number.isNaN(y) && y > 0) {
    // 用两帧确保 layout 都完成（避免被后续渲染覆盖）
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: "auto" });
      });
    });
  }
});