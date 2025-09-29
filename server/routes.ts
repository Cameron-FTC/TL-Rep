import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for audio file uploads
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${uniqueSuffix}.webm`);
  }
});

const upload = multer({ storage: audioStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Get specific session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Create new session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Update session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const updates = insertSessionSchema.partial().parse(req.body);
      const session = await storage.updateSession(id, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Upload audio file
  app.post("/api/audio/upload", upload.single('audio'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }
      
      const audioUrl = `/uploads/audio/${req.file.filename}`;
      res.json({ audioUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload audio file" });
    }
  });

  // Serve uploaded audio files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(process.cwd(), 'uploads', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Delete session
  app.delete("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid session ID" });
      }
      
      const deleted = await storage.deleteSession(id);
      if (!deleted) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
