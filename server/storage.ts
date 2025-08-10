import { type User, type InsertUser, type Station, type InsertStation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Station methods
  getStations(): Promise<Station[]>;
  getStation(id: string): Promise<Station | undefined>;
  createStation(station: InsertStation): Promise<Station>;
  updateStation(id: string, station: Partial<InsertStation>): Promise<Station | undefined>;
  deleteStation(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private stations: Map<string, Station>;

  constructor() {
    this.users = new Map();
    this.stations = new Map();
    
    // Add some default stations
    this.seedStations();
  }

  private seedStations() {
    const defaultStations: InsertStation[] = [
      {
        name: "Classic Rock 101.5",
        url: "https://streams.the80s.com/",
        description: "The best classic rock hits",
        bitrate: "128 kbps"
      },
      {
        name: "Jazz FM 88.3",
        url: "https://jazz-wr01.ice.infomaniak.ch/jazz-wr01-128.mp3",
        description: "Smooth jazz and contemporary",
        bitrate: "128 kbps"
      },
      {
        name: "Electronic Beats",
        url: "https://streams.fluxfm.de/Fluxfm/mp3-320/radioplayer",
        description: "Electronic and dance music",
        bitrate: "320 kbps"
      }
    ];

    defaultStations.forEach(station => {
      const id = randomUUID();
      const newStation: Station = { 
        ...station, 
        id,
        description: station.description || null,
        bitrate: station.bitrate || null
      };
      this.stations.set(id, newStation);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getStations(): Promise<Station[]> {
    return Array.from(this.stations.values());
  }

  async getStation(id: string): Promise<Station | undefined> {
    return this.stations.get(id);
  }

  async createStation(insertStation: InsertStation): Promise<Station> {
    const id = randomUUID();
    const station: Station = { 
      ...insertStation, 
      id,
      description: insertStation.description || null,
      bitrate: insertStation.bitrate || null
    };
    this.stations.set(id, station);
    return station;
  }

  async updateStation(id: string, updateData: Partial<InsertStation>): Promise<Station | undefined> {
    const station = this.stations.get(id);
    if (!station) return undefined;

    const updatedStation: Station = { ...station, ...updateData };
    this.stations.set(id, updatedStation);
    return updatedStation;
  }

  async deleteStation(id: string): Promise<boolean> {
    return this.stations.delete(id);
  }
}

export const storage = new MemStorage();
