import { formatFullTime, formatLiveTime } from "../utils/time";
import { WeeklyStats } from "../utils/calculator";

export function updateWidgetContent(stats: WeeklyStats): void {
  const heureSemaine = document.getElementById(
    "heureSemaine"
  ) as HTMLDivElement;
  const heureDuJour = document.getElementById("heureDuJour") as HTMLDivElement;
  const timeleft = document.getElementById("timeleft") as HTMLDivElement;

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
