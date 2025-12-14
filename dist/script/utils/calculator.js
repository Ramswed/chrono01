import { parseDuration } from "./time";
import { findDateCellIndex, parseFrenchDate, extractTimeInfo, getStartTimeFromRow, extractTotalFromSummary, } from "./parser";
/**
 * Calcule les statistiques hebdomadaires à partir des lignes du tableau
 */
export function calculateWeeklyStats(rows) {
    const weeklyHours = [];
    const todayHours = [];
    let startTime = null;
    let skippedRows = 0;
    let processedRows = 0;
    const skippedReasons = [];
    const now = new Date();
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    currentMonday.setHours(0, 0, 0, 0);
    // Chercher le total dans les lignes de résumé
    const totalFromSummary = extractTotalFromSummary(rows);
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        // Ignorer les lignes avec moins de 3 cellules (probablement des en-têtes)
        if (cells.length < 3) {
            skippedRows++;
            if (!window.__chrono01_debug_logged) {
                skippedReasons.push(`Ligne ${skippedRows + processedRows}: Pas assez de cellules (${cells.length})`);
            }
            return;
        }
        // Chercher la colonne de date
        const dateInfo = findDateCellIndex(cells);
        if (!dateInfo) {
            skippedRows++;
            if (!window.__chrono01_debug_logged) {
                const allCells = Array.from(cells)
                    .map((c) => c.textContent?.trim())
                    .join(" | ");
                skippedReasons.push(`Ligne ${skippedRows + processedRows}: Pas de date trouvée. Cellules: "${allCells}"`);
            }
            return;
        }
        const { dateText, dateCellIndex } = dateInfo;
        // Parser la date
        const rowDate = parseFrenchDate(dateText);
        if (!rowDate) {
            skippedRows++;
            if (!window.__chrono01_debug_logged) {
                skippedReasons.push(`Ligne ${skippedRows + processedRows}: Format de date invalide: "${dateText}"`);
            }
            return;
        }
        // Extraire les informations de temps
        const { startText, endText, durationText } = extractTimeInfo(cells, dateCellIndex);
        const isSessionInProgress = endText === "-";
        // Vérifier si la ligne est dans la semaine en cours
        const daysDiff = Math.floor((rowDate.getTime() - currentMonday.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff < 7) {
            // Ligne dans la semaine en cours
            processedRows++;
            // Ne pas compter la durée d'une session en cours dans weeklyHours/todayHours
            // car elle sera calculée séparément via sessionHours
            if (durationText &&
                durationText.includes(":") &&
                !isSessionInProgress) {
                const duration = parseDuration(durationText);
                if (!isNaN(duration) && duration > 0) {
                    weeklyHours.push(duration);
                    const isToday = rowDate.getTime() ===
                        new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    if (isToday) {
                        todayHours.push(duration);
                    }
                }
                else if (!window.__chrono01_debug_logged) {
                    skippedReasons.push(`Ligne ${processedRows}: Durée invalide "${durationText}" -> ${duration}`);
                }
            }
            else if (!window.__chrono01_debug_logged &&
                durationText &&
                !isSessionInProgress) {
                skippedReasons.push(`Ligne ${processedRows}: Pas de durée valide (text: "${durationText}", session en cours: ${isSessionInProgress})`);
            }
            if (isSessionInProgress && !startTime) {
                startTime = getStartTimeFromRow(row);
            }
        }
        else {
            skippedRows++;
            if (!window.__chrono01_debug_logged) {
                skippedReasons.push(`Ligne ${skippedRows + processedRows}: Date hors semaine (${rowDate.toLocaleDateString("fr-FR")}, diff: ${daysDiff} jours)`);
            }
        }
    });
    const sessionHours = startTime
        ? (now.getTime() - startTime.getTime()) / 3600000
        : 0;
    const weeklyTotal = weeklyHours.reduce((a, b) => a + b, 0);
    // Calculer le total en temps réel
    let totalLogged;
    if (totalFromSummary !== null && totalFromSummary > weeklyTotal) {
        totalLogged = totalFromSummary + sessionHours;
    }
    else {
        totalLogged = weeklyTotal + sessionHours;
    }
    const totalToday = todayHours.reduce((a, b) => a + b, 0) + sessionHours;
    const remaining = 35 - totalLogged;
    // Calcul du ratio de progression (35h = 126000s)
    const totalSeconds = totalLogged * 3600;
    const progressRatio = Math.min(totalSeconds / 126000, 1);
    // Log de debug (une seule fois)
    if (!window.__chrono01_debug_logged) {
        const manualSum = weeklyHours.reduce((a, b) => a + b, 0);
        const debugInfo = {
            totalRows: rows.length,
            processedRows,
            skippedRows,
            weeklyHoursCount: weeklyHours.length,
            weeklyHoursArray: weeklyHours.map((h) => h.toFixed(3) + "h"),
            weeklyTotal: weeklyTotal.toFixed(2) + "h",
            manualSum: manualSum.toFixed(2) + "h",
            totalFromSummary: totalFromSummary !== null
                ? totalFromSummary.toFixed(2) + "h"
                : "non trouvé",
            sessionHours: sessionHours.toFixed(2) + "h",
            totalLogged: totalLogged.toFixed(2) + "h",
            remaining: remaining.toFixed(2) + "h",
            currentMonday: currentMonday.toLocaleDateString("fr-FR"),
            today: now.toLocaleDateString("fr-FR"),
            skippedReasons: skippedReasons.slice(0, 15),
        };
        console.log("🔍 Debug Chrono01 - Analyse:", debugInfo);
        window.__chrono01_debug_logged = true;
    }
    return {
        totalLogged,
        totalToday,
        remaining,
        sessionHours,
        progressRatio,
    };
}
