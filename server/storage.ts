import { sessions, type Session, type InsertSession } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: number): Promise<Session | undefined>;
  getAllSessions(): Promise<Session[]>;
  updateSession(id: number, updates: Partial<InsertSession>): Promise<Session | undefined>;
  deleteSession(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private sessions: Map<number, Session>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.currentId = 1;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentId++;
    const session: Session = {
      id,
      type: insertSession.type,
      scenario: insertSession.scenario,
      lessonValue: insertSession.lessonValue || null,
      problemType: insertSession.problemType || null,
      hasIdea: insertSession.hasIdea,
      ideaDescription: insertSession.ideaDescription || null,
      audioFiles: insertSession.audioFiles || [],
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateSession(id: number, updates: Partial<InsertSession>): Promise<Session | undefined> {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;

    const updated: Session = { 
      ...existing, 
      ...updates,
      audioFiles: updates.audioFiles || existing.audioFiles
    };
    this.sessions.set(id, updated);
    return updated;
  }

  async deleteSession(id: number): Promise<boolean> {
    return this.sessions.delete(id);
  }
}

export const storage = new MemStorage();
