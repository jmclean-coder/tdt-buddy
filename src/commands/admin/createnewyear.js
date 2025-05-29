import {
  InteractionResponseType,
  MessageFlags,
} from 'discord-interactions';
import { setCurrentEventYear } from '../../airtable/operations.js';
import { createYearStructure } from '../../discord/yearManagement.js';
import { sendFollowUp } from '../../discord/api.js';

// TODO: Complete Implementation

export const data = {
  name: 'createnewyear',
  description: 'Create channels and roles for a new event year',
  options: [
    {
      name: 'year',
      description: 'The year to create (e.g., 2025)',
      type: 3, // STRING
      required: true,
    },
    {
      name: 'archive_previous',
      description: 'Automatically archive the previous year',
      type: 5, // BOOLEAN
      required: false,
    },
  ],
};

export async function execute(interaction, env) {
  // Check for admin permissions
  if (!interaction.member.permissions.includes('ADMINISTRATOR')) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          '❌ You need Administrator permissions to use this command.',
        flags: MessageFlags.EPHEMERAL,
      },
    };
  }

  // Get command options
  const newYear = interaction.data.options.find(
    (option) => option.name === 'year',
  )?.value;

  const archivePrevious =
    interaction.data.options.find(
      (option) => option.name === 'archive_previous',
    )?.value || false;

  // Basic validation
  if (!newYear || !/^\d{4}$/.test(newYear)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          '❌ Please provide a valid 4-digit year (e.g., 2025).',
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

  // We need to handle the year creation asynchronously due to time limits
  env.waitUntil(
    processYearCreation(newYear, archivePrevious, interaction, env),
  );

  return deferredResponse;
}

async function processYearCreation(
  newYear,
  archivePrevious,
  interaction,
  env,
) {
  try {
    await sendFollowUp(
      `🔄 Beginning setup for ${newYear} event structure...`,
      interaction,
      env,
    );

    // Calculate previous year
    const prevYear = (parseInt(newYear) - 1).toString();

    // Step 1: Create Discord roles and channels
    await sendFollowUp(
      `🔄 Creating roles and channels for ${newYear}...`,
      interaction,
      env,
      true,
    );

    const result = await createYearStructure(
      interaction.guild_id,
      newYear,
      env,
    );

    // Step 2: Archive previous year if requested
    if (archivePrevious) {
      await sendFollowUp(
        `🔄 Archiving ${prevYear} structure...`,
        interaction,
        env,
        true,
      );
      await archiveYearStructure(interaction.guild_id, prevYear, env);
    }

    // Step 3: Update current year in Airtable
    await sendFollowUp(
      '🔄 Updating database settings...',
      interaction,
      env,
      true,
    );
    await setCurrentEventYear(newYear, env);

    // Final success message
    const summary = `✅ Successfully set up the ${newYear} event structure!

**Created:**
- ${result.roles.length} roles
- ${result.categories.length} categories
- ${result.channels.length} channels

${
  archivePrevious
    ? `**Archived:**\n- ${prevYear} event structure\n`
    : ''
}

**Next Steps:**
1. Update your registration system for the new year
2. Configure email templates with verification codes
3. Test the verification process`;

    await sendFollowUp(summary, interaction, env);
  }
  catch (error) {
    console.error('Error creating new year:', error);

    // Send error message
    await sendFollowUp(
      `❌ **An error occurred while setting up ${newYear}.** ${error.message}`,
      interaction,
      env,
    );
  }
}