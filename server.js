import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Load responses from external file
const responsesPath = path.join(process.cwd(), "responses.json");
const responsesData = JSON.parse(fs.readFileSync(responsesPath, "utf8"));
const cannedResponses = responsesData.responses;
const dynamicResponses = responsesData.dynamic_responses;

function createAzureClient() {
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const missing = [];

  if (!apiKey) missing.push("AZURE_OPENAI_API_KEY");
  if (!endpoint) missing.push("AZURE_OPENAI_ENDPOINT");
  if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");

  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  const normalizedEndpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;

  return new OpenAI({
    apiKey,
    baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
    defaultQuery: { "api-version": "2024-02-15-preview" },
    defaultHeaders: { "api-key": apiKey },
  });
}

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for canned responses
    if (cannedResponses[lowerMessage]) {
      res.json({ reply: cannedResponses[lowerMessage] });
      return;
    }
    
    // Check for dynamic responses
    if (dynamicResponses[lowerMessage]) {
      if (dynamicResponses[lowerMessage] === "current_time") {
        const currentTime = new Date().toLocaleTimeString();
        res.json({ reply: `It's ${currentTime}` });
        return;
      }
    }
    
    // Check for partial matches (like "weather" in any message)
    for (const [key, response] of Object.entries(cannedResponses)) {
      if (lowerMessage.includes(key) && key.length > 3) { // Avoid matching short words
        res.json({ reply: response });
        return;
      }
    }

    const client = createAzureClient();
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 300,
    });

    res.json({ reply: response.choices?.[0]?.message?.content ?? "No response returned" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Error occurred" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000");
});
