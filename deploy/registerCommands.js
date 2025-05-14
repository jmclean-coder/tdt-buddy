// deploy/register-commands.js
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Basic ping command for testing
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_APPLICATION_ID,
        process.env.GUILD_ID,
      ),
      { body: commands },
    );

    console.log('Commands registered successfully!');
  }
  catch (error) {
    console.error('Error registering commands:', error);
  }
})();