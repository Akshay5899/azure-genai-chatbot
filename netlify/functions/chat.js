import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const responsesPath = path.join(__dirname, "../../responses.json");
const responsesData = JSON.parse(fs.readFileSync(responsesPath, "utf8"));
const cannedResponses = responsesData.responses;
const dynamicResponses = responsesData.dynamic_responses;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const message = body.message;

    if (typeof message !== "string" || !message.trim()) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    const lowerMessage = message.toLowerCase().trim();

    if (cannedResponses[lowerMessage]) {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ reply: cannedResponses[lowerMessage] }),
      };
    }

    if (dynamicResponses[lowerMessage] === "current_time") {
      const currentTime = new Date().toLocaleTimeString();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ reply: `It's ${currentTime}` }),
      };
    }

    for (const [key, response] of Object.entries(cannedResponses)) {
      if (lowerMessage.includes(key) && key.length > 3) {
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ reply: response }),
        };
      }
    }

    const client = createAzureClient();
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reply: response.choices?.[0]?.message?.content ?? "No response returned" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error instanceof Error ? error.message : "Error occurred" }),
    };
  }
};
