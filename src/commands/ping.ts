import { SlashCommandBuilder } from "@discordjs/builders";
import { Command, CommandName } from "../models/command";

const pingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName(CommandName.PING)
    .setDescription("Replies with Pong!"),

  async execute(interaction) {
    if (!interaction.isCommand()) {
      return;
    }

    await interaction.reply("Pong!");
  },
};

export default pingCommand;
