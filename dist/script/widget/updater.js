import { formatFullTime } from "../utils/time";
/**
 * Met à jour le contenu du widget avec les nouvelles statistiques
 */
export function updateWidgetContent(stats) {
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
  ) {
    return;
  }
  // Mise à jour de la barre de progression
  innerProgressBar.style.width = `${238 * stats.progressRatio}px`;
  // Mise à jour du pourcentage
  pourcentage.textContent = `${Math.floor(stats.progressRatio * 100)}%`;
  // Mise à jour des heures de la semaine
  heureSemaine.innerHTML = `
    <strong style="color:#d7ffd0; font-weight:600;">Heures de la semaine :</strong> 
    <span style="color:#ffffff;">${formatFullTime(stats.totalLogged)}</span>
  `;
  // Mise à jour des heures du jour
  heureDuJour.innerHTML = `
    <strong style="color:#d7ffd0; font-weight:600;">Heures du jour :</strong> 
    <span style="color:#ffffff;">${formatFullTime(stats.totalToday)}</span>
  `;
  // Mise à jour du temps restant
  const remainingText = formatFullTime(Math.max(0, stats.remaining));
  const blink = `<span style="color:#00ff88; animation: blink 1s infinite;">●</span>`;
  timeleft.innerHTML = `
    <strong style="color:#d7ffd0; font-weight:600;">Heures restantes :</strong> 
    <span style="color:#ffffff;">${remainingText}</span>
    ${stats.sessionHours > 0 ? ` ${blink}` : ""}
  `;
}
