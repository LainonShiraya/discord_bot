const { SlashCommandBuilder } = require("@discordjs/builders");
// const { users } = require("../mockupData.js");
//const { MessageEmbed } = require("discord.js");
const {findDeckInDatabase, addDeckToDatabase, selectDeckfromDatabase, getAllDecksfromDatabase } = require('../functions/MysqlDataManagementFunctions');
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
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("select")
        .setDescription("Select decklist as your main!")
        .addStringOption(option =>
          option
            .setName("deck")
            .setDescription("put the name of your deck")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  // TODO
  // add games played & games won in deck stats as a new command file

  async execute(interaction) {
    // variables //
    const subCommands = interaction.options.getSubcommand();
    const commandUser = interaction.user.username;
   // const userFind = users.find(user => user.username === commandUser);
    ////////////
    if (subCommands === "add") {
		findDeckInDatabase(interaction.user.id,interaction.options.getString("deck")).then(async response => {
			if(response){
				await interaction.reply(`Your Deck with that name already exists`);
			}
			if(!response){
				addDeckToDatabase(interaction.user.id,interaction.options.getString("list"),interaction.options.getString("deck")).then(async response => {
					if(response > 0){
						await interaction.reply(
							`${commandUser} sucesfully added deck to database~!`
						  );
					} else {
						await interaction.reply(
							`${commandUser} something went wrong with adding deck to database~!`
						  );
					}
				})
			}
		})
    //   if (userFind) {
    //     userFind.decklists.push({
    //       deckname: interaction.options.getString("deck"),
    //       decklink: interaction.options.getString("list"),
    //       wins: 0,
    //       loses: 0,
    //     });
    //   }
 //     await interaction.reply(`added deck`);
    }
    if (!subCommands) {
      await interaction.reply(`Unknown deck option`);
    }
    if (subCommands === "select") {
		//selectDeckfromDatabase(interaction.user.id,interaction.options.getString("deck"))

		findDeckInDatabase(interaction.user.id,interaction.options.getString("deck")).then(async response => {
			if(response){
				selectDeckfromDatabase(interaction.user.id,interaction.options.getString("deck")).then( async res => {
					if(res > 0){
						await interaction.reply(
							`${commandUser} sucesfully selected deck in database~!`
						  );
					} else {
						await interaction.reply(
							`${commandUser} something went wrong with selecting a deck in database~!`
						  );
					}
				})
			} else{
				await interaction.reply(
					`Deck does not exist: ${interaction.options.getString(
					  "deck"
					)} , check the spelling and if the deck is registered, contact admin if both cases are correct`
				  );
			}
		})
    //   const deck = userFind.decklists.find(
    //     deck => deck.deckname === interaction.options.getString("deck")
    //   );
    //   if (deck) {
    //     userFind.decklists.forEach(function unselect(deck) {
    //       deck.selected = false;
    //     });
    //     deck.selected = true;
    //     await interaction.reply(
    //       `Sucessfuly selected deck: ${interaction.options.getString("deck")} `
    //     );
    //   } else {
    //     await interaction.reply(
    //       `Deck does not exist: ${interaction.options.getString(
    //         "deck"
    //       )} , check the spelling and if the deck is registered, contact admin if both cases are correct`
    //     );
    //   }
    }
  },

  async autocomplete(interaction) {
    // variables //
    const subCommands = interaction.options.getSubcommand();
    const commandUser = interaction.user.username;
    ////////////
    if (subCommands === "select") {
      const focusedValue = interaction.options.getFocused();
	  getAllDecksfromDatabase(interaction.user.id).then(async res => {
		const choices = res.map( function (deck) {
			return deck['Deck_Name'];
		});
		console.log(choices);
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		const response = await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice }))
		  );
	  });
    //   const choices = users
    //     .find(user => user.username == commandUser)
    //     .decklists.map(function (deck) {
    //       return deck["deckname"];
    //     });
     // console.log(users.find(user => user.username == commandUser));
    //   console.log(choices);
    //   const filtered = choices.filter(choice =>
    //     choice.startsWith(focusedValue)
    //   );
    //   const response = await interaction.respond(
    //     filtered.map(choice => ({ name: choice, value: choice }))
    //   );
    }
  },
};
