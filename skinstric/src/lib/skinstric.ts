export type Scores = Record<string, number>;

export type Analysis = {
  race: Scores;
  age: Scores;
  gender: Scores;
};

export type UserInfo = { name: string; location: string };

// Letters (any language), spaces, hyphens, apostrophes and periods only.
const TEXT_PATTERN = new RegExp("^\\p{L}[\\p{L}\\s'.-]*$", "u");

// Returns an error message, or "" when the value is fine.
export function validateText(value: string, label: string) {
  const v = value.trim();
  if (v.length < 2) return `${label} must be at least 2 letters.`;
  if (/\d/.test(v)) return `${label} can’t contain numbers.`;
  if (!TEXT_PATTERN.test(v)) {
    return `${label} can only contain letters, spaces, hyphens and apostrophes.`;
  }
  return "";
}

// Highest score first.
export function sortScores(scores: Scores): [string, number][] {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

// 0.2525 -> "25.25%"
export function percent(score: number) {
  return `${(score * 100).toFixed(2)}%`;
}

// "southeast asian" -> "Southeast Asian"
export function titleCase(text: string) {
  return text.replace(/\b\w/g, (c) => c.toUpperCase());
}
