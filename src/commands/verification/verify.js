/* eslint-disable quotes */
import {
  findRegistrationByCode,
  updateRegistrationWithDiscordInfo,
  getFieldValue,
  isVerificationSupported,
} from '../../airtable/operations.js';
import { FIELD_VALUES } from '../../airtable/config.js';
import { InteractionResponseType } from 'discord-interactions';
import { assignRoles } from '../../discord/roles.js';
import { logVerification } from '../../discord/logging.js';
import { sendFollowUp } from '../../discord/api.js';

export const data = {
  name: 'verify',
  description: 'Verify your event registration',
  options: [
    {
      name: 'code',
      description:
        'Your verification code from the registration email',
      type: 3, // STRING
      required: true,
    },
  ],
};

export async function execute(interaction, env, ctx) {
  // Extract verification code
  const code = interaction.data.options.find(
    (option) => option.name === 'code'
  )?.value;

  if (!code) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: '❌ Please provide a verification code.',
        flags: 64, // Ephemeral
      },
    };
  }

  // Create a deferred response first
  const deferredResponse = {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: 64, // Ephemeral
    },
  };

  // Return the deferred response immediately
  // Then handle the verification asynchronously
  ctx.waitUntil(
    processVerification(code, interaction, env).catch((error) => {
      console.error(
        'Verification error in background process:',
        error
      );
    })
  );

  return deferredResponse;
}

async function processVerification(code, interaction, env) {
  // console.log('processVerification START', { code });
  // debugger;
  try {
    // Look up registration by verification code
    const registration = await findRegistrationByCode(code, env);

    let responseContent;
    // console.log('Interaction token:', interaction.token);
    // console.log('Interaction ID:', interaction.id);
    // console.log(`registration found: ${!!registration}`);
    // console.log('registration:', registration, typeof registration);

    // No registration found with this code
    if (!registration) {
      responseContent =
        '❌ **Invalid verification code.** Please check if you entered the correct code from your registration email. If you need help, use `/verification-help`.';
      // console.log('No registration found, should call sendFollowUp');
      await sendFollowUp(responseContent, interaction, env);
      return;
    }

    // Extract record, year

    const { record, year } = registration;

    // Double-check verification is supported for this year
    if (!isVerificationSupported(year)) {
      // console.log(
      //   'Verification not supported, should call sendFollowUp'
      // );
      responseContent = `❌ **Verification not supported.** Verification is not supported for registrations from ${year}. Please contact an administrator for assistance.`;
      await sendFollowUp(responseContent, interaction, env);
      return;
    }

    // If the status is "completed", block verification. If missing/undefined, allow to proceed.
    const verificationStatus = getFieldValue(
      record,
      year,
      'Verification Status'
    );
    if (verificationStatus === FIELD_VALUES.VERIFICATION_COMPLETED) {
      responseContent =
        '⚠️ **Already verified.** This code has already been used to verify. If you believe this is an error, please contact the event staff.';
      // console.log('Already verified, should call sendFollowUp');
      await sendFollowUp(responseContent, interaction, env);
      return;
    }

    // Check payment status
    const paymentStatus = getFieldValue(
      record,
      year,
      'Payment Status'
    );
    // console.log('payment status:', paymentStatus);
    if (
      paymentStatus !== FIELD_VALUES.PAYMENT_PLAN &&
      paymentStatus !== FIELD_VALUES.PAYMENT_COMPLETED
    ) {
      responseContent =
        '⚠️ **Payment incomplete.** Your registration payment appears to be incomplete. Please complete your payment before verifying. If you believe this is an error, contact the event staff.';
      // console.log('Payment incomplete, should call sendFollowUp');
      await sendFollowUp(responseContent, interaction, env);
      return;
    }

    // Assign roles
    const assignedRoles = await assignRoles(
      interaction.member.user.id,
      year,
      env
    );

    // console.log('Assigned roles:', assignedRoles);

    // Update Airtable with verification info
    await updateRegistrationWithDiscordInfo(
      registration,
      {
        userId: interaction.member.user.id,
        username: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
        roles: assignedRoles,
      },
      env
    );

    // Create success message
    responseContent = formatSuccessMessage(
      record,
      year,
      assignedRoles,
      interaction
    );

    // Send success message
    // console.log('Verification successful, sending follow-up');
    await sendFollowUp(responseContent, interaction, env, false);

    // Log verification to admin channel
    await logVerification(
      interaction.guild_id,
      interaction.member.user,
      record.fields,
      year,
      assignedRoles,
      env
    );
  } catch (error) {
    console.error('Verification error:', error);

    // Send error message
    await sendFollowUp(
      '❌ **An error occurred during verification.** Please try again later or contact the event staff for assistance.',
      interaction,
      env
    );
  }
}

function formatSuccessMessage(record, year, roles, interaction) {
  // Get first name from "Name - Full" field which might be in format "First Last"
  const fullName = getFieldValue(record, year, 'Name - Full') || '';
  const firstName = fullName.split(' ')[0] || 'there';

  let message = `✅ **Verification successful!** Welcome to the Dance Thing ${year}, ${firstName}!\n\n`;

  // Add roles info
  message += `**Roles assigned:** ${roles.join(', ')}\n\n`;

  // Next steps
  message += '**Next steps:**\n';
  message += `- Check out the #announcements channel for important updates\n`;
  message += `- Introduce yourself in the #introductions channel\n`;
  message += `- For coordinating ride and gearshares, visit the channels in the Planning Category\n`;

  return message;
}
