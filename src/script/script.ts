(() => {
  console.log("📦 Script d'émargement lancé");

  function formatHours(decimalHours: number): string {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours}h ${minutes}min`;
  }

  function formatLiveTime(decimalHours: number): string {
    const hours = Math.floor(decimalHours);
    const totalMinutes = decimalHours * 60;
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    return `${hours}h ${minutes}min ${seconds}s`;
  }

  function formatFullTime(decimalHours: number): string {
    const hours = Math.floor(decimalHours);
    const totalMinutes = decimalHours * 60;
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    return `${hours}h ${minutes}min ${seconds}s`;
  }

  function parseDuration(text: string): number {
    if (!text || !text.includes(":")) return 0;
    const [h, m, s] = text.split(":").map(Number);
    return h + m / 60 + s / 3600;
  }

  function getStartTimeFromRow(row: HTMLTableRowElement): Date | null {
    const cells = row.querySelectorAll("td");
    const startText = cells[1]?.textContent?.trim() || "";
    const endText = cells[2]?.textContent?.trim() || "";
    if (endText === "-") {
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

  function updateWidget(startTime: Date | null) {
    const rows = document.querySelectorAll<HTMLTableRowElement>("tbody tr");
    const weeklyHours: number[] = [];
    const todayHours: number[] = [];

    const now = new Date();
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    currentMonday.setHours(0, 0, 0, 0);

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 4) return;

      const dateText = cells[0]?.textContent?.trim() || "";
      const dateParts = dateText.split(" ");
      if (dateParts.length < 4) return;

      const day = parseInt(dateParts[1]);
      const monthName = dateParts[2].toLowerCase();
      const year = parseInt(dateParts[3]);
      const monthMap: Record<string, number> = {
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

      const month: number | undefined = monthMap[monthName];
      if (month === undefined || isNaN(day) || isNaN(year)) return;

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
    const innerProgressBar = document.getElementById(
      "innerProgressBar"
    ) as HTMLDivElement;
    const pourcentage = document.getElementById(
      "progressPercentage"
    ) as HTMLDivElement;
    const heureSemaine = document.getElementById(
      "heureSemaine"
    ) as HTMLDivElement;
    const heureDuJour = document.getElementById(
      "heureDuJour"
    ) as HTMLDivElement;
    const timeleft = document.getElementById("timeleft") as HTMLDivElement;

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
  <strong style="color:#d7ffd0; font-weight:600;">Heure de la semaine :</strong> 
  <span style="color:#ffffff;">${formatFullTime(totalLogged)}</span>
`;

    heureDuJour.innerHTML = `
  <strong style="color:#d7ffd0; font-weight:600;">Heure du jour :</strong> 
  <span style="color:#ffffff;">${formatFullTime(totalToday)}</span>
`;

    timeleft.innerHTML = `
  <strong style="color:#d7ffd0; font-weight:600;">Il reste :</strong> 
  <span style="color:#ffffff;">${formatFullTime(Math.max(0, remaining))}</span>
`;

    // Session en cours avec point clignotant
    const liveTime = startTime ? formatLiveTime(sessionHours) : "N/A";
    const blink = `<span style="color:#00ff88; animation: blink 1s infinite;">●</span>`;
    timeleft.innerHTML += ` ${blink}`;
  }

  function initWidget() {
    const rows = document.querySelectorAll<HTMLTableRowElement>("tbody tr");

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

    // input texte pour entrer le nom
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = "entrez votre nom";
    Object.assign(textInput.style, {
      position: "absolute",
      top: "170px",
      right: "160px",
      width: "110px",
      padding: "2px 6px",
      borderRadius: "4px",
      border: "1px solid #444",
      background: "#222",
      color: "#fff",
      fontSize: "13px",
      outline: "none",
    });
    widget.appendChild(textInput);

    // bouton pour envoyer le texte
    const sendBtn = document.createElement("button");
    sendBtn.textContent = "Envoyer";
    sendBtn.title = "Envoyer le texte";
    Object.assign(sendBtn.style, {
      position: "absolute",
      top: "170px",
      right: "90px",
      background: "#00b894",
      color: "#222",
      border: "none",
      borderRadius: "4px",
      fontSize: "13px",
      padding: "2px 8px",
      cursor: "pointer",
    });
    sendBtn.onclick = () => {
      const value = textInput.value.trim();
      if (value) {
        alert(`Texte envoyé : ${value}`);
        textInput.value = "";
      } else {
        alert("Veuillez entrer un texte.");
      }
    };
    widget.appendChild(sendBtn);

    //bouton de suppression
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

    let startTime = null;
    updateWidget(startTime);
    setInterval(() => updateWidget(startTime), 1000);
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
      const rows = document.querySelectorAll<HTMLTableRowElement>("tbody tr");
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
