// src/commands/verification-help.js
import { InteractionResponseType } from 'discord-interactions';

export const data = {
  name: 'helpverify',
  description: 'Get help with the verification process',
};

export async function execute(interaction, env) {
  const helpMessage = `# Verification Help

**How to verify your registration:**

1. **Complete Registration**: Make sure you've completed your event registration (Paid in Full or Payment Plan) through our website.

2. **Get Your Code**: Check your email for a verification code. This is sent to the email you used during registration.

3. **Use the Verify Command**: Type \`/verify\` followed by your code (for example: \`/verify ABC123X\`)

4. **Access Granted**: Once verified, you'll receive a discord role for the specifc event year.

**Troubleshooting:**

- **Code Not Working?** Double-check for typos, the code is case-sensitive.
- **No Code in Email?** Contact the event staff.
- **Payment Issues?** Make sure your payment is complete before verifying.

**Need More Help?**
Contact the event organizers at info@thedancething.org or ask in the #ask-an-organizer channel.`;

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: helpMessage,
      flags: 64, // Ephemeral
    },
  };
}