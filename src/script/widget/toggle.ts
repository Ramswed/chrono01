import { createWidget } from "./widget";
import { initWidget } from "./manager";

export function toggleWidget(): void {
  const existingWidget = document.getElementById("emargement-widget");
  const existingButton = document.getElementById("open-widget-btn");

  if (existingWidget) {
    existingWidget.remove();
    createToggleButton();
    return;
  }

  if (existingButton) {
    existingButton.remove();
  }

  initWidget();
}

function createToggleButton(): void {
  injectToggleButtonStyles();

  const openBtn = document.createElement("button");
  openBtn.id = "open-widget-btn";
  openBtn.className = "chrono01-toggle-btn";
  openBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    <path d="M16.5 12H12.25C12.1119 12 12 11.8881 12 11.75V8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
  openBtn.title = "Ouvrir le widget";

  requestAnimationFrame(() => {
    openBtn.classList.add("chrono01-toggle-btn-enter");
  });

  openBtn.onclick = toggleWidget;
  document.body.appendChild(openBtn);
}

function injectToggleButtonStyles(): void {
  if (document.getElementById("chrono01-toggle-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "chrono01-toggle-styles";
  style.textContent = `
    .chrono01-toggle-btn {
      position: fixed;
      bottom: 70px;
      right: 25px;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(20, 20, 20, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #2E65EC;
      font-size: 22px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35), 
                  0 0 0 1px rgba(255, 255, 255, 0.05) inset;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }

    .chrono01-toggle-btn-enter {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    .chrono01-toggle-btn:hover {
      transform: scale(1.1);
      background: rgba(20, 20, 20, 0.75);
      border-color: rgba(46, 101, 236, 0.3);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                  0 0 20px rgba(46, 101, 236, 0.2);
    }

    .chrono01-toggle-btn:active {
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
}

export function toggleButtonExists(): boolean {
  return document.getElementById("open-widget-btn") !== null;
}
