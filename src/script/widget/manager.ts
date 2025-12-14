import { createWidget, widgetExists } from "./widget";
import { updateWidgetContent } from "./updater";
import { calculateWeeklyStats } from "../utils/calculator";
import { toggleWidget } from "./toggle";

let updateInterval: number | null = null;

export function initWidget(): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>("tbody tr");

  console.log("📊 Lignes trouvées :", rows.length);

  if (rows.length === 0) {
    console.log("❌ Aucune ligne trouvée, abandon");
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
  updateInterval = window.setInterval(() => updateWidget(), 1000);
}

export function updateWidget(): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>("tbody tr");

  if (rows.length === 0) {
    return;
  }

  const stats = calculateWeeklyStats(rows);
  updateWidgetContent(stats);
}

function addCloseButton(): void {
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
  closeBtn.innerHTML = "×";
  closeBtn.title = "Fermer le widget";
  closeBtn.onclick = toggleWidget;
  widget.appendChild(closeBtn);
}

export function cleanup(): void {
  if (updateInterval !== null) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}
