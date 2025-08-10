import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Station } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "../hooks/use-audio-player";
import CurrentlyPlaying from "../components/radio/currently-playing";
import StationsList from "../components/radio/stations-list";
import AudioControls from "../components/radio/audio-controls";
import AddStationModal from "../components/radio/add-station-modal";
import { Settings, Plus, Loader2 } from "lucide-react";

export default function RadioPlayer() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { toast } = useToast();

  const {
    isPlaying,
    isLoading: audioLoading,
    volume,
    error: audioError,
    play,
    pause,
    setVolume,
    load,
    setMediaSessionHandlers
  } = useAudioPlayer();

  const { data: stations = [], isLoading } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (stationId: string) => {
      await apiRequest('DELETE', `/api/stations/${stationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      toast({
        title: "Success",
        description: "Station deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete station",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (audioError) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to radio station. Please try another station.",
        variant: "destructive",
      });
    }
  }, [audioError, toast]);

  const handlePlayStation = (station: Station) => {
    if (selectedStation?.id === station.id && isPlaying) {
      pause();
    } else {
      setSelectedStation(station);
      load(station.url, station);
      play();
    }
  };

  const handleDeleteStation = (stationId: string) => {
    if (selectedStation?.id === stationId) {
      pause();
      setSelectedStation(null);
    }
    deleteMutation.mutate(stationId);
  };

  const handlePreviousStation = () => {
    if (!selectedStation || stations.length === 0) return;
    
    const currentIndex = stations.findIndex((s: Station) => s.id === selectedStation.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : stations.length - 1;
    const prevStation = stations[prevIndex];
    
    handlePlayStation(prevStation);
  };

  const handleNextStation = () => {
    if (!selectedStation || stations.length === 0) return;
    
    const currentIndex = stations.findIndex((s: Station) => s.id === selectedStation.id);
    const nextIndex = currentIndex < stations.length - 1 ? currentIndex + 1 : 0;
    const nextStation = stations[nextIndex];
    
    handlePlayStation(nextStation);
  };

  // Set up media session handlers for car audio integration
  useEffect(() => {
    setMediaSessionHandlers({
      onNext: handleNextStation,
      onPrevious: handlePreviousStation,
    });
  }, [setMediaSessionHandlers, handleNextStation, handlePreviousStation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading stations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-background-surface text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📻</div>
            <h1 className="text-xl font-medium">Radio Player</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-primary-dark transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-32 min-h-screen">
        <CurrentlyPlaying
          station={selectedStation}
          isPlaying={isPlaying}
          isLoading={audioLoading}
        />
        
        <StationsList
          stations={stations}
          selectedStation={selectedStation}
          isPlaying={isPlaying}
          onPlayStation={handlePlayStation}
          onDeleteStation={handleDeleteStation}
          onEditStation={() => {}}
        />
      </main>

      {/* Audio Controls */}
      <AudioControls
        isPlaying={isPlaying}
        volume={volume}
        onPlayPause={() => isPlaying ? pause() : play()}
        onVolumeChange={setVolume}
        onPrevious={handlePreviousStation}
        onNext={handleNextStation}
        canNavigate={stations.length > 1}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Station Modal */}
      <AddStationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Loading Overlay */}
      {audioLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-foreground">Connecting to station...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
