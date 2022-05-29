const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../mockupData.js");
const { MessageEmbed } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("decks")
    .setDescription("Options related to your decks !")
    .addSubcommand(subcommand =>
      subcommand
        .setName("add")
        .setDescription("Add decklist to your account!")
        .addStringOption(option =>
          option
            .setName("deck")
            .setDescription("put the name of your deck")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("list")
            .setDescription(
              "put the list of your deck here, moxfield preferably"
            )
            .setRequired(true)
        )
    ),

  // TODO
  // add games played & games won in deck stats as a new command file

  async execute(interaction) {
    // variables //
    const userCommand = interaction.user.username;
    const subCommands = interaction.options.getSubcommand();
    const userFind = users.find(user => user.username === userCommand);
    ////////////
    if (subCommands === "add") {
      if (userFind) {
        userFind.decklists.push({
          deckname: interaction.options.getString("deck"),
          decklink: interaction.options.getString("list"),
          wins: 0,
          loses: 0,
        });
      }
      await interaction.reply(`added deck`);
    }
    if (subCommands) {
      await interaction.reply(`Unknown deck option`);
    }
  },
};
