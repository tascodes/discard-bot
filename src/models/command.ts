import { Awaitable, CacheType, Interaction } from "discord.js";

export interface Command {
  data: any;
  execute: (interaction: Interaction<CacheType>) => Awaitable<any>;
  onModalSubmit?: (interaction: Interaction<CacheType>) => Awaitable<any>;
}

export enum CommandName {
  PING = "ping",
  NEW_DISCARD = "New Discard",
}
