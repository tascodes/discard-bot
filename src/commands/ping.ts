import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandName } from "../models/command";
import fetch from "node-fetch";

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName(CommandName.PING)
    .setDescription("Replies with Pong!"),

  async execute(interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    const res = await fetch("http://localhost:3000/api/v1/ping");
    const body = await res.text();

    await interaction.reply(body);
  },
};

export default pingCommand;
