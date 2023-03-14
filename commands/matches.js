const { SlashCommandBuilder } = require("@discordjs/builders");
const {
	showMatchHistoryAll,
	showMatchHistoryUser,
  } = require("../functions/embedCreatorFunctions");
  const {deleteGameFromHistory} = require('../functions/MysqlDataManagementFunctions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("matches")
    .setDescription("Check recently played games")
	.addSubcommand(subcommand =>
		subcommand
		  .setName("user")
		  .setDescription("Match history of selected user!")
		  .addUserOption(userprop =>
			userprop
			  .setName("player")
			  .setDescription("Discord nickname of a player ")
			  .setRequired(true)
		  ))
		  .addSubcommand(subcommand =>
			subcommand
			  .setName("all")
			  .setDescription("Match history of selected user!")
			  )
			  .addSubcommand(subcommand =>
				subcommand
				  .setName("delete")
				  .setDescription("Delete certain match and revoke wins/loses/games from it, only for discord admins!")
				  .addIntegerOption(option =>
					option
					  .setName("id")
					  .setDescription("game ID to be revoked")
					  .setRequired(true)
				  )),
  async execute(interaction) {
    // variables //
	const subCommand = interaction.options.getSubcommand();
	const discordId = interaction.member.guild.id;
	const gameId = interaction.options.getInteger("id");

	if (subCommand === "user") {

		const api = await showMatchHistoryUser(interaction,discordId).then( res => {
			return res;
		} )
			await interaction.reply({ embeds: [api] });

	}
	if(subCommand === 'all'){
			const api = await showMatchHistoryAll(discordId).then( res => {
				return res;
			} )
				await interaction.reply({ embeds: [api] });
	}
	if(subCommand === 'delete'){

		const hasRole = interaction.member.roles.cache.some(r => r.name === 'Administrator' || 'Admin' || 'admin' || 'administrator');

		if(hasRole){
			const commandUser = interaction.user.username;
		 	await deleteGameFromHistory(gameId,discordId).then( async res => {
			if(res){
				await interaction.reply(
					`${commandUser} successfully deleted a match from the history~!`
				  );
			} else {
				await interaction.reply(
					`${commandUser} unsuccessfully deleted a match from the history~!`
				  );
			}
		}) }
}
  },
};
