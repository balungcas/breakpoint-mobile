export type EpisodeCategory =
  | 'Culture'
  | 'Technology'
  | 'Wellbeing'
  | 'Relationships'
  | 'Work';

export type ListeningPlatform = {
  id: string;
  label: string;
  url: string;
};

export type Episode = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  publishedAt: string;
  category: EpisodeCategory;
  hosts: string[];
  featured?: boolean;
  audioUrl?: string;
  transcriptUrl?: string;
  takeaways: string[];
};
