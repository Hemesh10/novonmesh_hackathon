const express = require("express");
const router = express.Router();
const geminiController = require("../controllers/geminiController");

// Route to generate text from Gemini
router.post("/generate", geminiController.generateText);

// Route to get models/capabilities
router.get("/models", geminiController.getModels);

module.exports = router;