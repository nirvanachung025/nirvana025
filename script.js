// ====== Smooth scroll ======
const scrollBtn = document.getElementById("scrollToVideos");
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    document.getElementById("page2").scrollIntoView({ behavior: "smooth" });
  });
}

// ====== Ink intro typewriter ======
const inkIntro = document.getElementById("inkIntro");
const skipIntro = document.getElementById("skipIntro");
const inkPoem = document.getElementById("inkPoem");

function typewriter(el, text, speed = 60) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i] ?? "";
    i += 1;
    if (i >= text.length) clearInterval(timer);
  }, speed);
  return timer;
}

function closeIntro() {
  if (!inkIntro) return;
  inkIntro.style.opacity = "0";
  inkIntro.style.transition = "opacity .45s ease";
  setTimeout(() => {
    inkIntro.style.display = "none";
  }, 460);
}

if (inkPoem) {
  const text = inkPoem.dataset.text || "願每份思念，都有溫柔落處。";
  typewriter(inkPoem, text, 70);

  // 用户第一次滚动就关闭 intro
  window.addEventListener("wheel", closeIntro, { once: true, passive: true });
  window.addEventListener("touchmove", closeIntro, { once: true, passive: true });
}

if (skipIntro) skipIntro.addEventListener("click", closeIntro);

// ====== Video modal ======
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");

function openModal({ title, src }) {
  if (!modal || !modalBody || !modalTitle) return;

  modalTitle.textContent = title || "影片播放";
  modalBody.innerHTML = "";

  const isYouTube = src.includes("youtube.com/embed") || src.includes("youtu.be");
  const isMP4 = src.endsWith(".mp4") || src.includes(".mp4?");

  if (isMP4) {
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.src = src;
    modalBody.appendChild(video);
  } else {
    // 默认用 iframe（YouTube embed / 其他平台 embed）
    const iframe = document.createElement("iframe");
    iframe.src = src + (isYouTube && !src.includes("?") ? "?autoplay=1" : "");
    iframe.title = title || "video";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    modalBody.appendChild(iframe);
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal || !modalBody) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalBody.innerHTML = "";
  document.body.style.overflow = "";
}

// click steps
document.querySelectorAll(".step").forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal({
      title: btn.dataset.title,
      src: btn.dataset.src,
    });
  });
});

// close modal
if (modal) {
  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.dataset && target.dataset.close === "true") closeModal();
  });
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
