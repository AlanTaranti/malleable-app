import { setGlobalOptions } from 'firebase-functions/v2';
import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import OpenAI from 'openai';

/*
  Configuration
*/

setGlobalOptions({ region: 'southamerica-east1' });

export const openaiCompletion = onCall(async (request) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const data = <{ malleables: Record<string, unknown>; prompt: string }>request.data;

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const expectedFormatResponse = {
    template: '<div>{{ content }}</div>',
    script: {
      data: {},
      methods: {},
      computed: {},
      watch: {},
    },
  };

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You only speaks JSON. You are a computer in charge of modifying elements of a Vue 3 application with BulmaCSS to suits the need of the user',
      },
      {
        role: 'system',
        content: 'Here is the current state of the app in JSON format:\n\n' + JSON.stringify(data.malleables, null, 2),
      },
      {
        role: 'user',
        content: data.prompt,
      },
      {
        role: 'user',
        content: "The background color of the app's body is currently white",
      },
      {
        role: 'user',
        content: 'An example response is this format: ' + JSON.stringify(expectedFormatResponse, null, 2),
      },
      {
        role: 'system',
        content:
          'Provide the new state of the app; writing template tag if necessary; setup content if necessary; with content in user provided language, in JSON format:\n\n',
      },
    ],
  });

  const content = completion.choices[0].message.content;

  if (!content) {
    throw new Error('Could not parse response from OpenAI');
  }

  logger.info('content', content);

  return {
    malleables: <Record<string, unknown>>JSON.parse(content),
  };
});
