import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { MessageActionRow, Modal, TextInputComponent } from "discord.js";
import { Command, CommandName } from "../models/command";
import { z } from "zod";
import fetch from "node-fetch";

const MODAL_ID = "NewDiscard";

const newDiscard: Command = {
  data: new ContextMenuCommandBuilder()
    .setName(CommandName.NEW_DISCARD)
    .setType(ApplicationCommandType.Message),

  execute: async (interaction) => {
    if (
      !interaction.isApplicationCommand() ||
      !interaction.isMessageContextMenu()
    ) {
      return;
    }

    //     if (!!interaction.targetMessage.thread) {
    //       const thread = <ThreadChannel>interaction.targetMessage.thread;
    //
    //       const topMessage = <Message>(<unknown>interaction.targetMessage);
    //
    //       const messageContent = {
    //         content: interaction.targetMessage.content,
    //         created: new Date(topMessage.createdTimestamp),
    //         author: topMessage.author.username,
    //         authorPicture: topMessage.author.avatarURL({
    //           dynamic: false,
    //         }),
    //       };
    //
    //       const threadMessages = await thread.messages.fetch();
    //       const threadMessageContents = threadMessages
    //         .filter((message) => !!message.content?.length)
    //         .sort((a, b) => {
    //           return a.createdTimestamp - b.createdTimestamp;
    //         })
    //         .map((message) => {
    //           return {
    //             content: message.content,
    //             created: new Date(message.createdTimestamp),
    //             author: message.author.username,
    //             authorPicture: message.author.avatarURL({ dynamic: false }),
    //           };
    //         });
    //
    //       console.log(messageContent);
    //
    //       console.log(threadMessageContents);
    //
    //       await interaction.reply("Done!");
    //
    //       return;
    //     }

    const customIdData = new URLSearchParams({
      id: MODAL_ID,
      messageId: interaction.targetMessage.id,
    });

    const modal = new Modal()
      .setCustomId(customIdData.toString())
      .setTitle("Create a Discard");

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

  onModalSubmit: async (interaction) => {
    if (!interaction.isModalSubmit()) {
      return;
    }

    const customIdData = new URLSearchParams(interaction.customId);
    const id = customIdData.get("id");
    const messageId = customIdData.get("messageId");

    if (id !== MODAL_ID || !messageId) {
      return;
    }

    const title = z
      .string()
      .min(1)
      .max(100)
      .parse(interaction.fields.getTextInputValue("titleInput"));
    const tags = z.array(z.string()).parse(
      interaction.fields
        .getTextInputValue("tagInput")
        .split(",")
        .map((tag) => tag.trim())
    );

    const message = await interaction.channel?.messages.fetch(messageId);

    if (!message) {
      throw new Error(`Message with id ${messageId} was not found.`);
    }

    if (message.system) {
      throw new Error(`You cannot create a Discard from a system message.`);
    }

    const messageAttachments = Array.from(message.attachments.entries()).map(
      ([id, attachment]) => {
        return {
          id,
          url: attachment.url,
          name: attachment.name,
          contentType: attachment.contentType,
          description: attachment.description,
          width: attachment.width,
          height: attachment.height,
        };
      }
    );

    const body = {
      title,
      tags,
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        guildId: message.guildId,
        url: message.url,
        author: {
          username: message.author.username,
          avatar: message.author.avatarURL,
          id: message.author.id,
        },
        attachments: messageAttachments,
      },
    };

    await fetch("localhost:3000/api/v1/discards", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

export default newDiscard;
