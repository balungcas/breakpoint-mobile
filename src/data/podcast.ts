import type { Episode, EpisodeCategory, ListeningPlatform } from '../types/podcast';

export const podcastProfile = {
  name: 'Breakpoint Podcast',
  tagline: 'Navigating modern life with common sense.',
  insight: 'Navigating modern life with practical advice and insights.',
  description:
    'Breakpoint brings grounded conversations, practical ideas, and thoughtful perspectives to the everyday decisions that shape modern life.',
  email: 'breakpointpodcast@gmail.com',
  phone: '+15013187920',
  displayPhone: '+1 (501) 318-7920',
  website: 'https://www.bp-pod.com/',
  copyright: '© 2024. All rights reserved.'
};

export const listeningPlatforms: ListeningPlatform[] = [
  {
    id: 'website',
    label: 'Official Website',
    url: podcastProfile.website
  },
  {
    id: 'email',
    label: 'Email the Show',
    url: `mailto:${podcastProfile.email}`
  },
  {
    id: 'phone',
    label: 'Call or Text',
    url: `tel:${podcastProfile.phone}`
  }
];

export const episodeCategories: Array<'All' | EpisodeCategory> = [
  'All',
  'Culture',
  'Technology',
  'Wellbeing',
  'Relationships',
  'Work'
];

export const episodes: Episode[] = [
  {
    id: 'modern-life-common-sense',
    title: 'Modern Life, Common Sense',
    subtitle: 'A practical framework for better everyday decisions.',
    description:
      'A foundational Breakpoint conversation about slowing down, asking better questions, and using common sense as a practical tool for navigating a noisy world.',
    duration: '32 min',
    publishedAt: '2024-09-18',
    category: 'Culture',
    hosts: ['Breakpoint Podcast'],
    featured: true,
    takeaways: [
      'Use simple decision filters before reacting to urgency.',
      'Separate useful advice from online noise.',
      'Build a personal rhythm for reflection and follow-through.'
    ]
  },
  {
    id: 'healthy-tech-boundaries',
    title: 'Healthy Tech Boundaries',
    subtitle: 'Making technology serve your life instead of steering it.',
    description:
      'A focused discussion about notifications, attention, and realistic boundaries that help families, creators, and professionals stay present.',
    duration: '28 min',
    publishedAt: '2024-08-27',
    category: 'Technology',
    hosts: ['Breakpoint Podcast'],
    featured: true,
    takeaways: [
      'Audit the apps that interrupt your highest-value work.',
      'Create device-free defaults for meals and rest.',
      'Choose tools that support your values instead of replacing them.'
    ]
  },
  {
    id: 'better-conversations',
    title: 'Better Conversations in Hard Moments',
    subtitle: 'Practical ways to listen, respond, and move forward.',
    description:
      'This episode explores how to keep conversations constructive when opinions differ, emotions rise, or the stakes feel personal.',
    duration: '35 min',
    publishedAt: '2024-08-06',
    category: 'Relationships',
    hosts: ['Breakpoint Podcast'],
    takeaways: [
      'Start by naming the shared goal.',
      'Ask one clarifying question before making your point.',
      'End with the next useful action, not the last clever word.'
    ]
  },
  {
    id: 'resilience-without-burnout',
    title: 'Resilience Without Burnout',
    subtitle: 'Sustainable habits for demanding seasons.',
    description:
      'A grounded look at energy management, routines, and the difference between healthy persistence and running on empty.',
    duration: '30 min',
    publishedAt: '2024-07-16',
    category: 'Wellbeing',
    hosts: ['Breakpoint Podcast'],
    takeaways: [
      'Measure resilience by recovery, not constant output.',
      'Protect sleep and movement as first-order responsibilities.',
      'Ask for help before pressure becomes crisis.'
    ]
  },
  {
    id: 'work-that-fits',
    title: 'Work That Fits Real Life',
    subtitle: 'Aligning ambition, responsibility, and limits.',
    description:
      'Breakpoint examines how to think clearly about work, personal responsibility, and success without letting productivity become identity.',
    duration: '31 min',
    publishedAt: '2024-06-25',
    category: 'Work',
    hosts: ['Breakpoint Podcast'],
    takeaways: [
      'Define success in terms of contribution and sustainability.',
      'Keep a short list of non-negotiable responsibilities.',
      'Review commitments before adding new ones.'
    ]
  }
];

export const featuredEpisodes = episodes.filter((episode) => episode.featured);
