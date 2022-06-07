import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";
import { commands } from "./commands";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error(
    "DISCORD_TOKEN, GUILD_ID, and DISCORD_CLIENT_ID must be configured in environment"
  );
  process.exit(1);
}

const commandsToRegister = commands.map((command) => command.data.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commandsToRegister,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
