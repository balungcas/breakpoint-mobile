export type AgentRank = {
  level: number;
  title: string;
  fullTitle: string;
  bg: string;
  accent: string;
  ink: string;
  floor: number;
  ceiling: number | null;
};

const ranks: AgentRank[] = [
  {
    level: 1,
    title: 'Rookie',
    fullTitle: 'Level 1: Rookie',
    bg: '#01C3FF',
    accent: '#FE7A15',
    ink: '#1D0F5A',
    floor: 0,
    ceiling: 100
  },
  {
    level: 2,
    title: 'Field Agent',
    fullTitle: 'Level 2: Field Agent',
    bg: '#D4DD18',
    accent: '#2772F1',
    ink: '#1D0F5A',
    floor: 100,
    ceiling: 500
  },
  {
    level: 3,
    title: 'Cyber Detective',
    fullTitle: 'Level 3: Cyber Detective',
    bg: '#FE7A15',
    accent: '#01C3FF',
    ink: '#FFFFFF',
    floor: 500,
    ceiling: 1000
  },
  {
    level: 4,
    title: 'Master Operative',
    fullTitle: 'Level 4: Master Operative',
    bg: '#1D0F5A',
    accent: '#FFD25B',
    ink: '#FFFFFF',
    floor: 1000,
    ceiling: null
  }
];

export function getAgentRank(totalXp: number) {
  const xp = Math.max(0, totalXp | 0);
  const rank = ranks.find((item) => item.ceiling === null || xp < item.ceiling) ?? ranks[0];
  const next = ranks[rank.level] ?? null;
  const segments = 10;

  if (!next) {
    return {
      rank,
      next,
      xp,
      xpToNext: 0,
      progressPct: 100,
      segments,
      filledSegments: segments
    };
  }

  const span = next.floor - rank.floor;
  const progressPct = Math.min(100, Math.max(0, ((xp - rank.floor) / span) * 100));

  return {
    rank,
    next,
    xp,
    xpToNext: Math.max(0, next.floor - xp),
    progressPct,
    segments,
    filledSegments: Math.round((progressPct / 100) * segments)
  };
}
