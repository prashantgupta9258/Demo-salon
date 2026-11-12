import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as xlsx from "xlsx";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(process.cwd(), "database.json");
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-12345";
const ADMIN_PASS = "7818066137@9258";

// Initialize Google Gemini AI if GEMINI_API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY });

// Initial DB state
interface Review { id: string; name: string; rating: number; text: string; date: string; approved: boolean; }
interface Appointment { id: string; name: string; phone: string; email: string; service: string; date: string; time: string; notes: string; createdAt: number; }
interface DbState { reviews: Review[]; appointments: Appointment[]; }

async function initDb() {
  try {
    await fs.access(DB_FILE);
  } catch {
    const freshDb: DbState = {
      reviews: [
        { id: "1", name: "Sarah Jenkins", text: "Absolutely the best salon experience I've ever had.", rating: 5, date: "2 weeks ago", approved: true },
        { id: "2", name: "Emily Rodriguez", text: "A beautiful, relaxing environment.", rating: 5, date: "1 month ago", approved: true },
        { id: "3", name: "Mia Thompson", text: "So impressed with the attention to detail.", rating: 5, date: "2 months ago", approved: true },
      ],
      appointments: []
    };
    await fs.writeFile(DB_FILE, JSON.stringify(freshDb, null, 2));
  }
}

initDb();

async function getDb(): Promise<DbState> {
  const data = await fs.readFile(DB_FILE, "utf-8");
  return JSON.parse(data);
}

async function saveDb(data: DbState) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Middleware to protect admin routes
function authAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Routes
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: "1d" });
    res.cookie("adminToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Incorrect password" });
  }
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true });
});

// Make booking
app.post("/api/appointments", async (req, res) => {
  const db = await getDb();
  const newAppointment: Appointment = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: Date.now()
  };
  db.appointments.push(newAppointment);
  await saveDb(db);
  res.json({ success: true, appointment: newAppointment });
});

// Admin: Get appointments
app.get("/api/admin/appointments", authAdmin, async (req, res) => {
  const db = await getDb();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const originalCount = db.appointments.length;
  db.appointments = db.appointments.filter(app => now - app.createdAt < THIRTY_DAYS_MS);
  if (db.appointments.length < originalCount) {
    await saveDb(db);
  }
  
  res.json(db.appointments);
});

// Admin: Delete appointment
app.delete("/api/admin/appointments/:id", authAdmin, async (req, res) => {
  const db = await getDb();
  db.appointments = db.appointments.filter(app => app.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true });
});

// Admin: Export to excel
app.get("/api/admin/appointments/export", authAdmin, async (req, res) => {
  const db = await getDb();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const validAppointments = db.appointments.filter(app => now - app.createdAt < THIRTY_DAYS_MS);
  
  const worksheet = xlsx.utils.json_to_sheet(validAppointments);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Appointments");
  
  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader("Content-Disposition", "attachment; filename=\"appointments.xlsx\"");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
});

// Reviews fetch
app.get("/api/reviews", async (req, res) => {
  const db = await getDb();
  res.json(db.reviews.filter(r => r.approved));
});

// Admin: Get all reviews (including pending)
app.get("/api/admin/reviews", authAdmin, async (req, res) => {
  const db = await getDb();
  res.json(db.reviews);
});

// Post a review
app.post("/api/reviews", async (req, res) => {
  const db = await getDb();
  const newReview: Review = {
    id: Date.now().toString(),
    ...req.body,
    date: new Date().toLocaleDateString(),
    approved: true
  };
  db.reviews.push(newReview);
  await saveDb(db);
  res.json({ success: true, review: newReview });
});

// Admin: Approve review
app.patch("/api/admin/reviews/:id/approve", authAdmin, async (req, res) => {
  const db = await getDb();
  const review = db.reviews.find(r => r.id === req.params.id);
  if (review) {
    review.approved = true;
    await saveDb(db);
    res.json({ success: true, review });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Admin: Delete review
app.delete("/api/admin/reviews/:id", authAdmin, async (req, res) => {
  const db = await getDb();
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true });
});

// ==========================================
// WHATSAPP BUSINESS WEBHOOK & GEMINI AI INTEGRATION
// ==========================================

const KNOWLEDGE_BASE = `
Business Name: Demo Salon Agra
Location: Agra, Uttar Pradesh, India
Phone: +91 78180 66137
Email: Prashantgupta7818@gmail.com
Services & Pricing:
- Women's Designer Haircut & Blowout: From ₹2500 (Includes consultation, luxurious shampoo, haircut, and blow-dry style).
- Men's Precision Haircut & Styling: From ₹1500 (Includes consultation, shampoo, precision cut, and styling).
- Balayage & Ombre Color Customization: From ₹6000 (Expert dimensional coloring and gloss treatment).
- Royal Bridal Makeup & Pre-Bridal Package: From ₹15000 (Complete bridal makeup, HD look, draping, and pre-bridal skin glow treatments).
- Advanced HydraFacial & Skin Glow Treatment: From ₹3500 (Deep cleansing, extraction, hydration, and LED light therapy).
- Keratin Smoothing & Frizz Control Treatment: From ₹5000 (Long-lasting frizz control and mirror-shine smoothing).
Opening Hours: Monday to Sunday: 9:00 AM - 9:00 PM.
Booking Info: Customers can book online on our website or directly via WhatsApp by sharing their preferred service, date, and time.
Human Support: If the customer asks for a human support executive, manager, or complex escalation, the bot should politely provide our phone number (+91 78180 66137) or email (Prashantgupta7818@gmail.com) for direct human assistance.
`;

// Webhook Verification (GET /api/whatsapp/webhook)
app.get("/api/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "demosalon_verify_token_123";

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook Event Receiver (POST /api/whatsapp/webhook)
app.post("/api/whatsapp/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (value && value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const from = message.from; // customer phone number
            const msgBody = message.text?.body;

            if (msgBody) {
              console.log(`Received WhatsApp message from ${from}: ${msgBody}`);

              // Generate AI response using Gemini
              let replyText = "";
              try {
                const model = "gemini-2.5-flash";
                const prompt = `You are the official WhatsApp customer support AI assistant for Demo Salon Agra.
                
                Knowledge Base:
                ${KNOWLEDGE_BASE}
                
                Guidelines:
                - Be polite, professional, and helpful.
                - Support English, Hindi, and Hinglish naturally.
                - Answer accurately based on the Knowledge Base.
                - If the customer asks for human assistance or complex queries beyond your knowledge, direct them to call +91 78180 66137 or email Prashantgupta7818@gmail.com.
                - Keep answers concise and suitable for WhatsApp reading.
                
                Customer Message: "${msgBody}"`;

                const response = await ai.models.generateContent({
                  model: model,
                  contents: prompt,
                });

                replyText = response.text || "Thank you for contacting Demo Salon Agra. How can we assist you with our salon services today?";
              } catch (aiErr) {
                console.error("Gemini AI Error in WhatsApp Webhook:", aiErr);
                replyText = "Namaste! Welcome to Demo Salon Agra. For immediate assistance with bookings or pricing, please call us at +91 78180 66137.";
              }

              // Send reply via WhatsApp Business Cloud API if credentials exist
              const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
              const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

              if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
                try {
                  const waResponse = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      messaging_product: "whatsapp",
                      to: from,
                      type: "text",
                      text: { body: replyText }
                    })
                  });
                  const waResult = await waResponse.json();
                  console.log("WhatsApp API response sent:", waResult);
                } catch (waSendErr) {
                  console.error("Failed to send WhatsApp message via Cloud API:", waSendErr);
                }
              } else {
                console.log("WhatsApp Cloud API credentials not configured. Simulated reply to customer:", replyText);
              }
            }
          }
        }
      }
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
