import { getGuildChannels, DISCORD_API_URL } from './api.js';

/**
 * Log verification to admin channel
 */
export async function logVerification(guildId, user, fields, eventYear, roles, env) {
  try {
    // Find the log channel
    const channels = await getGuildChannels(env);
    // console.log('Channels:', channels);

    const logChannel = channels.find(channel =>
      channel.name === 'verification-logs'
    );
    // console.log('Log channel:', logChannel);

    if (!logChannel) {
      console.warn('No verification log channel found in the server');
      return false;
    }

    // Create embedded message
    const embed = {
      color: 0x00FF00, // Green
      title: 'User Verified',
      description: 'A new user has verified their registration.',
      fields: [
        {
          name: 'User',
          value: `<@${user.id}> (${user.username}#${user.discriminator})`,
        },
        {
          name: 'Registration Name',
          value: `${fields['Name - Full']}`,
        },
        {
          name: 'Event Year',
          value: eventYear,
        },
        {
          name: 'Roles Assigned',
          value: roles.join(', '),
        },
        {
          name: 'Verification Time',
          value: new Date().toLocaleString(),
        },
      ],
      loggedTimestamp: new Date().toISOString(),
    };

    // Send log message to the channel
    const url = `${DISCORD_API_URL}/channels/${logChannel.id}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${env.DISCORD_TOKEN}`,
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send log message: ${errorText}`);
      return false;
    }

    return true;
  }
  catch (error) {
    console.error('Error logging verification:', error);
    return false;
  }
}
