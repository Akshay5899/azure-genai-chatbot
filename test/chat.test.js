import test from 'node:test';
import assert from 'node:assert/strict';
import { handler } from '../netlify/functions/chat.js';

test('returns a friendly fallback reply when Azure AI credentials are not configured', async () => {
  const originalApiKey = process.env.AZURE_OPENAI_API_KEY;
  const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const originalDeployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  delete process.env.AZURE_OPENAI_API_KEY;
  delete process.env.AZURE_OPENAI_ENDPOINT;
  delete process.env.AZURE_OPENAI_DEPLOYMENT;

  try {
    const result = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ message: 'Explain quantum computing' }),
    });

    assert.equal(result.statusCode, 200);
    const body = JSON.parse(result.body);
    assert.equal(typeof body.reply, 'string');
    assert.match(body.reply.toLowerCase(), /fallback|configured|azure/i);
  } finally {
    if (originalApiKey !== undefined) process.env.AZURE_OPENAI_API_KEY = originalApiKey;
    if (originalEndpoint !== undefined) process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
    if (originalDeployment !== undefined) process.env.AZURE_OPENAI_DEPLOYMENT = originalDeployment;
  }
});
