import OpenAI from "openai";
import fs from "fs";
import path from "path";

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

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Load responses from external file
    const responsesPath = path.join(process.cwd(), "responses.json");
    const responsesData = JSON.parse(fs.readFileSync(responsesPath, "utf8"));
    const cannedResponses = responsesData.responses;
    const dynamicResponses = responsesData.dynamic_responses;

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
    const client = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY },
    });

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 300,
    });

    res.status(200).json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred" });
  }
}