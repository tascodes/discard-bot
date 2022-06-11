import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import { commands } from "./commands";
import { Command, CommandName } from "./models/command";

dotenv.config();

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error("DISCORD_TOKEN must be configured in environment");
  process.exit(1);
}

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

const commandMap = new Map<CommandName, Command>();
commands.forEach((command) => {
  if (!command.data?.name) {
    return;
  }

  commandMap.set(<CommandName>command.data.name, command);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isModalSubmit()) {
    console.log("Modal Submit:", interaction);
  }

  if (
    !interaction.isApplicationCommand() &&
    !interaction.isCommand() &&
    !interaction.isContextMenu()
  ) {
    return;
  }

  const { commandName } = interaction;
  const command = commandMap.get(<CommandName>commandName);

  if (command) {
    await command.execute(interaction);
  }
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

// Login to Discord with your client's token
client.login(token);
