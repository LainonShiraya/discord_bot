const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../mockupData.js");
const {findUserInDatabase, addUserToDatabase } = require('../functions/MysqlDataManagementFunctions');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("add yourself to user database!"),
  async execute(interaction) {
    // variables //
    const commandUser = interaction.user.username;
     findUserInDatabase(interaction.user.id)
	 .then(
		async res => {
			if(res){
				await interaction.reply(`${commandUser} user is already registered~!`);
			}	
			if(!res){
				addUserToDatabase(interaction.user.id, commandUser).then(async res => {
					if(res > 0){
						await interaction.reply(
							`${commandUser} sucesfully added user to database~!`
						  );
					} else {
						await interaction.reply(
							`${commandUser} something went wrong with adding user to database~!`
						  );
					}
				})
			}
		}); 
  },
};
