export type Interaction = {
  id: string;
  timestamp: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Episode = {
  id: string;
  title: string;
  caseNumber: string;
  duration: string;
  category: string;
  coverGradient: string;
  imageUrl: string | null;
  audioUrl: string | null;
  description: string;
  hostId?: string | null;
  hostName?: string | null;
  interactions: Interaction[];
};

export type Drill = {
  id: number;
  title: string;
  category: string | null;
  content: string | null;
  description: string | null;
  isScam: boolean;
  explanation: string | null;
  xpReward: number;
  timeLimit?: number;
  type?: string | null;
};

export type Flashcard = {
  id: number;
  term: string;
  definition: string;
  category: string | null;
  difficulty: string | null;
};

export type Dossier = {
  id: string;
  dossierNumber: number;
  title: string;
  missionNumber: number;
  question: string;
  safeOption: string;
  dangerOption: string;
};

export type GuestProgress = {
  xp: number;
  completedCases: string[];
};
