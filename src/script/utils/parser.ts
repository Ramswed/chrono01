import { parseDuration } from "./time";

export function getStartTimeFromRow(row: HTMLTableRowElement): Date | null {
  const cells = row.querySelectorAll("td");

  let startText = "";
  let endText = "";

  for (let i = 0; i < cells.length; i++) {
    const text = cells[i]?.textContent?.trim() || "";
    if (text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
      if (!startText) {
        startText = text;
      } else if (!endText) {
        endText = text;
      }
    } else if (text === "-" && startText) {
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

export function findDateCellIndex(cells: NodeListOf<HTMLTableCellElement>): {
  dateText: string;
  dateCellIndex: number;
} | null {
  for (let i = 0; i < cells.length; i++) {
    const text = cells[i]?.textContent?.trim() || "";
    if (
      text.includes("janvier") ||
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
      text.includes("décembre")
    ) {
      return { dateText: text, dateCellIndex: i };
    }
  }
  return null;
}

export function parseFrenchDate(dateText: string): Date | null {
  const dateParts = dateText.split(" ");
  if (dateParts.length < 4) {
    return null;
  }

  const day = parseInt(dateParts[1]);
  const monthName = dateParts[2].toLowerCase();
  const year = parseInt(dateParts[3]);

  const monthMap: Record<string, number> = {
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

  const month: number | undefined = monthMap[monthName];
  if (month === undefined || isNaN(day) || isNaN(year)) {
    return null;
  }

  const date = new Date(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function extractTimeInfo(
  cells: NodeListOf<HTMLTableCellElement>,
  dateCellIndex: number
): {
  startText: string;
  endText: string;
  durationText: string;
} {
  let startText = "";
  let endText = "";
  let durationText = "";

  if (dateCellIndex + 3 < cells.length) {
    startText = cells[dateCellIndex + 1]?.textContent?.trim() || "";
    endText = cells[dateCellIndex + 2]?.textContent?.trim() || "";
    durationText = cells[dateCellIndex + 3]?.textContent?.trim() || "";
  } else {
    for (let i = 0; i < cells.length; i++) {
      const text = cells[i]?.textContent?.trim() || "";
      if (text.includes(":") && text.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
        durationText = text;
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

export function extractTotalFromSummary(
  rows: NodeListOf<HTMLTableRowElement>
): number | null {
  let totalFromSummary: number | null = null;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length === 3) {
      const cell1 = cells[1]?.textContent?.trim() || "";
      const cell2 = cells[2]?.textContent?.trim() || "";
      if (cell1.includes("Heures de formation") && cell2.includes(":")) {
        const total = parseDuration(cell2);
        if (!isNaN(total) && total > 0) {
          if (totalFromSummary === null) {
            totalFromSummary = total;
          }
        }
      }
    }
  });

  return totalFromSummary;
}
