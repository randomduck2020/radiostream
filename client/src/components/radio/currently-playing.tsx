import { Station } from "@shared/schema";
import { RadioIcon, Loader2 } from "lucide-react";

interface CurrentlyPlayingProps {
  station: Station | null;
  isPlaying: boolean;
  isLoading: boolean;
}

export default function CurrentlyPlaying({ station, isPlaying, isLoading }: CurrentlyPlayingProps) {
  if (!station) {
    return (
      <div className="bg-surface shadow-sm border-b border-border">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <RadioIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-medium text-muted-foreground">No station selected</h2>
              <p className="text-sm text-muted-foreground">Choose a station to start listening</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface shadow-sm border-b border-border">
      <div className="px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <RadioIcon className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-foreground truncate">
              {station.name}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {station.description || "Radio Station"}
            </p>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isLoading ? 'bg-yellow-500 animate-pulse' : 
                isPlaying ? 'bg-green-500 animate-pulse' : 
                'bg-gray-400'
              }`} />
              <span>
                {isLoading ? 'Connecting...' : 
                 isPlaying ? 'Playing' : 
                 'Stopped'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
