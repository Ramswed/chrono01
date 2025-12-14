import { createWidget, widgetExists } from "./widget";
import { updateWidgetContent } from "./updater";
import { calculateWeeklyStats } from "../utils/calculator";
import { toggleWidget } from "./toggle";
let updateInterval = null;
/**
 * Initialise le widget et démarre la mise à jour automatique
 */
export function initWidget() {
    const rows = document.querySelectorAll("tbody tr");
    console.log("📊 Lignes trouvées :", rows.length);
    if (rows.length === 0) {
        console.log("❌ Aucune ligne trouvée, abandon");
        return;
    }
    // Créer le widget s'il n'existe pas
    if (!widgetExists()) {
        createWidget();
    }
    // Ajouter le bouton de fermeture
    addCloseButton();
    // Mettre à jour le widget
    updateWidget();
    // Démarrer la mise à jour automatique toutes les secondes
    if (updateInterval !== null) {
        clearInterval(updateInterval);
    }
    updateInterval = window.setInterval(() => updateWidget(), 1000);
}
/**
 * Met à jour le widget avec les données actuelles
 */
export function updateWidget() {
    const rows = document.querySelectorAll("tbody tr");
    if (rows.length === 0) {
        return;
    }
    const stats = calculateWeeklyStats(rows);
    updateWidgetContent(stats);
}
/**
 * Ajoute le bouton de fermeture au widget
 */
function addCloseButton() {
    // Vérifier si le bouton existe déjà
    const existingCloseBtn = document.querySelector("#emargement-widget button");
    if (existingCloseBtn) {
        return;
    }
    const widget = document.getElementById("emargement-widget");
    if (!widget) {
        return;
    }
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
}
/**
 * Nettoie les intervalles et supprime le widget
 */
export function cleanup() {
    if (updateInterval !== null) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}
