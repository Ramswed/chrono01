"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  function toggleWidget() {
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
  function createToggleButton() {
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
  function injectToggleButtonStyles() {
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
  var init_toggle = __esm({
    "src/script/widget/toggle.ts"() {
      "use strict";
      init_manager();
    }
  });

  function createWidget() {
    injectGlobalStyles();
    const widget = document.createElement("div");
    widget.id = "emargement-widget";
    widget.className = "chrono01-widget";
    const closeBtn = document.createElement("button");
    closeBtn.className = "chrono01-close-btn";
    closeBtn.innerHTML = "\xD7";
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
    prevBtn.innerHTML = "\u2039";
    prevBtn.title = "Pr\xE9c\xE9dent";
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
    nextBtn.innerHTML = "\u203A";
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
    console.log("\u{1F9F1} Widget cr\xE9\xE9");
  }
  function getCurrentSlideIndex() {
    const activeSlide = document.querySelector(".chrono01-slide-active");
    if (!activeSlide) return 0;
    const slides = document.querySelectorAll(".chrono01-slide");
    return Array.from(slides).indexOf(activeSlide);
  }
  function showSlide(index) {
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
  function injectGlobalStyles() {
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
  function widgetExists() {
    return document.getElementById("emargement-widget") !== null;
  }
  var init_widget = __esm({
    "src/script/widget/widget.ts"() {
      "use strict";
      init_toggle();
    }
  });

  function formatFullTime(decimalHours) {
    const hours = Math.floor(decimalHours);
    const totalMinutes = decimalHours * 60;
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor(totalMinutes * 60 % 60);
    return `${hours}h ${minutes}min ${seconds}s`;
  }
  function parseDuration(text) {
    if (!text || !text.includes(":")) return 0;
    const [h, m, s] = text.split(":").map(Number);
    return h + m / 60 + s / 3600;
  }
  var init_time = __esm({
    "src/script/utils/time.ts"() {
      "use strict";
    }
  });

  function updateWidgetContent(stats) {
    const heureSemaine = document.getElementById(
      "heureSemaine"
    );
    const heureDuJour = document.getElementById("heureDuJour");
    const timeleft = document.getElementById("timeleft");
    if (!heureSemaine || !heureDuJour || !timeleft) {
      return;
    }
    heureSemaine.innerHTML = `
    <span>${formatFullTime(stats.totalLogged)}</span>
    <strong>Heures de la semaine</strong>
  `;
    heureDuJour.innerHTML = `
    <span>${formatFullTime(stats.totalToday)}</span>
    <strong>Heures du jour</strong>
  `;
    const remainingText = formatFullTime(Math.max(0, stats.remaining));
    timeleft.innerHTML = `
    <span>${remainingText}</span>
    <strong>Heures restantes</strong>
  `;
  }
  var init_updater = __esm({
    "src/script/widget/updater.ts"() {
      "use strict";
      init_time();
    }
  });

  function getStartTimeFromRow(row) {
    const cells = row.querySelectorAll("td");
    let startText = "";
    let endText = "";
    for (let i = 0; i < cells.length; i++) {
      const text = cells[i]?.textContent?.trim() || "";
      if (text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
        if (!startText) {
          startText = text;
        } else if (!endText) {
          endText = text;
        }
      } else if (text === "-" && startText) {
        endText = text;
      }
    }
    if (endText === "-" && startText) {
      const [h, m, s] = startText.split(":").map(Number);
      const now =  new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
    }
    return null;
  }
  function findDateCellIndex(cells) {
    for (let i = 0; i < cells.length; i++) {
      const text = cells[i]?.textContent?.trim() || "";
      if (text.includes("janvier") || text.includes("f\xE9vrier") || text.includes("mars") || text.includes("avril") || text.includes("mai") || text.includes("juin") || text.includes("juillet") || text.includes("ao\xFBt") || text.includes("septembre") || text.includes("octobre") || text.includes("novembre") || text.includes("d\xE9cembre")) {
        return { dateText: text, dateCellIndex: i };
      }
    }
    return null;
  }
  function parseFrenchDate(dateText) {
    const dateParts = dateText.split(" ");
    if (dateParts.length < 4) {
      return null;
    }
    const day = parseInt(dateParts[1]);
    const monthName = dateParts[2].toLowerCase();
    const year = parseInt(dateParts[3]);
    const monthMap = {
      janvier: 0,
      f\u00E9vrier: 1,
      mars: 2,
      avril: 3,
      mai: 4,
      juin: 5,
      juillet: 6,
      ao\u00FBt: 7,
      septembre: 8,
      octobre: 9,
      novembre: 10,
      d\u00E9cembre: 11
    };
    const month = monthMap[monthName];
    if (month === void 0 || isNaN(day) || isNaN(year)) {
      return null;
    }
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  function extractTimeInfo(cells, dateCellIndex) {
    let startText = "";
    let endText = "";
    let durationText = "";
    if (dateCellIndex + 3 < cells.length) {
      startText = cells[dateCellIndex + 1]?.textContent?.trim() || "";
      endText = cells[dateCellIndex + 2]?.textContent?.trim() || "";
      durationText = cells[dateCellIndex + 3]?.textContent?.trim() || "";
    } else {
      for (let i = 0; i < cells.length; i++) {
        const text = cells[i]?.textContent?.trim() || "";
        if (text.includes(":") && text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
          durationText = text;
          if (i >= 2) {
            startText = cells[i - 2]?.textContent?.trim() || "";
            endText = cells[i - 1]?.textContent?.trim() || "";
          }
          break;
        }
      }
    }
    return { startText, endText, durationText };
  }
  function extractTotalFromSummary(rows) {
    let totalFromSummary = null;
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 3) {
        const cell1 = cells[1]?.textContent?.trim() || "";
        const cell2 = cells[2]?.textContent?.trim() || "";
        if (cell1.includes("Heures de formation") && cell2.includes(":")) {
          const total = parseDuration(cell2);
          if (!isNaN(total) && total > 0) {
            if (totalFromSummary === null) {
              totalFromSummary = total;
            }
          }
        }
      }
    });
    return totalFromSummary;
  }
  var init_parser = __esm({
    "src/script/utils/parser.ts"() {
      "use strict";
      init_time();
    }
  });

  function calculateWeeklyStats(rows) {
    const weeklyHours = [];
    const todayHours = [];
    let startTime = null;
    let skippedRows = 0;
    let processedRows = 0;
    const skippedReasons = [];
    const now =  new Date();
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - (now.getDay() + 6) % 7);
    currentMonday.setHours(0, 0, 0, 0);
    const totalFromSummary = extractTotalFromSummary(rows);
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 3) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${skippedRows + processedRows}: Pas assez de cellules (${cells.length})`
          );
        }
        return;
      }
      const dateInfo = findDateCellIndex(cells);
      if (!dateInfo) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          const allCells = Array.from(cells).map((c) => c.textContent?.trim()).join(" | ");
          skippedReasons.push(
            `Ligne ${skippedRows + processedRows}: Pas de date trouv\xE9e. Cellules: "${allCells}"`
          );
        }
        return;
      }
      const { dateText, dateCellIndex } = dateInfo;
      const rowDate = parseFrenchDate(dateText);
      if (!rowDate) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${skippedRows + processedRows}: Format de date invalide: "${dateText}"`
          );
        }
        return;
      }
      const { startText, endText, durationText } = extractTimeInfo(
        cells,
        dateCellIndex
      );
      const isSessionInProgress = endText === "-";
      const daysDiff = Math.floor(
        (rowDate.getTime() - currentMonday.getTime()) / (1e3 * 60 * 60 * 24)
      );
      if (daysDiff >= 0 && daysDiff < 7) {
        processedRows++;
        if (durationText && durationText.includes(":") && !isSessionInProgress) {
          const duration = parseDuration(durationText);
          if (!isNaN(duration) && duration > 0) {
            weeklyHours.push(duration);
            const isToday = rowDate.getTime() === new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ).getTime();
            if (isToday) {
              todayHours.push(duration);
            }
          } else if (!window.__chrono01_debug_logged) {
            skippedReasons.push(
              `Ligne ${processedRows}: Dur\xE9e invalide "${durationText}" -> ${duration}`
            );
          }
        } else if (!window.__chrono01_debug_logged && durationText && !isSessionInProgress) {
          skippedReasons.push(
            `Ligne ${processedRows}: Pas de dur\xE9e valide (text: "${durationText}", session en cours: ${isSessionInProgress})`
          );
        }
        if (isSessionInProgress && !startTime) {
          startTime = getStartTimeFromRow(row);
        }
      } else {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${skippedRows + processedRows}: Date hors semaine (${rowDate.toLocaleDateString(
              "fr-FR"
            )}, diff: ${daysDiff} jours)`
          );
        }
      }
    });
    const sessionHours = startTime ? (now.getTime() - startTime.getTime()) / 36e5 : 0;
    const weeklyTotal = weeklyHours.reduce((a, b) => a + b, 0);
    const totalLogged = weeklyTotal + sessionHours;
    const totalToday = todayHours.reduce((a, b) => a + b, 0) + sessionHours;
    const remaining = 35 - totalLogged;
    if (!window.__chrono01_debug_logged) {
      const manualSum = weeklyHours.reduce((a, b) => a + b, 0);
      const debugInfo = {
        totalRows: rows.length,
        processedRows,
        skippedRows,
        weeklyHoursCount: weeklyHours.length,
        weeklyHoursArray: weeklyHours.map((h) => h.toFixed(3) + "h"),
        weeklyTotal: weeklyTotal.toFixed(2) + "h",
        manualSum: manualSum.toFixed(2) + "h",
        totalFromSummary: totalFromSummary !== null ? totalFromSummary.toFixed(2) + "h" : "non trouv\xE9",
        sessionHours: sessionHours.toFixed(2) + "h",
        totalLogged: totalLogged.toFixed(2) + "h",
        remaining: remaining.toFixed(2) + "h",
        currentMonday: currentMonday.toLocaleDateString("fr-FR"),
        today: now.toLocaleDateString("fr-FR"),
        skippedReasons: skippedReasons.slice(0, 15)
      };
      console.log("\u{1F50D} Debug Chrono01 - Analyse:", debugInfo);
      window.__chrono01_debug_logged = true;
    }
    return {
      totalLogged,
      totalToday,
      remaining,
      sessionHours
    };
  }
  var init_calculator = __esm({
    "src/script/utils/calculator.ts"() {
      "use strict";
      init_time();
      init_parser();
    }
  });

  function initWidget() {
    const rows = document.querySelectorAll("tbody tr");
    console.log("\u{1F4CA} Lignes trouv\xE9es :", rows.length);
    if (rows.length === 0) {
      console.log("\u274C Aucune ligne trouv\xE9e, abandon");
      return;
    }
    if (!widgetExists()) {
      createWidget();
    }
    addCloseButton();
    updateWidget();
    if (updateInterval !== null) {
      clearInterval(updateInterval);
    }
    updateInterval = window.setInterval(() => updateWidget(), 1e3);
  }
  function updateWidget() {
    const rows = document.querySelectorAll("tbody tr");
    if (rows.length === 0) {
      return;
    }
    const stats = calculateWeeklyStats(rows);
    updateWidgetContent(stats);
  }
  function addCloseButton() {
    const existingCloseBtn = document.querySelector(
      "#emargement-widget .chrono01-close-btn"
    );
    if (existingCloseBtn) {
      return;
    }
    const widget = document.getElementById("emargement-widget");
    if (!widget) {
      return;
    }
    const closeBtn = document.createElement("button");
    closeBtn.className = "chrono01-close-btn";
    closeBtn.innerHTML = "\xD7";
    closeBtn.title = "Fermer le widget";
    closeBtn.onclick = toggleWidget;
    widget.appendChild(closeBtn);
  }
  var updateInterval;
  var init_manager = __esm({
    "src/script/widget/manager.ts"() {
      "use strict";
      init_widget();
      init_updater();
      init_calculator();
      init_toggle();
      updateInterval = null;
    }
  });

  var require_main = __commonJS({
    "src/script/main.ts"() {
      init_manager();
      console.log("\u{1F4E6} Script d'\xE9margement lanc\xE9");
      function waitForTable() {
        let tries = 0;
        const maxTries = 60;
        const interval = setInterval(() => {
          const rows = document.querySelectorAll("tbody tr");
          if (rows.length > 0) {
            console.log("\u2705 Tableau d\xE9tect\xE9 apr\xE8s attente");
            clearInterval(interval);
            initWidget();
          } else {
            tries++;
            console.log(`\u23F3 Attente du tableau... (${tries}/${maxTries})`);
            if (tries >= maxTries) {
              console.log("\u274C Tableau non d\xE9tect\xE9 apr\xE8s d\xE9lai");
              clearInterval(interval);
            }
          }
        }, 500);
      }
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "complete") {
          console.log("\u23F3 DOM complet, d\xE9marrage de la boucle de d\xE9tection");
          waitForTable();
        }
      });
    }
  });
  require_main();
})();
