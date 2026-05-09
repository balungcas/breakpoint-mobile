export function formatEpisodeDate(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export function normalizeSearchTerm(value: string): string {
  return value.trim().toLowerCase();
}
