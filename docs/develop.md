# TDT Server Bot File Structure

Does not include .gitignored files or node modules. See the [README.md](../README.md) for installation and usage instructions.

- `deploy/` — Deployment script
  - [registerCommands.js](../deploy/registerCommands.js) — Register and publish Discord slash commands to server
- `docs/` — Documentation
  - [develop.md](./develop.md) — Development documentation
  - [UserVerificationGuide.md](./UserVerificationGuide.md) — User verification guide
  - [VerificationArchitecture.md](./VerificationArchitecture.md) — Verification architecture
- `src/`
  - `airtable/` — Airtable integration
    - [client.js](../src/airtable/client.js) — Airtable API client
    - [config.js](../src/airtable/config.js) — Airtable configuration
    - [operations.js](../src/airtable/operations.js) — Airtable operations
  - `commands/` — Command definitions
    - `admin/` — Admin commands
      - [archiveyear.js](./src/commands/admin/archiveyear.js) — Year archiving command functions
      - [creatnewyear.js](../src/commands/admin/creatnewyear.js) — New year command functions
      - [gencode.js](../src/commands/admin/gencode.js) — Generate verification codes command
    - `verification/` — Verification commands
      - [verify.js](../src/commands/verification/verify.js) — Verify command
      - [verificationHelp.js](../src/commands/verification/verificationHelp.js) — Verification help command
  - `discord/` — Discord API integration
    - [api.js](../src/discord/api.js) — Discord API client functions
    <!--NOT IMPLEMENTED YET - [interactions.js](./src/discord/interactions.js) — Handle slash command interactions  -->
    - [logging.js](../src/discord/logging.js) — Discord logging utilities
    - [roles.js](../src/discord/roles.js) — Discord role management
    - [yearManagement.js](../src/discord/yearManagement.js) — Discord event year management
  - `utils/` — Utility functions
    - [airTableTest.js](../src/utils/airtableTest.js) — Airtable test script
    - [airtableTestServer.js](../src/utils/airtableTestServer.js) — Express server for testing Airtable integration
    - [discordAuthTest.js](../src/utils/discordAuthTest.js) — Discord authentication test script
  - [index.js](../src/index.js) — Main Workers entry point
- [.env](../.env) — Local environment variables
- [README.md](../README.md) — Usage and Install Documentation
- [package.json](../package.json) — Dependencies and scripts
- [package-lock.json](../package-lock.json) — Dependency lock file
- [wrangler.toml](../wrangler.toml) — Cloudflare Workers configuration

## Important notes

- The bot is designed to be deployed on Cloudflare Workers, which allows for serverless execution of JavaScript code.
- Bot Url deployed on cloudflare workers: <https://tdt-buddy.thedancething.workers.dev>
- to run the bot for local testing:
  - use `npm run dev` to start the bot locally. This will use the local environment variables defined in the `.env` file.
  - The bot will be accessible at `http://localhost:8787`.
  - use `ngrok http 8787` to create a tunnel to your local server. This will give you a public URL on the Internet that you can use for testing.
  - make sure to update the discord interaction url in the discord developer portal to point to the ngrok url. This is required for the bot to receive interactions from Discord while testing locally.

### Interaction response types

[discord-interactions.js](discord-interactions.js) offers the interaction response types used by the bot. These are used to send responses back to Discord when a user interacts with the bot.

## Development Checklist

```
VERIFICATION BOT DEPLOYMENT
[x] Register bot application in Discord Developer Portal
[x] Set up hosting environment (CloudFlare)
[x] Configure environment variables (.env file)
[x] Install dependencies (Discord.js, Airtable, etc.)
[x] Deploy bot to production environment
[x] Check bot is online and commands are registered
[x] Verify permissions in Discord server

MAKE.COM INTEGRATION
[x] Create and test Make.com scenario for verification codes
[x] Create and configure Make scenario for backfilling verification codes in Airtable
[x] Create and configure Make scenario for backfilling verification codes in Brevo
[x] Configure email template with correct branding
[] Set up error notifications
[x] Activate scenario

DOCUMENTATION & TRAINING
[x] Create user guide for verification process
[] Train staff on troubleshooting verification issues
[] Document admin commands for verification management
[] Create procedures for system failures
```
