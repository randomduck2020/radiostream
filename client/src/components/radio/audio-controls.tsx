import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2 } from "lucide-react";

interface AudioControlsProps {
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  canNavigate: boolean;
}

export default function AudioControls({
  isPlaying,
  volume,
  onPlayPause,
  onVolumeChange,
  onPrevious,
  onNext,
  canNavigate,
}: AudioControlsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface shadow-2xl border-t border-border z-40">
      {/* Progress Bar */}
      <div className="relative h-1 bg-muted">
        <div className="absolute left-0 top-0 h-full bg-primary w-0 transition-all duration-300" />
      </div>
      
      <div className="px-4 py-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-6 mb-4">
          <button
            onClick={onPrevious}
            disabled={!canNavigate}
            className="p-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:hover:text-muted-foreground"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={onNext}
            disabled={!canNavigate}
            className="p-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:hover:text-muted-foreground"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          )}
          
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
