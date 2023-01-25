const { SlashCommandBuilder } = require("@discordjs/builders");
const { users } = require("../mockupData.js");
const {
  MessageActionRow,
  Modal,
  TextInputComponent,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Commands related to the game")
    .addSubcommand(subcommand =>
      subcommand
        .setName("record")
        .setDescription("Record a game you have played!")
        .addUserOption(userprop =>
          userprop
            .setName("player_1")
            .setDescription("Discord nickname of a player ")
            .setRequired(true)
        )
        .addUserOption(userprop =>
          userprop
            .setName("player_2")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addUserOption(userprop =>
          userprop
            .setName("player_3")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addUserOption(userprop =>
          userprop
            .setName("player_4")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    try {
      const player1 = interaction.options.getUser("player_1").username;
      const player2 = interaction.options.getUser("player_2").username;
      const player3 = interaction.options.getUser("player_3").username;
      const player4 = interaction.options.getUser("player_4").username;
      const deck1 = users
        .find(player => player.username === player1)
        .decklists.find(deck => deck.selected === true);
      const deck2 = users
        .find(player => player.username === player2)
        .decklists.find(deck => deck.selected === true);
      const deck3 = users
        .find(player => player.username === player3)
        .decklists.find(deck => deck.selected === true);
      const deck4 = users
        .find(player => player.username === player4)
        .decklists.find(deck => deck.selected === true);
      if (
        player1 === player2 ||
        player1 === player3 ||
        player1 === player4 ||
        player2 === player3 ||
        player2 === player4 ||
        player3 === player4
      ) {
        throw "Player is repeated !";
      }

      if (!deck1 || !deck2 || !deck3 || !deck4) {
        throw "One player did not select a deck !";
      }

      const gameWinner = new MessageSelectMenu()
        .setCustomId("players_list")
        .addOptions([
          {
            label: player1,
            description: `Game won ${player1}`,
            value: interaction.options.getUser("player_1").id,
          },
          {
            label: player2,
            description: `Game won ${player2}`,
            value: interaction.options.getUser("player_2").id,
          },
          {
            label: player3,
            description: `Game won ${player3}`,
            value: interaction.options.getUser("player_3").id,
          },
          {
            label: player4,
            description: `Game won ${player4}`,
            value: interaction.options.getUser("player_4").id,
          },
        ]);
      const selectReturn = new MessageActionRow().addComponents(gameWinner);
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Game Result")
        .setDescription(
          ` **Select the winner** \n  ${player1} : ${deck1.deckname} \n  ${player2} : ${deck2.deckname} \n  ${player3} : ${deck3.deckname} \n  ${player4} : ${deck4.deckname} `
        );

      // Show the modal to the user
      await interaction.reply({
        content: "Sucess!",
        embeds: [embed],
        components: [selectReturn],
      });
      //////////////
    } catch (error) {
      console.log("Error:");
      console.error(error);
      await interaction.reply({
        content:
          "There was an error while executing this command! " +
          " be sure that every user is selected from discord users and they have decklists registered, and user is not repeated!",
        ephemeral: true,
      });
    }
  },

  async selectmenus(interaction) {
    //     // /game record player_1:@LainonShiraya#5338 player_2:@vemreis#2216 player_3:@ShirayaBot#7773 player_4:@SpellBot#2346

    //console.log(interaction);
    console.log(interaction.message.components[0].options);
    s = interaction.message.embeds[0].description;
    const message = s.split("\n");
    player1 = message[1];
    player2 = message[2];
    player3 = message[3];
    player4 = message[4];
    //console.log(message);
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Result of the game")
      .setURL("https://discord.js.org")
      .setDescription(` ${player1} \n${player2} \n${player3} \n${player4} \n------------- WINNER -------------
        ${interaction.values}
      `);
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("ConfirmButton")
        .setLabel("Correct")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("DenyButton")
        .setLabel("Wrong")
        .setStyle("DANGER")
    );

    const test = await interaction.reply({
      content: "Sucess!",
      embeds: [embed],
      fetchReply: true,
      components: [row],
    });
    const collector = test.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 15000,
    });

    collector.on("collect", i => {
      console.log("options ---------------");
      console.log(interaction.options);
      i.reply(`${player1} Canceled the game`);
    });
  },

  // pass fetchReply: true in your interaction.reply and save the resulting message in a var. then call createMessageComponentCollector on that var, like https://discordjs.guide/popular-topics/collectors.html#basic-message-component-collector
  // async buttonSubmit(interaction) {
  //   playerLists = interaction.message.embeds[0].description.split("\n");
  //   playersList = [
  //     playerLists[0].split(":")[0],
  //     playerLists[1].split(":")[0],
  //     playerLists[2].split(":")[0],
  //     playerLists[3].split(":")[0],
  //   ];
  //   console.log(playersList);
  //   // const filter = i =>
  //   //   i.customId === "ConfirmButton" || i.customId === "DenyButton";

  //   const collector = interaction.channel.createMessageComponentCollector({
  //     // filter,
  //     max: 4,
  //     time: 600000,
  //     componentType: "BUTTON",
  //   });

  //   collector.on("collect", i => {
  //     console.log(i.user.username);
  //     let result;
  //     playersList.map(function (player) {
  //       if (player.includes(i.user.username)) result = true;
  //     });
  //     if (result) {
  //       playersList = playersList.filter(function (player) {
  //         if (!player.includes(i.user.username)) return player;
  //       });
  //       console.log("dziala");
  //       console.log(playersList);

  //       if (i.customId === "ConfirmButton") {
  //         i.reply(
  //           `${i.user.username} Sucessfuly submitted a result of the game`
  //         );
  //       }
  //       if (i.customId === "DenyButton") {
  //         i.reply(`${i.user.username} Canceled the game`);
  //       }
  //     } else {
  //       i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
  //     }
  //   });
  //   collector.on("end", collected => {
  //     console.log(`Collected ${collected.size} interactions.`);
  //   });
  // },
};

///game record player_1:@LainonShiraya#5338 player_2:@vemreis#2216 player_3:@ShirayaBot#7773 player_4:@SpellBot#2346
