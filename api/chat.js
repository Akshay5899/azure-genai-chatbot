import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const responsesPath = path.join(__dirname, "../responses.json");
const responsesData = JSON.parse(fs.readFileSync(responsesPath, "utf8"));
const cannedResponses = responsesData.responses;
const dynamicResponses = responsesData.dynamic_responses;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const lowerMessage = message.toLowerCase().trim();

    // Check for canned responses
    if (cannedResponses[lowerMessage]) {
      res.status(200).json({ reply: cannedResponses[lowerMessage] });
      return;
    }

    // Check for dynamic responses
    if (dynamicResponses[lowerMessage]) {
      if (dynamicResponses[lowerMessage] === "current_time") {
        const currentTime = new Date().toLocaleTimeString();
        res.status(200).json({ reply: `It's ${currentTime}` });
        return;
      }
    }

    // Check for partial matches (like "weather" in any message)
    for (const [key, response] of Object.entries(cannedResponses)) {
      if (lowerMessage.includes(key) && key.length > 3) { // Avoid matching short words
        res.status(200).json({ reply: response });
        return;
      }
    }

    // Use Azure OpenAI for other responses
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const missing = [];

    if (!apiKey) missing.push("AZURE_OPENAI_API_KEY");
    if (!endpoint) missing.push("AZURE_OPENAI_ENDPOINT");
    if (!deployment) missing.push("AZURE_OPENAI_DEPLOYMENT");

    if (missing.length) {
      res.status(200).json({ reply: getFallbackReply(message) });
      return;
    }

    const normalizedEndpoint = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
    const client = new OpenAI({
      apiKey,
      baseURL: `${normalizedEndpoint}openai/deployments/${deployment}`,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: { "api-key": apiKey },
    });

    let reply;
    try {
      const response = await client.chat.completions.create({
        model: deployment,
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 300,
      });

      reply = response.choices?.[0]?.message?.content ?? "No response returned";
    } catch (aiError) {
      console.error("Error:", aiError);
      reply = getFallbackReply(message);
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Error occurred" });
  }
}