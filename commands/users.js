const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { findUserInDatabase } = require("../database/MySqlUserQueries.js")
const {
  showAllUsersEmbed,
  showCertainUserEmbed,
} = require("../functions/embedCreatorFunctions")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("users")
    .setDescription("Options related to the users !")
    .addSubcommandGroup((subcommand) =>
      subcommand
        .setName("show")
        .setDescription("show user data!")
        .addSubcommand((comm) =>
          comm
            .setName("all")
            .setDescription("Show all users with statistics and decklists")
        )
        .addSubcommand((user) =>
          user
            .setName("user")
            .setDescription("Show all lists of the user")
            .addUserOption((userprop) =>
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
    const subCommandsGroup = interaction.options.getSubcommandGroup()
    const subCommands = interaction.options.getSubcommand()
    const user = interaction.options.getUser("user")
    let userExists
    let userEmbed
    /////////////////
    if (subCommandsGroup === "show") {
      if (subCommands === "all") {
        const api = await showAllUsersEmbed().then((response) => {
          return response
        })

        const embed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Statistics of all users: ")
          .addFields(api)
          .setDescription("It shows decks that got selected atleast once")

        await interaction.reply({ embeds: [embed] })
      }
      if (subCommands === "user") {
        userExists = await findUserInDatabase(user.id)
      }

      if (userExists) {
        userEmbed = await showCertainUserEmbed(interaction)
        await interaction.reply({ embeds: [userEmbed] })
      } else {
        await interaction.reply(
          ` ${user.username} has not registered to database`
        )
      }
    }
  },
}
