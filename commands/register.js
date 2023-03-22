const { SlashCommandBuilder } = require("@discordjs/builders")
const {
  findUserInDatabase,
  addUserToDatabase,
} = require("../database/MySqlUserQueries.js")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("add yourself to user database!"),
  async execute(interaction) {
    // variables //
    const commandUser = interaction.user.username
    const commandUserId = interaction.user.id
    const doesUserExist = findUserInDatabase(commandUserId)
    if (doesUserExist) {
      await interaction.reply(`${commandUser} user is already registered~!`)
      return
    }
    const userAdded = await addUserToDatabase(commandUserId, commandUser)
    if (userAdded) {
      await interaction.reply(
        `${commandUser} sucesfully added user to database~!`
      )
    } else {
      await interaction.reply(
        `${commandUser} something went wrong with adding user to database~!`
      )
    }
  },
}
