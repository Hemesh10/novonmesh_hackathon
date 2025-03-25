const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const geminiRoutes = require("./routes/gemini");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Accept requests from Chrome extensions and localhost (for testing)
      if (
        !origin ||
        origin.match(/^chrome-extension:\/\/[a-z]{32}$/) ||
        origin.match(/^http:\/\/localhost/)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Simple rate limiting middleware
const rateLimiter = (req, res, next) => {
  // In a real app, use a proper rate limiting library like 'express-rate-limit'
  // This is a simple placeholder
  next();
};

// Routes
app.use("/api/gemini", rateLimiter, geminiRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
