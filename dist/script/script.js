"use strict";
(() => {
    console.log("📦 Script d'émargement lancé");
    function formatHours(decimalHours) {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours}h ${minutes}min`;
    }
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
        if (!text || !text.includes(":"))
            return 0;
        const [h, m, s] = text.split(":").map(Number);
        return h + m / 60 + s / 3600;
    }
    function getStartTimeFromRow(row) {
        const cells = row.querySelectorAll("td");
        const startText = cells[1]?.textContent?.trim() || "";
        const endText = cells[2]?.textContent?.trim() || "";
        if (endText === "-") {
            const [h, m, s] = startText.split(":").map(Number);
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
        }
        return null;
    }
    function updateWidget(startTime) {
        const rows = document.querySelectorAll("tbody tr");
        const weeklyHours = [];
        const todayHours = [];
        const now = new Date();
        const currentMonday = new Date(now);
        currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        currentMonday.setHours(0, 0, 0, 0);
        rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 4)
                return;
            const dateText = cells[0]?.textContent?.trim() || "";
            const dateParts = dateText.split(" ");
            if (dateParts.length < 4)
                return;
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
            if (month === undefined || isNaN(day) || isNaN(year))
                return;
            const rowDate = new Date(year, month, day);
            rowDate.setHours(0, 0, 0, 0);
            if (rowDate >= currentMonday && rowDate <= now) {
                const durationText = cells[3]?.textContent?.trim() || "";
                const endText = cells[2]?.textContent?.trim() || "";
                if (durationText.includes(":")) {
                    const duration = parseDuration(durationText);
                    if (!isNaN(duration)) {
                        weeklyHours.push(duration);
                    }
                    const isToday = rowDate.getTime() ===
                        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    if (isToday) {
                        todayHours.push(duration);
                    }
                }
                if (endText === "-" && !startTime) {
                    startTime = getStartTimeFromRow(row);
                }
            }
        });
        const sessionHours = startTime
            ? (now.getTime() - startTime.getTime()) / 3600000
            : 0;
        const totalLogged = weeklyHours.reduce((a, b) => a + b, 0) + sessionHours;
        const totalToday = todayHours.reduce((a, b) => a + b, 0) + sessionHours;
        const remaining = 35 - totalLogged;
        // Récupération des éléments du widget
        const innerProgressBar = document.getElementById("innerProgressBar");
        const pourcentage = document.getElementById("progressPercentage");
        const heureSemaine = document.getElementById("heureSemaine");
        const heureDuJour = document.getElementById("heureDuJour");
        const timeleft = document.getElementById("timeleft");
        if (!innerProgressBar ||
            !pourcentage ||
            !heureSemaine ||
            !heureDuJour ||
            !timeleft)
            return;
        // Mise à jour des valeurs du widget
        const totalSeconds = totalLogged * 3600;
        const progressRatio = Math.min(totalSeconds / 126000, 1); // 35h = 126000s
        innerProgressBar.style.width = `${238 * progressRatio}px`;
        pourcentage.textContent = `${Math.floor(progressRatio * 100)}%`;
        heureSemaine.textContent = `${formatFullTime(totalLogged)}`;
        heureDuJour.textContent = `${formatFullTime(totalToday)}`;
        timeleft.textContent = `Il reste : ${formatFullTime(Math.max(0, remaining))}`;
        // Session en cours avec point clignotant
        const liveTime = startTime ? formatLiveTime(sessionHours) : "N/A";
        const blink = `<span style="color:#00ff88; animation: blink 1s infinite;">●</span>`;
        timeleft.innerHTML += ` <strong>Session :</strong> ${liveTime} ${blink}`;
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
        widget.style.background = "rgba(0, 0, 0, 0.75)";
        widget.style.color = "white";
        widget.style.padding = "12px";
        widget.style.borderRadius = "8px";
        widget.style.fontFamily = "sans-serif";
        widget.style.fontSize = "14px";
        widget.style.zIndex = "9999";
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
        let startTime = null;
        updateWidget(startTime);
        setInterval(() => updateWidget(startTime), 1000);
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
            }
            else {
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
