/* eslint-disable no-inline-comments */
import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';

const EPHEMERAL_FLAG = 64;

// Command handler
function handleCommand(interaction) {
  const { name } = interaction.data;

  // Simple command responses for testing
  switch (name) {
  case 'ping':
    return {
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
      data: {
        content: 'Pong! Bot is responding correctly.',
        flags: 64, // Ephemeral
      },
    };
  default:
    return {
      type: 4,
      data: {
        content: `Command '${name}' not implemented yet.`,
        flags: 64,
      },
    };
  }
}

export default {
  async fetch(request, env, ctx) {
    // console.log('Received request:', request.method);
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify the request is from Discord
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    // console.log('Signature headers:', { signature, timestamp });

    const body = await request.text();
    // console.log('Request body:', body);

    const isValidRequest = await verifyKey(
      // awaits the verification. Important bug fix when updating the interaction url
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

    // Handle command interactions
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const response = handleCommand(interaction);
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      });
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
