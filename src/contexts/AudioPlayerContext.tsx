import { createAudioPlayer } from 'expo-audio';
import type { AudioPlayer, AudioStatus } from 'expo-audio';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

import type { Episode, Interaction } from '../types/podcast';

type Track = Pick<Episode, 'id' | 'title' | 'audioUrl' | 'interactions'>;

type AudioContextValue = {
  current: Track | null;
  isPlaying: boolean;
  progress: number;
  pendingInteraction: Interaction | null;
  playTrack: (track: Track) => Promise<void>;
  toggle: () => Promise<void>;
  dismissInteraction: () => void;
  resumeFromInteraction: () => Promise<void>;
};

const AudioPlayerContext = createContext<AudioContextValue | null>(null);

export function AudioPlayerProvider({ children }: PropsWithChildren) {
  const playerRef = useRef<AudioPlayer | null>(null);
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const currentRef = useRef<Track | null>(null);
  const triggeredRef = useRef<Set<string>>(new Set());
  const [current, setCurrent] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingInteraction, setPendingInteraction] = useState<Interaction | null>(null);

  const unload = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove();
      playerRef.current = null;
    }
  }, []);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  const handleStatus = useCallback(
    (status: AudioStatus) => {
      if (!status.isLoaded) return;

      setIsPlaying(status.playing);
      if (status.duration) {
        setProgress((status.currentTime / status.duration) * 100);
      }

      const active = currentRef.current;
      if (!active?.interactions.length || !status.currentTime) return;

      const currentSecond = Math.floor(status.currentTime);
      const interaction = active.interactions.find((item) => {
        const key = `${active.id}:${item.id}`;
        return !triggeredRef.current.has(key) && currentSecond >= item.timestamp;
      });

      if (interaction && playerRef.current) {
        triggeredRef.current.add(`${active.id}:${interaction.id}`);
        playerRef.current.pause();
        setPendingInteraction(interaction);
      }
    },
    []
  );

  const playTrack = useCallback(
    async (track: Track) => {
      if (current?.id === track.id && playerRef.current) {
        if (playerRef.current.playing) {
          playerRef.current.pause();
        } else {
          playerRef.current.play();
        }
        return;
      }

      unload();
      setCurrent(track);
      setProgress(0);
      setIsPlaying(false);
      triggeredRef.current = new Set();

      if (!track.audioUrl) return;

      const player = createAudioPlayer({ uri: track.audioUrl }, { updateInterval: 500 });
      subscriptionRef.current = player.addListener('playbackStatusUpdate', handleStatus);
      playerRef.current = player;
      player.play();
    },
    [current?.id, handleStatus, unload]
  );

  const toggle = useCallback(async () => {
    if (!playerRef.current) return;
    if (playerRef.current.playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  }, []);

  const resumeFromInteraction = useCallback(async () => {
    setPendingInteraction(null);
    playerRef.current?.play();
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        current,
        isPlaying,
        progress,
        pendingInteraction,
        playTrack,
        toggle,
        dismissInteraction: () => setPendingInteraction(null),
        resumeFromInteraction
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  }

  return context;
}
