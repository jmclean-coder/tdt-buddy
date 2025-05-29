import dotenv from 'dotenv'; // Add this import
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

dotenv.config(); // Load environment variables from .env file
// TODO: Clean up API usage by using the Discord.js library instead of direct REST calls?
// Basic ping command for testing
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'verify',
    description: 'Verify your event registration',
    options: [
      {
        name: 'code',
        description: 'Your verification code from the registration email',
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: 'helpverify',
    description: 'Get help with the verification process',
  },
  {
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
  },
  {
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
  },
  {
    name: 'listyears',
    description: 'List all active and archived event years',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_APPLICATION_ID,
          process.env.GUILD_ID,
        ),
        { body: commands },
      );
      console.log(`Successfully registered guild commands for guild ID: ${process.env.GUILD_ID}`);
    }
  }
  catch (error) {
    console.error('Error registering commands:', error);
  }
})();