export function formatFullTime(decimalHours: number): string {
  const hours = Math.floor(decimalHours);
  const totalMinutes = decimalHours * 60;
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((totalMinutes * 60) % 60);
  return `${hours}h ${minutes}min ${seconds}s`;
}

export function formatLiveTime(decimalHours: number): string {
  return formatFullTime(decimalHours);
}

export function parseDuration(text: string): number {
  if (!text || !text.includes(":")) return 0;
  const [h, m, s] = text.split(":").map(Number);
  return h + m / 60 + s / 3600;
}
