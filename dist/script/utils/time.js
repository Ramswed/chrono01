/**
 * Utilitaires pour le formatage et le parsing de temps
 */
/**
 * Formate un nombre d'heures décimales en format lisible (ex: "2h 30min 15s")
 */
export function formatFullTime(decimalHours) {
    const hours = Math.floor(decimalHours);
    const totalMinutes = decimalHours * 60;
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    return `${hours}h ${minutes}min ${seconds}s`;
}
/**
 * Formate un nombre d'heures décimales en format lisible pour le temps en direct
 * (identique à formatFullTime pour l'instant, mais peut être différencié si besoin)
 */
export function formatLiveTime(decimalHours) {
    return formatFullTime(decimalHours);
}
/**
 * Parse une durée au format "HH:MM:SS" en nombre d'heures décimales
 */
export function parseDuration(text) {
    if (!text || !text.includes(":"))
        return 0;
    const [h, m, s] = text.split(":").map(Number);
    return h + m / 60 + s / 3600;
}
