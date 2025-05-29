import { InteractionResponseType, MessageFlags } from 'discord-interactions';
import { archiveYearStructure } from '../../discord/yearManagement.js';
import { sendFollowUp } from '../../discord/api.js';

// TODO: Complete Implementation

export const data = {
  name: 'archiveyear',
  description: 'Archive channels for a specific year',
  options: [
    {
      name: 'year',
      description: 'The year to archive (e.g., 2024)',
      type: 3, // STRING
      required: true,
    },
  ],
};

export async function execute(interaction, env) {
  // Check for admin permissions
  if (!interaction.member.permissions.includes('ADMINISTRATOR')) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '❌ You need Administrator permissions to use this command.',
        flags: MessageFlags.EPHEMERAL,
      },
    };
  }

  // Get command options
  const yearToArchive = interaction.data.options.find(
    option => option.name === 'year',
  )?.value;

  // Basic validation
  if (!yearToArchive || !/^\d{4}$/.test(yearToArchive)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '❌ Please provide a valid 4-digit year (e.g., 2024).',
        flags: MessageFlags.EPHEMERAL,
      },
    };
  }

  // Create a deferred response first
  const deferredResponse = {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: 0, // Not ephemeral - we want everyone to see this
    },
  };

  // We need to handle the archiving asynchronously due to time limits
  env.waitUntil(processArchiving(yearToArchive, interaction, env));

  return deferredResponse;
}

async function processArchiving(year, interaction, env) {
  try {
    await sendFollowUp(`🔄 Starting archive process for ${year}...`, interaction, env);

    // Archive the year structure
    const result = await archiveYearStructure(interaction.guild_id, year, env);

    // Final success message
    const summary = `✅ Successfully archived all ${year} channels and categories!

**Archived:**
- ${result.categories.length} categories
- ${result.channels.length} channels

All content has been preserved and set to read-only.
Users with ${year}-Attendee and ${year}-Staff roles can still access the archived content.`;

    await sendFollowUp(summary, interaction, env, true);

  }
  catch (error) {
    console.error('Error archiving year:', error);

    // Send error message
    await sendFollowUp(
      `❌ **An error occurred while archiving ${year}.** ${error.message}`,
      interaction,
      env,
      true, // ephemeral
    );
  }
}