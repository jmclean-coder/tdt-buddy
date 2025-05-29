import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';

// Import commands
import * as verifyCommand from './commands/verification/verify.js';
import * as verificationHelpCommand from './commands/verification/verificationHelp.js';
import * as createNewYearCommand from './commands/admin/createnewyear.js';
import * as archiveYearCommand from './commands/admin/archiveyear.js';


const EPHEMERAL_FLAG = 64;

// Create a command map
const commands = {
  'verify': verifyCommand,
  'verification-help': verificationHelpCommand,
  'createnewyear': createNewYearCommand,
  'archiveyear': archiveYearCommand,
};
// testing purposes
// export default {
//   async fetch(request, env, ctx) {
//     // Add your ngrok URL here
//     const ngrokUrl = 'ngrok-free.app/test-airtable';
//     try {
//       const resp = await fetch(ngrokUrl);
//       const data = await resp.json();
//       return new Response(JSON.stringify(data), {
//         headers: { 'content-type': 'application/json' },
//       });
//     } catch (err) {
//       return new Response('Error: ' + err.message, { status: 500 });
//     }
//   },
// };

export default {
  async fetch(request, env, ctx) {
    // console.log('Received request:', request.method);

    // Only respond to POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify the request is from Discord
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();
    // console.log('Signature headers:', { signature, timestamp });
    // console.log('Request body:', body);

    const isValidRequest = await verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY,
    );

    // console.log('Is valid request:', isValidRequest);
    if (!isValidRequest) {
      return new Response('Invalid request', { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Handle Discord PING request for verification
    if (interaction.type === InteractionType.PING) {
      return new Response(
        JSON.stringify({ type: InteractionResponseType.PONG }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Handle application commands (type 2)
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const { name } = interaction.data;

      try {
        // Check if we have a handler for this command
        if (commands[name]) {
          const response = await commands[name].execute(interaction, env, ctx);
          return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Unknown command
        return new Response(JSON.stringify({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Command "${name}" not implemented.`,
            flags: 64, // Ephemeral
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
        });

      }
      catch (error) {
        console.error(`Error handling command "${name}":`, error);

        return new Response(JSON.stringify({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'An error occurred while processing your command.',
            flags: 64, // Ephemeral
          },
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Fallback response
    return new Response(
      JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Unsupported interaction type.',
          flags: EPHEMERAL_FLAG,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  },
};