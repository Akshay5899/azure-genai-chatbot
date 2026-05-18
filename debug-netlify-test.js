import { handler } from './netlify/functions/chat.js';

const event = {
  httpMethod: 'POST',
  body: JSON.stringify({ message: 'hi' }),
};

(async () => {
  try {
    const result = await handler(event);
    console.log(result);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
