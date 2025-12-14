"use strict";
(() => {
  console.log("📦 Script d'émargement lancé");
  function formatLiveTime(decimalHours) {
    const hours = Math.floor(decimalHours);
    const totalMinutes = decimalHours * 60;
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    return `${hours}h ${minutes}min ${seconds}s`;
  }
  function formatFullTime(decimalHours) {
    const hours = Math.floor(decimalHours);
    const totalMinutes = decimalHours * 60;
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    return `${hours}h ${minutes}min ${seconds}s`;
  }
  function parseDuration(text) {
    if (!text || !text.includes(":")) return 0;
    const [h, m, s] = text.split(":").map(Number);
    return h + m / 60 + s / 3600;
  }
  function getStartTimeFromRow(row) {
    const cells = row.querySelectorAll("td");
    // Chercher la colonne de début (format HH:MM:SS)
    let startText = "";
    let endText = "";
    for (let i = 0; i < cells.length; i++) {
      const text = cells[i]?.textContent?.trim() || "";
      // Chercher un format d'heure (HH:MM:SS)
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
      const now = new Date();
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        h,
        m,
        s
      );
    }
    return null;
  }
  function updateWidget() {
    const rows = document.querySelectorAll("tbody tr");
    const weeklyHours = [];
    const todayHours = [];
    let startTime = null;
    let skippedRows = 0;
    let processedRows = 0;
    const skippedReasons = [];
    let totalFromSummary = null;
    const now = new Date();
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    currentMonday.setHours(0, 0, 0, 0);
    // Chercher le total dans les lignes de résumé (lignes avec 3 cellules contenant "Heures de formation")
    // La PREMIÈRE occurrence correspond à la semaine, la deuxième au mois
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length === 3) {
        const cell1 = cells[1]?.textContent?.trim() || "";
        const cell2 = cells[2]?.textContent?.trim() || "";
        if (cell1.includes("Heures de formation") && cell2.includes(":")) {
          const total = parseDuration(cell2);
          if (!isNaN(total) && total > 0) {
            // Prendre seulement la PREMIÈRE occurrence (semaine), ignorer les suivantes (mois)
            if (totalFromSummary === null) {
              totalFromSummary = total;
            }
          }
        }
      }
    });
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      // Ignorer les lignes avec moins de 3 cellules (probablement des en-têtes)
      if (cells.length < 3) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${skippedRows + processedRows}: Pas assez de cellules (${
              cells.length
            })`
          );
        }
        return;
      }
      // Chercher la colonne de date (peut être à différents indices)
      let dateText = "";
      let dateCellIndex = -1;
      for (let i = 0; i < cells.length; i++) {
        const text = cells[i]?.textContent?.trim() || "";
        // Chercher un format de date français (ex: "lundi 8 décembre 2025")
        if (
          text.includes("janvier") ||
          text.includes("février") ||
          text.includes("mars") ||
          text.includes("avril") ||
          text.includes("mai") ||
          text.includes("juin") ||
          text.includes("juillet") ||
          text.includes("août") ||
          text.includes("septembre") ||
          text.includes("octobre") ||
          text.includes("novembre") ||
          text.includes("décembre")
        ) {
          dateText = text;
          dateCellIndex = i;
          break;
        }
      }
      if (!dateText || dateCellIndex === -1) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          const allCells = Array.from(cells)
            .map((c) => c.textContent?.trim())
            .join(" | ");
          skippedReasons.push(
            `Ligne ${
              skippedRows + processedRows
            }: Pas de date trouvée. Cellules: "${allCells}"`
          );
        }
        return;
      }
      const dateParts = dateText.split(" ");
      if (dateParts.length < 4) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${
              skippedRows + processedRows
            }: Format de date invalide: "${dateText}"`
          );
        }
        return;
      }
      const day = parseInt(dateParts[1]);
      const monthName = dateParts[2].toLowerCase();
      const year = parseInt(dateParts[3]);
      const monthMap = {
        janvier: 0,
        février: 1,
        mars: 2,
        avril: 3,
        mai: 4,
        juin: 5,
        juillet: 6,
        août: 7,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
      };
      const month = monthMap[monthName];
      if (month === undefined || isNaN(day) || isNaN(year)) {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${
              skippedRows + processedRows
            }: Date invalide - jour:${day}, mois:${monthName}, année:${year}`
          );
        }
        return;
      }
      const rowDate = new Date(year, month, day);
      rowDate.setHours(0, 0, 0, 0);
      // Chercher les colonnes de début, fin et durée
      // Généralement: date (0), début (1), fin (2), durée (3)
      // Mais peut varier selon la structure
      let startText = "";
      let endText = "";
      let durationText = "";
      // Si on a trouvé la date à l'index dateCellIndex, les colonnes suivantes sont probablement:
      // dateCellIndex+1 = début, dateCellIndex+2 = fin, dateCellIndex+3 = durée
      if (dateCellIndex + 3 < cells.length) {
        startText = cells[dateCellIndex + 1]?.textContent?.trim() || "";
        endText = cells[dateCellIndex + 2]?.textContent?.trim() || "";
        durationText = cells[dateCellIndex + 3]?.textContent?.trim() || "";
      } else {
        // Fallback: chercher une colonne avec un format de durée (HH:MM:SS)
        for (let i = 0; i < cells.length; i++) {
          const text = cells[i]?.textContent?.trim() || "";
          if (text.includes(":") && text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
            durationText = text;
            // Les colonnes précédentes sont probablement début et fin
            if (i >= 2) {
              startText = cells[i - 2]?.textContent?.trim() || "";
              endText = cells[i - 1]?.textContent?.trim() || "";
            }
            break;
          }
        }
      }
      const isSessionInProgress = endText === "-";
      // Comptabiliser toutes les lignes de la semaine (du lundi au dimanche)
      // Inclure les lignes même si elles sont avant le lundi calculé (au cas où le calcul serait incorrect)
      // ou après aujourd'hui (pour gérer les cas où il y aurait des données futures)
      const daysDiff = Math.floor(
        (rowDate.getTime() - currentMonday.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff >= 0 && daysDiff < 7) {
        // Ligne dans la semaine en cours
        processedRows++;
        // Ne pas compter la durée d'une session en cours dans weeklyHours/todayHours
        // car elle sera calculée séparément via sessionHours
        if (
          durationText &&
          durationText.includes(":") &&
          !isSessionInProgress
        ) {
          const duration = parseDuration(durationText);
          if (!isNaN(duration) && duration > 0) {
            weeklyHours.push(duration);
            const isToday =
              rowDate.getTime() ===
              new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
              ).getTime();
            if (isToday) {
              todayHours.push(duration);
            }
          } else if (!window.__chrono01_debug_logged) {
            // Log les durées invalides pour diagnostic
            skippedReasons.push(
              `Ligne ${processedRows}: Durée invalide "${durationText}" -> ${duration}`
            );
          }
        } else if (
          !window.__chrono01_debug_logged &&
          durationText &&
          !isSessionInProgress
        ) {
          // Log les lignes sans durée valide
          skippedReasons.push(
            `Ligne ${processedRows}: Pas de durée valide (text: "${durationText}", session en cours: ${isSessionInProgress})`
          );
        }
        if (isSessionInProgress && !startTime) {
          startTime = getStartTimeFromRow(row);
        }
      } else {
        skippedRows++;
        if (!window.__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${
              skippedRows + processedRows
            }: Date hors semaine (${rowDate.toLocaleDateString(
              "fr-FR"
            )}, diff: ${daysDiff} jours)`
          );
        }
      }
    });
    const sessionHours = startTime
      ? (now.getTime() - startTime.getTime()) / 3600000
      : 0;
    const weeklyTotal = weeklyHours.reduce((a, b) => a + b, 0);
    // Calculer le total en temps réel
    // Utiliser le total du résumé comme base (heures déjà loggées et terminées)
    // et ajouter la session en cours pour avoir le total en temps réel
    let totalLogged;
    if (totalFromSummary !== null && totalFromSummary > weeklyTotal) {
      // Le total du résumé est la base (heures terminées)
      // On ajoute la session en cours pour avoir le total en temps réel
      totalLogged = totalFromSummary + sessionHours;
    } else {
      // Sinon, utiliser le calcul manuel
      totalLogged = weeklyTotal + sessionHours;
    }
    const totalToday = todayHours.reduce((a, b) => a + b, 0) + sessionHours;
    const remaining = 35 - totalLogged;
    // Log unique au premier appel pour diagnostic
    if (!window.__chrono01_debug_logged) {
      // Calculer la somme manuelle pour vérification
      const manualSum = weeklyHours.reduce((a, b) => a + b, 0);
      console.log("🔍 Debug Chrono01 - Analyse:", {
        totalRows: rows.length,
        processedRows,
        skippedRows,
        weeklyHoursCount: weeklyHours.length,
        weeklyHoursArray: weeklyHours.map((h) => h.toFixed(3) + "h"),
        weeklyTotal: weeklyTotal.toFixed(2) + "h",
        manualSum: manualSum.toFixed(2) + "h",
        totalFromSummary:
          totalFromSummary !== null
            ? totalFromSummary.toFixed(2) + "h"
            : "non trouvé",
        sessionHours: sessionHours.toFixed(2) + "h",
        totalLogged: totalLogged.toFixed(2) + "h",
        remaining: remaining.toFixed(2) + "h",
        currentMonday: currentMonday.toLocaleDateString("fr-FR"),
        today: now.toLocaleDateString("fr-FR"),
        skippedReasons: skippedReasons.slice(0, 15), // Augmenter pour voir plus de détails
      });
      window.__chrono01_debug_logged = true;
    }
    // Récupération des éléments du widget
    const innerProgressBar = document.getElementById("innerProgressBar");
    const pourcentage = document.getElementById("progressPercentage");
    const heureSemaine = document.getElementById("heureSemaine");
    const heureDuJour = document.getElementById("heureDuJour");
    const timeleft = document.getElementById("timeleft");
    if (
      !innerProgressBar ||
      !pourcentage ||
      !heureSemaine ||
      !heureDuJour ||
      !timeleft
    )
      return;
    // Mise à jour des valeurs du widget
    const totalSeconds = totalLogged * 3600;
    const progressRatio = Math.min(totalSeconds / 126000, 1); // 35h = 126000s
    innerProgressBar.style.width = `${238 * progressRatio}px`;
    // Mise à jour du contenu du widget
    pourcentage.textContent = `${Math.floor(progressRatio * 100)}%`;
    heureSemaine.innerHTML = `
  <strong style="color:#d7ffd0; font-weight:600;">Heures de la semaine :</strong> 
  <span style="color:#ffffff;">${formatFullTime(totalLogged)}</span>
`;
    heureDuJour.innerHTML = `
  <strong style="color:#d7ffd0; font-weight:600;">Heures du jour :</strong> 
  <span style="color:#ffffff;">${formatFullTime(totalToday)}</span>
`;
    timeleft.innerHTML = `
  <strong style="color:#d7ffd0; font-weight:600;">Heures restantes :</strong> 
  <span style="color:#ffffff;">${formatFullTime(Math.max(0, remaining))}</span>
`;
    // Session en cours avec point clignotant
    const liveTime = startTime ? formatLiveTime(sessionHours) : "N/A";
    const blink = `<span style="color:#00ff88; animation: blink 1s infinite;">●</span>`;
    timeleft.innerHTML += ` ${blink}`;
  }
  function initWidget() {
    const rows = document.querySelectorAll("tbody tr");
    console.log("📊 Lignes trouvées :", rows.length);
    if (rows.length === 0) {
      console.log("❌ Aucune ligne trouvée, abandon");
      return;
    }
    const widget = document.createElement("div");
    widget.id = "emargement-widget";
    widget.style.position = "fixed";
    widget.style.bottom = "15px";
    widget.style.right = "15px";
    widget.style.width = "280px";
    widget.style.height = "210px";
    widget.style.background =
      "linear-gradient(180deg, #29610c, #1b320e, #000000, #000000, #000000)";
    widget.style.color = "white";
    widget.style.padding = "12px";
    widget.style.borderRadius = "8px";
    widget.style.fontFamily = "sans-serif";
    widget.style.fontSize = "14px";
    widget.style.zIndex = "9999";
    // 📊 Barre de progression
    const progressContainer = document.createElement("div");
    progressContainer.style.width = "100%";
    progressContainer.style.height = "10px";
    progressContainer.style.background = "#333";
    progressContainer.style.borderRadius = "5px";
    progressContainer.style.marginBottom = "10px";
    progressContainer.style.overflow = "hidden";
    const innerProgressBar = document.createElement("div");
    innerProgressBar.id = "innerProgressBar";
    innerProgressBar.style.width = "0%";
    innerProgressBar.style.height = "100%";
    innerProgressBar.style.background = "#00b894";
    innerProgressBar.style.transition = "width 0.5s ease";
    progressContainer.appendChild(innerProgressBar);
    // % de progression
    const progressPercentage = document.createElement("div");
    progressPercentage.id = "progressPercentage";
    progressPercentage.style.textAlign = "right";
    progressPercentage.style.marginBottom = "8px";
    progressPercentage.style.fontSize = "14px";
    progressPercentage.textContent = "0%";
    // 📅 Heures cumulées
    const heureSemaine = document.createElement("div");
    heureSemaine.id = "heureSemaine";
    heureSemaine.textContent = "Semaine : 00h00";
    const heureDuJour = document.createElement("div");
    heureDuJour.id = "heureDuJour";
    heureDuJour.textContent = "Aujourd’hui : 00h00";
    const timeleft = document.createElement("div");
    timeleft.id = "timeleft";
    timeleft.textContent = "Restant : 00h00";
    // Bouton de fermeture
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "❌";
    closeBtn.title = "Fermer le widget";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "170px",
      right: "8px",
      background: "transparent",
      color: "#fff",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
    });
    closeBtn.onclick = toggleWidget;
    widget.appendChild(closeBtn);
    // 🧩 Assemblage
    widget.appendChild(progressContainer);
    widget.appendChild(progressPercentage);
    widget.appendChild(heureSemaine);
    widget.appendChild(heureDuJour);
    widget.appendChild(timeleft);
    // widget.appendChild(sessionDiv);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.2; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(widget);
    console.log("🧱 Widget créé");
    updateWidget();
    setInterval(() => updateWidget(), 1000);
  }
  function toggleWidget() {
    const existingWidget = document.getElementById("emargement-widget");
    const existingButton = document.getElementById("open-widget-btn");
    // 🔒 Si le widget est visible → on le ferme
    if (existingWidget) {
      existingWidget.remove();
      // Crée le petit bouton rond pour le rouvrir
      const openBtn = document.createElement("button");
      openBtn.id = "open-widget-btn";
      openBtn.textContent = "🕒";
      openBtn.title = "Ouvrir le widget";
      Object.assign(openBtn.style, {
        position: "fixed",
        bottom: "70px",
        right: "25px",
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        border: "none",
        background: "linear-gradient(180deg, #29610c, #1b320e, #000000)",
        color: "#b2ff91",
        fontSize: "22px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        cursor: "pointer",
        transition: "transform 0.2s ease",
        zIndex: "9999",
      });
      openBtn.onmouseenter = () => (openBtn.style.transform = "scale(1.1)");
      openBtn.onmouseleave = () => (openBtn.style.transform = "scale(1)");
      openBtn.onclick = toggleWidget;
      document.body.appendChild(openBtn);
      return;
    }
    // 🔓 Si seul le bouton est présent → on le retire et on rouvre le widget
    if (existingButton) existingButton.remove();
    initWidget(); // 👈 remplace createWidget()
  }
  function waitForTable() {
    let tries = 0;
    const maxTries = 60;
    const interval = setInterval(() => {
      const rows = document.querySelectorAll("tbody tr");
      if (rows.length > 0) {
        console.log("✅ Tableau détecté après attente");
        clearInterval(interval);
        initWidget();
      } else {
        tries++;
        console.log(`⏳ Attente du tableau... (${tries}/${maxTries})`);
        if (tries >= maxTries) {
          console.log("❌ Tableau non détecté après délai");
          clearInterval(interval);
        }
      }
    }, 500);
  }
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      console.log("⏳ DOM complet, démarrage de la boucle de détection");
      waitForTable();
    }
  });
})();
