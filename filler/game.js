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
        .addStringOption(deck =>
          deck
            .setName("deck_1")
            .setDescription("Decklist of first player")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(userprop =>
          userprop
            .setName("player_2")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addStringOption(deck =>
          deck
            .setName("deck_2")
            .setDescription("Decklist of second player")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(userprop =>
          userprop
            .setName("player_3")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addStringOption(deck =>
          deck
            .setName("deck_3")
            .setDescription("Decklist of third player")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addUserOption(userprop =>
          userprop
            .setName("player_4")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addStringOption(deck =>
          deck
            .setName("deck_4")
            .setDescription("Decklist of fourth player")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  async execute(interaction) {
    // variables //
    try {
      const player1 = interaction.options.getUser("player_1").username;
      const player2 = interaction.options.getUser("player_2").username;
      const player3 = interaction.options.getUser("player_3").username;
      const player4 = interaction.options.getUser("player_4").username;
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
      if (!interaction.isCommand())
        /////////////////
        return;
      if (interaction.commandName === "game") {
        const inputPlayer1 = new MessageSelectMenu()
          .setCustomId("player1_deck")
          .addOptions(
            users
              .find(user => user.username === player1)
              .decklists.map(deck => {
                return {
                  label: deck.deckname,
                  description: `Decklist of ${player1}`,
                  value: `${player1} : ${deck.deckname}`,
                };
              })
          );
        const inputPlayer2 = new MessageSelectMenu()
          .setCustomId("player2_deck")
          .addOptions(
            users
              .find(user => user.username === player2)
              .decklists.map(deck => {
                return {
                  label: deck.deckname,
                  description: `Decklist of ${player2}`,
                  value: `${player2} : ${deck.deckname}`,
                };
              })
          );
        const inputPlayer3 = new MessageSelectMenu()
          .setCustomId("player3_deck")
          .addOptions(
            users
              .find(user => user.username === player3)
              .decklists.map(deck => {
                return {
                  label: deck.deckname,
                  description: `Decklist of ${player3}`,
                  value: `${player3} : ${deck.deckname}`,
                };
              })
          );
        const inputPlayer4 = new MessageSelectMenu()
          .setCustomId("player4_deck")
          .addOptions(
            users
              .find(user => user.username === player4)
              .decklists.map(deck => {
                return {
                  label: deck.deckname,
                  description: `Decklist of ${player4}`,
                  value: `${player4} : ${deck.deckname}`,
                };
              })
          );
        const gameWinner = new MessageSelectMenu()
          .setCustomId("players_list")
          .addOptions([
            {
              label: player1,
              description: `Game won ${player1}`,
              value: player1,
            },
            {
              label: player2,
              description: `Game won ${player2}`,
              value: player2,
            },
            {
              label: player3,
              description: `Game won ${player3}`,
              value: player3,
            },
            {
              label: player4,
              description: `Game won ${player4}`,
              value: player4,
            },
          ]);
        const firstActionRow = new MessageActionRow().addComponents(
          inputPlayer1
        );
        const secondActionRow = new MessageActionRow().addComponents(
          inputPlayer2
        );
        const thirdActionRow = new MessageActionRow().addComponents(
          inputPlayer3
        );
        const fourthActionRow = new MessageActionRow().addComponents(
          inputPlayer4
        );
        const fithActionRow = new MessageActionRow().addComponents(gameWinner);

        const embed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle("Game Result")
          .setDescription("Select the deck of the users");

        // Show the modal to the user
        await interaction.reply({
          content: "Sucess!",
          embeds: [embed],
          components: [
            firstActionRow,
            secondActionRow,
            thirdActionRow,
            fourthActionRow,
            fithActionRow,
          ],
        });
      }
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

  async autocomplete(interaction) {
    // variables //
    const subCommands = interaction.options.getSubcommand();
    const commandUser = interaction.user.username;
    ////////////
    if (subCommands === "record") {
      const focusedValue = interaction.options.getFocused();
      const choices = users
        .find(user => user.username == commandUser)
        .decklists.map(function (deck) {
          return deck["deckname"];
        });
      console.log(users.find(user => user.username == commandUser));
      console.log(choices);
      const filtered = choices.filter(choice =>
        choice.startsWith(focusedValue)
      );
      const response = await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice }))
      );
    }
  },
};

//   async selectmenus(interaction) {
//     // /game record player_1:@LainonShiraya#5338 player_2:@vemreis#2216 player_3:@ShirayaBot#7773 player_4:@SpellBot#2346

//     console.log(interaction.values);

//     // console.log(interaction.modal);
//     // console.log(interaction.components);
//     // const player1 = interaction.fields.g.split(":")[1];
//     // const player2 = interaction.fields
//     //   .getTextInputValue("player2_deck")
//     //   .split(":")[1];
//     // const player3 = interaction.fields
//     //   .getTextInputValue("player3_deck")
//     //   .split(":")[1];
//     // const player4 = interaction.fields
//     //   .getTextInputValue("player4_deck")
//     //   .split(":")[1];
//     // const playerWon = interaction.fields
//     //   .getTextInputValue("players_list")
//     //   .split(":")[1];
//     const playerList = [player1, player2, player3, player4];
//     console.log("modalsubmit function working");
//     const embed = new MessageEmbed()
//       .setColor("#0099ff")
//       .setTitle("Result of the game")
//       .setURL("https://discord.js.org").setDescription(` ${player1} /n
//       ${player2} /n
//       ${player3} /n
//       ${player4} /n
//       ///////////// WINNER /////////////////
//         ${playerWon}
//       `);
//     const row = new MessageActionRow().addComponents(
//       new MessageButton()
//         .setCustomId("confirmButton")
//         .setLabel("Correct")
//         .setStyle("SUCCESS"),
//       new MessageButton()
//         .setCustomId("DenyButton")
//         .setLabel("Wrong")
//         .setStyle("DANGER")
//     );
//     await interaction.reply({
//       content: "Sucess!",
//       embeds: [embed],
//       components: [row],
//     });
//   },

//   async buttonSubmit(interaction) {
//     const filter = i =>
//       i.customId === "confirmButton" || i.customId === "DenyButton";
//     const collector = interaction.channel.createMessageComponentCollector({
//       filter,
//       max: 4,
//       time: 15000,
//       componentType: "BUTTON",
//     });
//     collector.on("collect", i => {
//       if (playerList.includes(i.user.username)) {
//         playerList = playerList.filter(v => v !== i.user.username);
//         i.reply(`${i.user.username} Sucessfuly submitted a result of the game`);
//       } else {
//         i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
//       }
//     });
//   },
// };

// //  [
// // { label: "Yeva", description: " this is yeva deck", value: "Yeva" },
// // {
// //   label: "Yeva2",
// //   description: " this is yeva deck2",
// //   value: "Yeva2",
// // },
// // ]
