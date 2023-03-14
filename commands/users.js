const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../mockupData.js");
const { MessageEmbed } = require("discord.js");
const {findUserInDatabase } = require('../functions/MysqlDataManagementFunctions');

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
	const  user = interaction.options.getUser("user");
    /////////////////
    if (subCommandsGroup === "show") {
      if (subCommands === "all") {

			const api =	await showAllUsersEmbed().then( response => {
			 	 return response;
				});

			const embed = new MessageEmbed()
			.setColor("#0099ff")
			.setTitle("Statistics of all users: ")
			.addFields(api)
			.setDescription('It shows decks that got selected on atleast once');

			await interaction.reply({ embeds: [embed] });

      }
      if (subCommands === "user") {

		const userExists = await findUserInDatabase(user.id).then(res => {
			return res;
		})

		if(userExists){
			const api = await showCertainUserEmbed(interaction).then( res => {
				return res;
			} )
				await interaction.reply({ embeds: [api] });
		}
		else {
 await interaction.reply(
            ` ${
				user.username
            } has not registered to database`
          );
		}
      }
    }
  },
};
