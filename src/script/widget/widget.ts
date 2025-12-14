import { toggleWidget } from "./toggle";

export function createWidget(): void {
  injectGlobalStyles();

  const widget = document.createElement("div");
  widget.id = "emargement-widget";
  widget.className = "chrono01-widget";

  const closeBtn = document.createElement("button");
  closeBtn.className = "chrono01-close-btn";
  closeBtn.innerHTML = "×";
  closeBtn.title = "Fermer le widget";
  closeBtn.onclick = toggleWidget;

  const slidesContainer = document.createElement("div");
  slidesContainer.className = "chrono01-slides-container";
  slidesContainer.id = "chrono01-slides-container";

  const slide1 = document.createElement("div");
  slide1.className = "chrono01-slide chrono01-slide-active";
  slide1.id = "heureSemaine";

  const slide2 = document.createElement("div");
  slide2.className = "chrono01-slide";
  slide2.id = "heureDuJour";

  const slide3 = document.createElement("div");
  slide3.className = "chrono01-slide";
  slide3.id = "timeleft";

  slidesContainer.appendChild(slide1);
  slidesContainer.appendChild(slide2);
  slidesContainer.appendChild(slide3);

  const navContainer = document.createElement("div");
  navContainer.className = "chrono01-nav-container";

  const prevBtn = document.createElement("button");
  prevBtn.className = "chrono01-nav-btn chrono01-nav-prev";
  prevBtn.innerHTML = "‹";
  prevBtn.title = "Précédent";
  prevBtn.onclick = () => showSlide(getCurrentSlideIndex() - 1);

  const indicators = document.createElement("div");
  indicators.className = "chrono01-indicators";
  for (let i = 0; i < 3; i++) {
    const indicator = document.createElement("button");
    indicator.className = `chrono01-indicator ${i === 0 ? "active" : ""}`;
    indicator.onclick = () => showSlide(i);
    indicators.appendChild(indicator);
  }

  const nextBtn = document.createElement("button");
  nextBtn.className = "chrono01-nav-btn chrono01-nav-next";
  nextBtn.innerHTML = "›";
  nextBtn.title = "Suivant";
  nextBtn.onclick = () => showSlide(getCurrentSlideIndex() + 1);

  navContainer.appendChild(prevBtn);
  navContainer.appendChild(indicators);
  navContainer.appendChild(nextBtn);

  widget.appendChild(closeBtn);
  widget.appendChild(slidesContainer);
  widget.appendChild(navContainer);

  document.body.appendChild(widget);

  requestAnimationFrame(() => {
    widget.classList.add("chrono01-widget-enter");
  });

  console.log("🧱 Widget créé");
}

function getCurrentSlideIndex(): number {
  const activeSlide = document.querySelector(".chrono01-slide-active");
  if (!activeSlide) return 0;
  const slides = document.querySelectorAll(".chrono01-slide");
  return Array.from(slides).indexOf(activeSlide);
}

function showSlide(index: number): void {
  const slides = document.querySelectorAll(".chrono01-slide");
  const indicators = document.querySelectorAll(".chrono01-indicator");

  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add("chrono01-slide-active");
    } else {
      slide.classList.remove("chrono01-slide-active");
    }
  });

  indicators.forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

export function goToSlide(index: number): void {
  showSlide(index);
}

function injectGlobalStyles(): void {
  if (document.getElementById("chrono01-global-styles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "chrono01-global-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .chrono01-widget {
      position: fixed;
      bottom: 15px;
      right: 15px;
      width: 340px;
      min-height: 180px;
      background: #201D1D;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      color: white;
      z-index: 9999;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
      overflow: hidden;
    }

    .chrono01-widget-enter {
      opacity: 1;
      transform: translateY(0);
    }

    .chrono01-slides-container {
      position: relative;
      width: 100%;
      height: 140px;
      overflow: hidden;
    }

    .chrono01-slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transform: translateX(100%);
      transition: opacity 0.4s ease, transform 0.4s ease;
      box-sizing: border-box;
      pointer-events: none;
    }

    .chrono01-slide-active {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
      z-index: 1;
    }

    .chrono01-slide {
      flex-direction: column;
      justify-content: center;
      gap: 12px;
    }

    .chrono01-slide span {
      color: #ffffff;
      font-weight: 700;
      font-size: 32px;
      display: block;
      text-align: center;
      line-height: 1.2;
    }

    .chrono01-slide strong {
      color: #2E65EC;
      font-weight: 600;
      font-size: 14px;
      display: block;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .chrono01-nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.03);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .chrono01-nav-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 20px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      padding: 0;
      line-height: 1;
    }

    .chrono01-nav-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(46, 101, 236, 0.5);
      color: #2E65EC;
      transform: scale(1.1);
    }

    .chrono01-nav-btn:active {
      transform: scale(0.95);
    }

    .chrono01-indicators {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .chrono01-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      padding: 0;
      transition: all 0.2s ease;
    }

    .chrono01-indicator:hover {
      background: rgba(255, 255, 255, 0.5);
      transform: scale(1.2);
    }

    .chrono01-indicator.active {
      background: #2E65EC;
      width: 24px;
      border-radius: 4px;
      box-shadow: 0 0 8px rgba(46, 101, 236, 0.5);
    }

    .chrono01-session-indicator {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #2E65EC;
      border-radius: 50%;
      margin-left: 6px;
      box-shadow: 0 0 12px rgba(46, 101, 236, 0.8), 0 0 24px rgba(46, 101, 236, 0.4);
      animation: chrono01-pulse 2s ease-in-out infinite;
      vertical-align: middle;
    }

    @keyframes chrono01-pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
        box-shadow: 0 0 12px rgba(46, 101, 236, 0.8), 0 0 24px rgba(46, 101, 236, 0.4);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.15);
        box-shadow: 0 0 16px rgba(46, 101, 236, 1), 0 0 32px rgba(46, 101, 236, 0.6);
      }
    }

    .chrono01-close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 20px;
      font-weight: 300;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 10;
      line-height: 1;
      padding: 0;
    }

    .chrono01-close-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(46, 101, 236, 0.5);
      color: #2E65EC;
      transform: scale(1.1);
    }

    .chrono01-close-btn:active {
      transform: scale(0.95);
    }
  `;
  document.head.appendChild(style);
}

export function widgetExists(): boolean {
  return document.getElementById("emargement-widget") !== null;
}
