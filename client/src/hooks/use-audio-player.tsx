import { useState, useRef, useCallback, useEffect } from "react";
import { Station } from "@shared/schema";

export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  error: string | null;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  load: (url: string, station?: Station) => void;
  setMediaSessionHandlers: (handlers: {
    onNext?: () => void;
    onPrevious?: () => void;
  }) => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const currentStationRef = useRef<Station | null>(null);
  const mediaSessionHandlersRef = useRef<{
    onNext?: () => void;
    onPrevious?: () => void;
  }>({});

  const updateMediaSession = useCallback((station?: Station) => {
    if ('mediaSession' in navigator && station) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: station.description || "Internet Radio",
        album: "Radio Player",
        artwork: [
          {
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#3B82F6"/>
                <circle cx="50" cy="50" r="20" fill="white"/>
                <text x="50" y="55" text-anchor="middle" fill="#3B82F6" font-size="12" font-family="Arial">📻</text>
              </svg>
            `),
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      });

      // Set playback state
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    if (audioRef.current) {
      setError(null);
      audioRef.current.play().catch(() => {
        setError("Failed to play audio stream");
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const createAudioElement = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volume / 100;
    
    // Event listeners
    audio.addEventListener("canplay", () => {
      setIsLoading(false);
      setError(null);
    });

    audio.addEventListener("playing", () => {
      setIsPlaying(true);
      setIsLoading(false);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("error", () => {
      setError("Failed to load audio stream");
      setIsLoading(false);
      setIsPlaying(false);
    });

    audio.addEventListener("loadstart", () => {
      setIsLoading(true);
      setError(null);
    });

    audio.addEventListener("waiting", () => {
      setIsLoading(true);
    });

    audio.addEventListener("canplaythrough", () => {
      setIsLoading(false);
    });

    audioRef.current = audio;
    return audio;
  }, [volume]);

  const setMediaSessionHandlers = useCallback((handlers: {
    onNext?: () => void;
    onPrevious?: () => void;
  }) => {
    mediaSessionHandlersRef.current = handlers;

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => {
          play();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          pause();
        });

        if (handlers.onNext) {
          navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext);
        }

        if (handlers.onPrevious) {
          navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrevious);
        }

        // Optional: Add seek handlers for better car integration
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
          if (handlers.onPrevious) {
            handlers.onPrevious();
          }
        });

        navigator.mediaSession.setActionHandler('seekforward', (details) => {
          if (handlers.onNext) {
            handlers.onNext();
          }
        });
      } catch (error) {
        console.log('Media Session API not fully supported');
      }
    }
  }, [play, pause]);

  const load = useCallback((url: string, station?: Station) => {
    if (currentUrlRef.current === url && audioRef.current) {
      return;
    }

    currentUrlRef.current = url;
    currentStationRef.current = station || null;
    const audio = createAudioElement(url);
    audio.src = url;
    audio.load();
    
    // Update media session metadata
    updateMediaSession(station);
  }, [createAudioElement, updateMediaSession]);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Update media session when playing state changes
  useEffect(() => {
    updateMediaSession(currentStationRef.current || undefined);
  }, [isPlaying, updateMediaSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    volume,
    error,
    play,
    pause,
    setVolume,
    load,
    setMediaSessionHandlers,
  };
}