import {
  verifyKey,
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';

const EPHEMERAL_FLAG = 64;

// Basic ping-pong response
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Verify the request is from Discord
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    const isValidRequest = verifyKey(
      body,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY,
    );

    if (!isValidRequest) {
      return new Response('Invalid request', { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Handle Discord PING requests
    if (interaction.type === InteractionType.PING) {
      return new Response(
        JSON.stringify({ type: InteractionResponseType.PONG }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Fallback response
    return new Response(JSON.stringify({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Unsupported interaction type.',
        flags: EPHEMERAL_FLAG,
      },
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
