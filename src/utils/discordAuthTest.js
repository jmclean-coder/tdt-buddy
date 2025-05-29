import { DISCORD_API_URL } from '../discord/api.js';

/**
 * Verify Discord bot authentication and guild access
 * @param {Object} env - Environment variables containing DISCORD_TOKEN and GUILD_ID
 * @returns {Promise<Object>} Object with validity status and details
 * @description Tests the bot's token validity and ability to access the specified guild
 */
export async function verifyBotAccess(env) {
  try {
    // First test if the bot can access its own information
    const botInfoUrl = `${DISCORD_API_URL}/users/@me`;
    console.log('Testing bot authentication...');

    const botResponse = await fetch(botInfoUrl, {
      headers: {
        Authorization: `Bot ${env.DISCORD_TOKEN}`
      }
    });

    if (!botResponse.ok) {
      const errorText = await botResponse.text();
      console.error(`❌ Bot token invalid: ${errorText}`);
      console.error('Status code:', botResponse.status);
      console.error('Headers:', Object.fromEntries([...botResponse.headers.entries()]));
      return {
        valid: false,
        reason: 'Invalid bot token or token revoked',
        details: errorText
      };
    }

    const botInfo = await botResponse.json();
    console.log(`✅ Bot authenticated as: ${botInfo.username}#${botInfo.discriminator}`);

    // Now check if bot can access the guild
    const guildUrl = `${DISCORD_API_URL}/guilds/${env.GUILD_ID}`;
    console.log(`Testing guild access for guild ID: ${env.GUILD_ID}...`);

    const guildResponse = await fetch(guildUrl, {
      headers: {
        Authorization: `Bot ${env.DISCORD_TOKEN}`
      }
    });

    if (!guildResponse.ok) {
      const errorText = await guildResponse.text();
      console.error(`❌ Cannot access guild: ${errorText}`);
      console.error('Status code:', guildResponse.status);
      return {
        valid: false,
        reason: 'Bot cannot access the specified guild',
        details: errorText
      };
    }

    const guildInfo = await guildResponse.json();
    console.log(`✅ Bot has access to guild: ${guildInfo.name}`);

    return {
      valid: true,
      botInfo,
      guildInfo
    };
  } catch (error) {
    console.error('Error verifying bot access:', error);
    return {
      valid: false,
      reason: 'Error checking bot credentials',
      details: error.message
    };
  }
}

/**
 * Simplified test function to check bot credentials
 * @param {Object} env - Environment variables containing DISCORD_TOKEN and optionally GUILD_ID
 */
export async function testBotCredentials(env) {
  console.log('🔑 Testing Discord bot credentials...');

  try {
    // Check basic token validity
    const result = await verifyBotAccess(env);

    if (result.valid) {
      console.log('✅ Authentication successful');
      console.log(`Bot: ${result.botInfo.username} (${result.botInfo.id})`);

      if (result.guildInfo) {
        console.log(`Guild: ${result.guildInfo.name} (${result.guildInfo.id})`);
        console.log(`Owner ID: ${result.guildInfo.owner_id}`);
      }
    } else {
      console.error('❌ Authentication failed');
      console.error(`Reason: ${result.reason}`);
      console.error(`Details: ${result.details}`);
    }

    return result;
  } catch (error) {
    console.error('❌ Error during authentication test:', error);
    return {
      valid: false,
      reason: 'Error during test',
      details: error.message
    };
  }
}
