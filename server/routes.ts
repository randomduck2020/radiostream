import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all stations
  app.get("/api/stations", async (req, res) => {
    try {
      const stations = await storage.getStations();
      res.json(stations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stations" });
    }
  });

  // Get a specific station
  app.get("/api/stations/:id", async (req, res) => {
    try {
      const station = await storage.getStation(req.params.id);
      if (!station) {
        return res.status(404).json({ message: "Station not found" });
      }
      res.json(station);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch station" });
    }
  });

  // Create a new station
  app.post("/api/stations", async (req, res) => {
    try {
      const validatedData = insertStationSchema.parse(req.body);
      const station = await storage.createStation(validatedData);
      res.status(201).json(station);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid station data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create station" });
    }
  });

  // Update a station
  app.patch("/api/stations/:id", async (req, res) => {
    try {
      const updateData = insertStationSchema.partial().parse(req.body);
      const station = await storage.updateStation(req.params.id, updateData);
      if (!station) {
        return res.status(404).json({ message: "Station not found" });
      }
      res.json(station);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid station data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update station" });
    }
  });

  // Delete a station
  app.delete("/api/stations/:id", async (req, res) => {
    try {
      const success = await storage.deleteStation(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Station not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete station" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
