import { Audio, AVPlaybackStatus } from 'expo-av';
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
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentRef = useRef<Track | null>(null);
  const triggeredRef = useRef<Set<string>>(new Set());
  const [current, setCurrent] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingInteraction, setPendingInteraction] = useState<Interaction | null>(null);

  const unload = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    return () => {
      unload().catch(() => undefined);
    };
  }, [unload]);

  const handleStatus = useCallback(
    async (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      setIsPlaying(status.isPlaying);
      if (status.durationMillis) {
        setProgress((status.positionMillis / status.durationMillis) * 100);
      }

      const active = currentRef.current;
      if (!active?.interactions.length || !status.positionMillis) return;

      const currentSecond = Math.floor(status.positionMillis / 1000);
      const interaction = active.interactions.find((item) => {
        const key = `${active.id}:${item.id}`;
        return !triggeredRef.current.has(key) && currentSecond >= item.timestamp;
      });

      if (interaction && soundRef.current) {
        triggeredRef.current.add(`${active.id}:${interaction.id}`);
        await soundRef.current.pauseAsync();
        setPendingInteraction(interaction);
      }
    },
    []
  );

  const playTrack = useCallback(
    async (track: Track) => {
      if (current?.id === track.id && soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
        }
        return;
      }

      await unload();
      setCurrent(track);
      setProgress(0);
      triggeredRef.current = new Set();

      if (!track.audioUrl) return;

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true },
        handleStatus
      );
      soundRef.current = sound;
    },
    [current?.id, handleStatus, unload]
  );

  const toggle = useCallback(async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, []);

  const resumeFromInteraction = useCallback(async () => {
    setPendingInteraction(null);
    await soundRef.current?.playAsync();
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
