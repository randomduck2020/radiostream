import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { insertStationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddStationModal({ isOpen, onClose }: AddStationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    bitrate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const addStationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/stations', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
      toast({
        title: "Success",
        description: "Station added successfully",
      });
      onClose();
      setFormData({ name: "", url: "", description: "", bitrate: "" });
      setErrors({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add station",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = insertStationSchema.parse({
        name: formData.name,
        url: formData.url,
        ...(formData.description && { description: formData.description }),
        ...(formData.bitrate && { bitrate: formData.bitrate }),
      });
      addStationMutation.mutate(validatedData);
    } catch (error: any) {
      if (error.issues) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-surface rounded-t-xl sm:rounded-xl w-full sm:w-96 max-w-full p-6 shadow-xl transform transition-transform">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-foreground">Add Station</h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Station Name *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g. My Favorite FM"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="url" className="text-sm font-medium text-foreground">
              Stream URL *
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              placeholder="https://stream.example.com/radio"
              className="mt-1"
            />
            {errors.url && (
              <p className="text-sm text-destructive mt-1">{errors.url}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Genre or description"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bitrate" className="text-sm font-medium text-foreground">
              Bitrate
            </Label>
            <Input
              id="bitrate"
              type="text"
              value={formData.bitrate}
              onChange={(e) => handleInputChange("bitrate", e.target.value)}
              placeholder="e.g. 128 kbps"
              className="mt-1"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addStationMutation.isPending}
              className="flex-1 bg-primary hover:bg-primary-dark"
            >
              {addStationMutation.isPending ? "Adding..." : "Add Station"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
