const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../mockupData.js");
const { MessageEmbed } = require("discord.js");
const {
  showAllUsersEmbed,
  showCertainUserEmbed,
} = require("../functions/embedCreatorFunctions");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("users")
    .setDescription("Options related to the users !")
    .addSubcommandGroup(subcommand =>
      subcommand
        .setName("show")
        .setDescription("show user data!")
        .addSubcommand(comm =>
          comm
            .setName("all")
            .setDescription("Show all users with statistics and decklists")
        )
        .addSubcommand(user =>
          user
            .setName("user")
            .setDescription("Show all lists of the user")
            .addUserOption(userprop =>
              userprop
                .setName("user")
                .setDescription(
                  "user you want to check lists and statistics of"
                )
                .setRequired(true)
            )
        )
    ),

  async execute(interaction) {
    //variables //
    const subCommandsGroup = interaction.options.getSubcommandGroup();
    const subCommands = interaction.options.getSubcommand();
    /////////////////
    if (subCommandsGroup === "show") {
      if (subCommands === "all") {
        interaction.reply({ embeds: [showAllUsersEmbed()] });
      }
      if (subCommands === "user") {
        //variables //
        const userFound = users.find(
          user => user.username === interaction.options.getUser("user").username
        );
        /////////////////
        if (userFound) {
          if (userFound.decklists.length > 0) {
            interaction.reply({
              embeds: [showCertainUserEmbed(userFound, interaction)],
            });
          }
          if (!(userFound.decklists.length > 0)) {
            await interaction.reply(
              ` ${
                interaction.options.getUser("user").username
              } has no decklists added`
            );
          }
        }
        if (!userFound) {
          await interaction.reply(
            ` ${
              interaction.options.getUser("user").username
            } has not registered to database`
          );
        }
      }
    }
  },
};
