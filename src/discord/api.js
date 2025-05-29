import { verifyBotAccess } from '../utils/discordAuthTest.js';

export const DISCORD_API_URL = 'https://discord.com/api/v10';

/**
 * Get all roles in a guild
 * @param {string} guildId - Discord guild (server) ID
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<Array>} Array of role objects
 */
export async function getGuildRoles(env) {
  // Verify bot access first
  const accessCheck = await verifyBotAccess(env);
  if (!accessCheck.valid) {
    throw new Error(`Bot access error: ${accessCheck.reason}`);
  }

  // debugger;
  const url = `${DISCORD_API_URL}/guilds/${env.GUILD_ID}/roles`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to get guild roles: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Get all channels in a Server
 * @param {string} guildId - The ID of the guild (server)
 * @param {object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<Array>} - A promise that resolves to an array of channels
 * @throws {Error} - Throws an error if the request fails
 * @description This function fetches all channels in a Discord server using the Discord API.
 * It requires the server ID and a bot token for authentication. The function returns a promise that resolves
 */
export async function getGuildChannels(env) {
  // debugger;

  // Verify bot access first
  const accessCheck = await verifyBotAccess(env);
  if (!accessCheck.valid) {
    throw new Error(`Bot access error: ${accessCheck.reason}`);
  }

  // console.log('Bot credentials verified, attempting to fetch channels');
  const url = `${DISCORD_API_URL}/guilds/${env.GUILD_ID}/channels`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to get guild channels: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Create a new guild channel
 * @param {string} guildId - Discord guild (server) ID
 * @param {Object} channelData - Channel configuration
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<Object>} Created channel object
 */
export async function createGuildChannel(guildId, channelData, env) {
  const url = `${DISCORD_API_URL}/guilds/${guildId}/channels`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(channelData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create channel: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Update a guild channel
 * @param {string} channelId - Discord channel ID to update
 * @param {Object} channelData - Channel update data
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<Object>} Updated channel object
 */
export async function updateGuildChannel(
  channelId,
  channelData,
  env
) {
  const url = `${DISCORD_API_URL}/channels/${channelId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(channelData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update channel: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Create a new guild role
 * @param {string} guildId - Discord guild (server) ID
 * @param {Object} roleData - Role configuration object
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<Object>} Created role object
 */
export async function createGuildRole(guildId, roleData, env) {
  const url = `${DISCORD_API_URL}/guilds/${guildId}/roles`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create role: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Update a guild role
 * @param {string} guildId - Discord guild (server) ID
 * @param {string} roleId - Role ID to update
 * @param {Object} roleData - Role update data
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<Object>} Updated role object
 */
export async function updateGuildRole(
  guildId,
  roleId,
  roleData,
  env
) {
  const url = `${DISCORD_API_URL}/guilds/${guildId}/roles/${roleId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to update role: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Add a role to a guild member
 */
export async function addRoleToMember(userId, roleId, env) {
  const url = `${DISCORD_API_URL}/guilds/${env.GUILD_ID}/members/${userId}/roles/${roleId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
  });

  if (!response.ok) {
    // For 204 No Content, this is actually a success case for this endpoint
    if (response.status === 204) {
      return true;
    }

    const errorText = await response.text();
    console.error(`Failed to add role to member: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return true;
}

/**
 * Delete a guild role
 * @param {string} guildId - Discord guild (server) ID
 * @param {string} roleId - Role ID to delete
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<boolean>} Success indicator
 */
export async function deleteGuildRole(guildId, roleId, env) {
  const url = `${DISCORD_API_URL}/guilds/${guildId}/roles/${roleId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to delete role: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return true;
}

/**
 * Delete a channel
 * @param {string} channelId - Channel ID to delete
 * @param {Object} env - Environment variables containing DISCORD_TOKEN
 * @returns {Promise<boolean>} Success indicator
 */
export async function deleteChannel(channelId, env) {
  const url = `${DISCORD_API_URL}/channels/${channelId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bot ${env.DISCORD_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to delete channel: ${errorText}`);
    throw new Error(
      `Discord API error: ${response.status} ${errorText}`
    );
  }

  return true;
}
// POST /webhooks/<application_id>/<interaction_token>
export async function sendFollowUp(
  content,
  interaction,
  env,
  ephemeral = true // Default to ephemeral messages
) {
  // const url = `${DISCORD_API_URL}/interactions/${interaction.id}/${interaction.token}/callback`;
  // debugger;
  console.log('sendFollowUp called with:', {
    content,
    token: interaction.token,
    ephemeral,
  });

  const messageData = {
    content,
    flags: ephemeral ? 64 : 0, // 64 is the flag for ephemeral messages
  };
  const applicationId = env.DISCORD_APPLICATION_ID;
  const token = interaction.token;

  // Ensure we have both the application ID and token
  if (!applicationId) {
    throw new Error('Missing DISCORD_APPLICATION_ID in environment');
  }
  if (!token) {
    throw new Error('Missing interaction token');
  }
  const url = `${DISCORD_API_URL}/webhooks/${applicationId}/${token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageData),
  });

  console.log('response:', response);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to send follow-up message:', errorText);
    throw new Error('Failed to send follow-up message');
  }
  return response;
}
