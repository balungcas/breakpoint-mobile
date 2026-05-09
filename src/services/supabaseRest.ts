import { fallbackDossiers, fallbackDrills, fallbackEpisodes, fallbackFlashcards } from '../data/fallback';
import type { Dossier, Drill, Episode, Flashcard, Interaction } from '../types/podcast';
import { supabasePublishableKey, supabaseUrl } from './supabaseConfig';

const restBase = supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/rest/v1` : '';

async function rest<T>(path: string): Promise<T> {
  if (!restBase || !supabasePublishableKey) {
    throw new Error('Missing Supabase REST configuration');
  }

  const response = await fetch(`${restBase}/${path}`, {
    headers: {
      apikey: supabasePublishableKey,
      Authorization: `Bearer ${supabasePublishableKey}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

type InteractionRow = {
  id: string;
  timestamp: number;
  question: string;
  options: unknown;
  correct_answer: string | null;
  explanation: string | null;
};

type EpisodeRow = {
  id: string;
  title: string;
  case_number: string;
  duration: string;
  category: string;
  cover_gradient: string;
  image_url: string | null;
  audio_url: string | null;
  description: string;
  host_id?: string | null;
  interactions?: InteractionRow[] | null;
};

function mapInteractions(rows: InteractionRow[] | null | undefined): Interaction[] {
  return (rows ?? [])
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((row) => ({
      id: row.id,
      timestamp: row.timestamp,
      question: row.question,
      options: Array.isArray(row.options) ? (row.options as string[]) : [],
      correctAnswer: row.correct_answer ?? '',
      explanation: row.explanation ?? ''
    }));
}

function mapEpisode(row: EpisodeRow): Episode {
  return {
    id: row.id,
    title: row.title,
    caseNumber: row.case_number,
    duration: row.duration,
    category: row.category,
    coverGradient: row.cover_gradient,
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    description: row.description,
    hostId: row.host_id ?? null,
    interactions: mapInteractions(row.interactions)
  };
}

export async function fetchEpisodes(): Promise<Episode[]> {
  try {
    const query =
      'episodes?select=id,title,case_number,duration,category,cover_gradient,image_url,audio_url,description,host_id,interactions(id,timestamp,question,options,correct_answer,explanation)&order=sort_order.asc&order=created_at.asc';
    const rows = await rest<EpisodeRow[]>(query);
    return rows.map(mapEpisode);
  } catch (error) {
    console.warn('[Breakpoint] Using fallback episodes:', error);
    return fallbackEpisodes;
  }
}

type DrillRow = {
  id: number;
  title: string;
  category: string | null;
  content: string | null;
  description: string | null;
  is_scam: boolean | null;
  explanation: string | null;
  xp_reward: number | null;
  time_limit?: number | null;
  type?: string | null;
};

export async function fetchDrills(): Promise<Drill[]> {
  try {
    const rows = await rest<DrillRow[]>(
      'drills?select=id,title,category,content,description,is_scam,explanation,xp_reward,time_limit,type&is_active=eq.true&order=id.asc'
    );
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      content: row.content,
      description: row.description,
      isScam: Boolean(row.is_scam),
      explanation: row.explanation,
      xpReward: row.xp_reward ?? 10,
      timeLimit: row.time_limit ?? 60,
      type: row.type
    }));
  } catch (error) {
    console.warn('[Breakpoint] Using fallback drills:', error);
    return fallbackDrills;
  }
}

type FlashcardRow = {
  id: number;
  term: string;
  definition: string;
  category: string | null;
  difficulty: string | null;
};

export async function fetchFlashcards(): Promise<Flashcard[]> {
  try {
    return await rest<FlashcardRow[]>(
      'flashcards?select=id,term,definition,category,difficulty&order=sort_order.asc'
    );
  } catch (error) {
    console.warn('[Breakpoint] Using fallback flashcards:', error);
    return fallbackFlashcards;
  }
}

type DossierRow = {
  id: string;
  dossier_number: number;
  title: string;
  mission_number: number;
  question: string;
  safe_option: string;
  danger_option: string;
};

export async function fetchDossiers(): Promise<Dossier[]> {
  try {
    const rows = await rest<DossierRow[]>(
      'dossiers?select=id,dossier_number,title,mission_number,question,safe_option,danger_option&order=dossier_number.asc&order=mission_number.asc'
    );
    return rows.map((row) => ({
      id: row.id,
      dossierNumber: row.dossier_number,
      title: row.title,
      missionNumber: row.mission_number,
      question: row.question,
      safeOption: row.safe_option,
      dangerOption: row.danger_option
    }));
  } catch (error) {
    console.warn('[Breakpoint] Using fallback dossiers:', error);
    return fallbackDossiers;
  }
}
