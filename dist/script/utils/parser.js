import { parseDuration } from "./time";
/**
 * Utilitaires pour parser les données du tableau HTML
 */
/**
 * Extrait l'heure de début d'une session en cours depuis une ligne du tableau
 */
export function getStartTimeFromRow(row) {
    const cells = row.querySelectorAll("td");
    // Chercher la colonne de début (format HH:MM:SS)
    let startText = "";
    let endText = "";
    for (let i = 0; i < cells.length; i++) {
        const text = cells[i]?.textContent?.trim() || "";
        // Chercher un format d'heure (HH:MM:SS)
        if (text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
            if (!startText) {
                startText = text;
            }
            else if (!endText) {
                endText = text;
            }
        }
        else if (text === "-" && startText) {
            endText = text;
        }
    }
    if (endText === "-" && startText) {
        const [h, m, s] = startText.split(":").map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
    }
    return null;
}
/**
 * Trouve l'index de la colonne contenant la date dans une ligne
 */
export function findDateCellIndex(cells) {
    for (let i = 0; i < cells.length; i++) {
        const text = cells[i]?.textContent?.trim() || "";
        // Chercher un format de date français (ex: "lundi 8 décembre 2025")
        if (text.includes("janvier") ||
            text.includes("février") ||
            text.includes("mars") ||
            text.includes("avril") ||
            text.includes("mai") ||
            text.includes("juin") ||
            text.includes("juillet") ||
            text.includes("août") ||
            text.includes("septembre") ||
            text.includes("octobre") ||
            text.includes("novembre") ||
            text.includes("décembre")) {
            return { dateText: text, dateCellIndex: i };
        }
    }
    return null;
}
/**
 * Parse une date française en objet Date
 */
export function parseFrenchDate(dateText) {
    const dateParts = dateText.split(" ");
    if (dateParts.length < 4) {
        return null;
    }
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
    if (month === undefined || isNaN(day) || isNaN(year)) {
        return null;
    }
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date;
}
/**
 * Extrait les informations de temps (début, fin, durée) d'une ligne
 */
export function extractTimeInfo(cells, dateCellIndex) {
    let startText = "";
    let endText = "";
    let durationText = "";
    // Si on a trouvé la date à l'index dateCellIndex, les colonnes suivantes sont probablement:
    // dateCellIndex+1 = début, dateCellIndex+2 = fin, dateCellIndex+3 = durée
    if (dateCellIndex + 3 < cells.length) {
        startText = cells[dateCellIndex + 1]?.textContent?.trim() || "";
        endText = cells[dateCellIndex + 2]?.textContent?.trim() || "";
        durationText = cells[dateCellIndex + 3]?.textContent?.trim() || "";
    }
    else {
        // Fallback: chercher une colonne avec un format de durée (HH:MM:SS)
        for (let i = 0; i < cells.length; i++) {
            const text = cells[i]?.textContent?.trim() || "";
            if (text.includes(":") && text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
                durationText = text;
                // Les colonnes précédentes sont probablement début et fin
                if (i >= 2) {
                    startText = cells[i - 2]?.textContent?.trim() || "";
                    endText = cells[i - 1]?.textContent?.trim() || "";
                }
                break;
            }
        }
    }
    return { startText, endText, durationText };
}
/**
 * Extrait le total des heures depuis les lignes de résumé
 */
export function extractTotalFromSummary(rows) {
    let totalFromSummary = null;
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length === 3) {
            const cell1 = cells[1]?.textContent?.trim() || "";
            const cell2 = cells[2]?.textContent?.trim() || "";
            if (cell1.includes("Heures de formation") && cell2.includes(":")) {
                const total = parseDuration(cell2);
                if (!isNaN(total) && total > 0) {
                    // Prendre seulement la PREMIÈRE occurrence (semaine), ignorer les suivantes (mois)
                    if (totalFromSummary === null) {
                        totalFromSummary = total;
                    }
                }
            }
        }
    });
    return totalFromSummary;
}
