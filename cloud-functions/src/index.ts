import { setGlobalOptions } from 'firebase-functions/v2';
import { onCall } from 'firebase-functions/lib/v1/providers/https';
import OpenAI from 'openai';
import { logger } from 'firebase-functions';

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
    model: 'gpt-3.5-turbo-16k',
    messages: [
      {
        role: 'system',
        content:
          'You only speaks JSON. You are a computer in charge of modifying elements of a Vue application to suits the need of the user',
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
