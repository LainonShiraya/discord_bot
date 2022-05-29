const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../mockupData.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("add yourself to user database!"),
  async execute(interaction) {
    // variables //
    const commandUser = interaction.user.username;
    const findUser = users.some(user => user.username === commandUser);
    /////////////////
    if (interaction.commandName === "register") {
      if (findUser) {
        await interaction.reply(`${commandUser} user is already registered~!`);
      }
      if (!findUser) {
        users.push({
          username: commandUser,
          decklists: [],
        });
        await interaction.reply(
          `${commandUser} sucesfully added to database~!`
        );
      }
    }
  },
};
