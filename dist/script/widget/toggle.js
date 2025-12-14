import { initWidget } from "./manager";
/**
 * Gère l'affichage et le masquage du widget
 */
export function toggleWidget() {
    const existingWidget = document.getElementById("emargement-widget");
    const existingButton = document.getElementById("open-widget-btn");
    // 🔒 Si le widget est visible → on le ferme
    if (existingWidget) {
        existingWidget.remove();
        // Crée le petit bouton rond pour le rouvrir
        createToggleButton();
        return;
    }
    // 🔓 Si seul le bouton est présent → on le retire et on rouvre le widget
    if (existingButton) {
        existingButton.remove();
    }
    initWidget(); // Réinitialise le widget
}
/**
 * Crée le bouton de toggle pour rouvrir le widget
 */
function createToggleButton() {
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
}
/**
 * Vérifie si le bouton de toggle existe
 */
export function toggleButtonExists() {
    return document.getElementById("open-widget-btn") !== null;
}
