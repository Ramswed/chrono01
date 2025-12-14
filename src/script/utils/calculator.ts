import { parseDuration } from "./time";
import {
  findDateCellIndex,
  parseFrenchDate,
  extractTimeInfo,
  getStartTimeFromRow,
  extractTotalFromSummary,
} from "./parser";

export interface WeeklyStats {
  totalLogged: number;
  totalToday: number;
  remaining: number;
  sessionHours: number;
  progressRatio: number;
}

export interface DebugInfo {
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  weeklyHoursCount: number;
  weeklyHoursArray: string[];
  weeklyTotal: string;
  manualSum: string;
  totalFromSummary: string;
  sessionHours: string;
  totalLogged: string;
  remaining: string;
  currentMonday: string;
  today: string;
  skippedReasons: string[];
}

export function calculateWeeklyStats(
  rows: NodeListOf<HTMLTableRowElement>
): WeeklyStats {
  const weeklyHours: number[] = [];
  const todayHours: number[] = [];
  let startTime: Date | null = null as Date | null;
  let skippedRows = 0;
  let processedRows = 0;
  const skippedReasons: string[] = [];

  const now = new Date();
  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  currentMonday.setHours(0, 0, 0, 0);

  const totalFromSummary = extractTotalFromSummary(rows);

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");

    if (cells.length < 3) {
      skippedRows++;
      if (!(window as any).__chrono01_debug_logged) {
        skippedReasons.push(
          `Ligne ${skippedRows + processedRows}: Pas assez de cellules (${
            cells.length
          })`
        );
      }
      return;
    }

    const dateInfo = findDateCellIndex(cells);
    if (!dateInfo) {
      skippedRows++;
      if (!(window as any).__chrono01_debug_logged) {
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

    const { dateText, dateCellIndex } = dateInfo;

    const rowDate = parseFrenchDate(dateText);
    if (!rowDate) {
      skippedRows++;
      if (!(window as any).__chrono01_debug_logged) {
        skippedReasons.push(
          `Ligne ${
            skippedRows + processedRows
          }: Format de date invalide: "${dateText}"`
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
      (rowDate.getTime() - currentMonday.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff >= 0 && daysDiff < 7) {
      processedRows++;

      if (durationText && durationText.includes(":") && !isSessionInProgress) {
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
        } else if (!(window as any).__chrono01_debug_logged) {
          skippedReasons.push(
            `Ligne ${processedRows}: Durée invalide "${durationText}" -> ${duration}`
          );
        }
      } else if (
        !(window as any).__chrono01_debug_logged &&
        durationText &&
        !isSessionInProgress
      ) {
        skippedReasons.push(
          `Ligne ${processedRows}: Pas de durée valide (text: "${durationText}", session en cours: ${isSessionInProgress})`
        );
      }

      if (isSessionInProgress && !startTime) {
        startTime = getStartTimeFromRow(row);
      }
    } else {
      skippedRows++;
      if (!(window as any).__chrono01_debug_logged) {
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

  let totalLogged: number;
  if (totalFromSummary !== null && totalFromSummary > weeklyTotal) {
    totalLogged = totalFromSummary + sessionHours;
  } else {
    totalLogged = weeklyTotal + sessionHours;
  }

  const totalToday = todayHours.reduce((a, b) => a + b, 0) + sessionHours;
  const remaining = 35 - totalLogged;

  const totalSeconds = totalLogged * 3600;
  const progressRatio = Math.min(totalSeconds / 126000, 1);

  if (!(window as any).__chrono01_debug_logged) {
    const manualSum = weeklyHours.reduce((a, b) => a + b, 0);

    const debugInfo: DebugInfo = {
      totalRows: rows.length,
      processedRows,
      skippedRows,
      weeklyHoursCount: weeklyHours.length,
      weeklyHoursArray: weeklyHours.map((h) => h.toFixed(3) + "h"),
      weeklyTotal: weeklyTotal.toFixed(2) + "h",
      manualSum: manualSum.toFixed(2) + "h",
      totalFromSummary:
        totalFromSummary !== null
          ? (totalFromSummary as number).toFixed(2) + "h"
          : "non trouvé",
      sessionHours: sessionHours.toFixed(2) + "h",
      totalLogged: totalLogged.toFixed(2) + "h",
      remaining: remaining.toFixed(2) + "h",
      currentMonday: currentMonday.toLocaleDateString("fr-FR"),
      today: now.toLocaleDateString("fr-FR"),
      skippedReasons: skippedReasons.slice(0, 15),
    };

    console.log("🔍 Debug Chrono01 - Analyse:", debugInfo);
    (window as any).__chrono01_debug_logged = true;
  }

  return {
    totalLogged,
    totalToday,
    remaining,
    sessionHours,
    progressRatio,
  };
}
