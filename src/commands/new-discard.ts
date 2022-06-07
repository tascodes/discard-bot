import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { MessageActionRow, Modal, TextInputComponent } from "discord.js";
import { Command, CommandName } from "../models/command";

const newDiscard: Command = {
  data: new ContextMenuCommandBuilder()
    .setName(CommandName.NEW_DISCARD)
    .setType(ApplicationCommandType.Message),
  execute: async (interaction) => {
    if (!interaction.isApplicationCommand()) return;

    const modal = new Modal()
      .setCustomId("makeADocModal")
      .setTitle("Make a new Discard");

    const titleInput = new TextInputComponent()
      .setCustomId("titleInput")
      .setLabel("What should we title this Discard?")
      .setStyle("SHORT");

    const titleActionRow = new MessageActionRow().addComponents(
      <any>titleInput
    );

    const tagsInput = new TextInputComponent()
      .setCustomId("tagInput")
      .setLabel("Enter tags separated by commas")
      .setStyle("PARAGRAPH");

    const tagsActionRow = new MessageActionRow().addComponents(<any>tagsInput);

    modal.addComponents(<any>titleActionRow, <any>tagsActionRow);

    await interaction.showModal(modal);
  },
};

export default newDiscard;
