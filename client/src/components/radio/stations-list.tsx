import { Station } from "@shared/schema";
import { Play, Pause, Edit, Trash2, RadioIcon } from "lucide-react";

interface StationsListProps {
  stations: Station[];
  selectedStation: Station | null;
  isPlaying: boolean;
  onPlayStation: (station: Station) => void;
  onDeleteStation: (stationId: string) => void;
  onEditStation: (station: Station) => void;
}

export default function StationsList({
  stations,
  selectedStation,
  isPlaying,
  onPlayStation,
  onDeleteStation,
  onEditStation,
}: StationsListProps) {
  if (stations.length === 0) {
    return (
      <div className="px-4 py-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <RadioIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No stations yet</h3>
          <p className="text-muted-foreground mb-6">Add your first radio station to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">My Stations</h3>
        <span className="text-sm text-muted-foreground">
          {stations.length} station{stations.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {stations.map((station) => {
          const isCurrentStation = selectedStation?.id === station.id;
          const isCurrentlyPlaying = isCurrentStation && isPlaying;

          return (
            <div
              key={station.id}
              className="bg-surface rounded-lg shadow-sm border border-border p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onPlayStation(station)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors ${
                    isCurrentlyPlaying
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-muted text-muted-foreground hover:bg-primary hover:text-white'
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {station.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {station.description || "Radio Station"}
                  </p>
                  {station.bitrate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {station.bitrate}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditStation(station)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteStation(station.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
