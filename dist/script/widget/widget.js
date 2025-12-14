/**
 * Création et structure du widget d'affichage
 */
/**
 * Crée le widget d'émargement et l'ajoute au DOM
 */
export function createWidget() {
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
    heureDuJour.textContent = "Aujourd'hui : 00h00";
    const timeleft = document.createElement("div");
    timeleft.id = "timeleft";
    timeleft.textContent = "Restant : 00h00";
    // 🧩 Assemblage
    widget.appendChild(progressContainer);
    widget.appendChild(progressPercentage);
    widget.appendChild(heureSemaine);
    widget.appendChild(heureDuJour);
    widget.appendChild(timeleft);
    // Ajouter les styles d'animation
    addBlinkAnimation();
    document.body.appendChild(widget);
    console.log("🧱 Widget créé");
}
/**
 * Ajoute l'animation de clignotement au document
 */
function addBlinkAnimation() {
    // Vérifier si l'animation existe déjà
    if (document.getElementById("chrono01-blink-animation")) {
        return;
    }
    const style = document.createElement("style");
    style.id = "chrono01-blink-animation";
    style.textContent = `
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.2; }
      100% { opacity: 1; }
    }
  `;
    document.head.appendChild(style);
}
/**
 * Vérifie si le widget existe dans le DOM
 */
export function widgetExists() {
    return document.getElementById("emargement-widget") !== null;
}
