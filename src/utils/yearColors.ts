const YEAR_PALETTE: Record<number, string> = {
  2022: '#7dd3fc',
  2023: '#a78bfa',
  2024: '#f472b6',
  2025: '#fbbf24',
  2026: '#34d399',
};

const FALLBACK = '#94a3b8';

export function colorForDate(date: string): string {
  const year = Number(date.slice(0, 4));
  return YEAR_PALETTE[year] ?? FALLBACK;
}

export function colorForYear(year: number): string {
  return YEAR_PALETTE[year] ?? FALLBACK;
}

export const timelineYears = [2022, 2023, 2024, 2025, 2026];
