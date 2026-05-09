import type { Dossier, Drill, Episode, Flashcard } from '../types/podcast';

export const fallbackEpisodes: Episode[] = [
  {
    id: 'operation-ghost-wire',
    title: 'Operation Ghost Wire',
    caseNumber: '#001',
    duration: '12:40',
    category: 'Phishing',
    coverGradient: 'from-orange to-yellow',
    imageUrl: null,
    audioUrl: null,
    description:
      'A suspicious support message asks for a two-factor code. Decode the clues, spot the pressure tactics, and close the case.',
    interactions: [
      {
        id: 'ghost-wire-2fa',
        timestamp: 15,
        question:
          'A DM from "Support" asks for your 2FA code to "verify your account." What is the move?',
        options: [
          'Send the code because they sound official',
          'Ignore and report the message',
          'Send a fake code to mess with them'
        ],
        correctAnswer: 'Ignore and report the message',
        explanation:
          'Real support teams will never ask for your 2FA code. That code is the last wall between attackers and your account.'
      }
    ]
  },
  {
    id: 'the-free-skin-trap',
    title: 'The Free Skin Trap',
    caseNumber: '#002',
    duration: '09:18',
    category: 'Gaming',
    coverGradient: 'from-cyan to-blue',
    imageUrl: null,
    audioUrl: null,
    description:
      'A giveaway link promises rare loot, but the URL and login prompt tell a different story.',
    interactions: []
  },
  {
    id: 'deepfake-distress-call',
    title: 'Deepfake Distress Call',
    caseNumber: '#003',
    duration: '14:05',
    category: 'AI Safety',
    coverGradient: 'from-purple to-blue',
    imageUrl: null,
    audioUrl: null,
    description:
      'A voice note sounds exactly like a friend asking for money. Verify the channel before taking action.',
    interactions: []
  }
];

export const fallbackDrills: Drill[] = [
  {
    id: 1,
    title: 'Prize Link Panic',
    category: 'Phishing',
    content:
      'You get a text: "You won a free console. Claim in 10 minutes: bit.ly/prize-login"',
    description: 'Spot the pressure and suspicious link.',
    isScam: true,
    explanation:
      'Unexpected prizes, shortened links, and urgency are classic phishing signals.',
    xpReward: 25,
    timeLimit: 60,
    type: 'scenario'
  },
  {
    id: 2,
    title: 'School Portal Reset',
    category: 'Accounts',
    content:
      'Your school portal opens at the normal domain and asks you to rotate your password after 180 days.',
    description: 'Check whether the source and request make sense.',
    isScam: false,
    explanation:
      'A known domain and expected security reset can be safe when you navigated there directly.',
    xpReward: 25,
    timeLimit: 60,
    type: 'scenario'
  }
];

export const fallbackFlashcards: Flashcard[] = [
  {
    id: 1,
    term: 'Phishing',
    definition:
      'A trick that impersonates a trusted person or service to steal credentials, money, or private data.',
    category: 'Threats',
    difficulty: 'Starter'
  },
  {
    id: 2,
    term: '2FA Code',
    definition:
      'A temporary security code that should never be shared with anyone, including people claiming to be support.',
    category: 'Accounts',
    difficulty: 'Starter'
  },
  {
    id: 3,
    term: 'Deepfake',
    definition:
      'AI-generated media that imitates a real person; verify urgent requests through a separate trusted channel.',
    category: 'AI Safety',
    difficulty: 'Intermediate'
  }
];

export const fallbackDossiers: Dossier[] = Array.from({ length: 15 }).flatMap((_, index) => {
  const missionNumber = index + 1;

  return [
    {
      id: `phishing-${missionNumber}`,
      dossierNumber: 1,
      title: 'Phishing Patterns',
      missionNumber,
      question: `Mission ${missionNumber}: A message claims your account is locked. What do you do?`,
      safeOption: 'Report & block the sender',
      dangerOption: 'Click the link to unlock'
    },
    {
      id: `passwords-${missionNumber}`,
      dossierNumber: 2,
      title: 'Password Hygiene Kit',
      missionNumber,
      question: `Mission ${missionNumber}: A site asks you to set a password. What is safest?`,
      safeOption: 'Use a unique passphrase from your manager',
      dangerOption: 'Reuse your email password'
    },
    {
      id: `trackers-${missionNumber}`,
      dossierNumber: 3,
      title: 'Tracker Anatomy',
      missionNumber,
      question: `Mission ${missionNumber}: A free app requests location 24/7. What is your move?`,
      safeOption: 'Deny background location access',
      dangerOption: 'Allow always for convenience'
    },
    {
      id: `deepfakes-${missionNumber}`,
      dossierNumber: 4,
      title: 'Deepfake Detection',
      missionNumber,
      question: `Mission ${missionNumber}: A video of a friend asks for money urgently. What do you do?`,
      safeOption: 'Verify via a separate trusted channel',
      dangerOption: 'Send the funds immediately'
    }
  ];
});
