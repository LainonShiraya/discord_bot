const { SlashCommandBuilder } = require("@discordjs/builders")
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js")
const {
  createGame,
  assignDecksToGame,
} = require("../database/MySqlGameQueries.js")
const { selectUserInDatabase } = require("../database/MySqlUserQueries.js")
const {
  getUserSelectedDeckFromDatabase,
} = require("../database/MySqlDeckQueries.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Commands related to the game")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("record")
        .setDescription("Record a game you have played!")
        .addUserOption((userprop) =>
          userprop
            .setName("player_1")
            .setDescription("Discord nickname of a player ")
            .setRequired(true)
        )
        .addUserOption((userprop) =>
          userprop
            .setName("player_2")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addUserOption((userprop) =>
          userprop
            .setName("player_3")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
        .addUserOption((userprop) =>
          userprop
            .setName("player_4")
            .setDescription("Discord nickname of a player")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    try {
      const player1 = interaction.options.getUser("player_1")
      const player2 = interaction.options.getUser("player_2")
      const player3 = interaction.options.getUser("player_3")
      const player4 = interaction.options.getUser("player_4")
      const deck1 = await getUserSelectedDeckFromDatabase(
        interaction.options.getUser("player_1").id
      )
      const deck2 = await getUserSelectedDeckFromDatabase(
        interaction.options.getUser("player_2").id
      )
      const deck3 = await getUserSelectedDeckFromDatabase(
        interaction.options.getUser("player_3").id
      )
      const deck4 = await getUserSelectedDeckFromDatabase(
        interaction.options.getUser("player_4").id
      )

      const gameWinner = new MessageSelectMenu()
        .setCustomId("players_list")
        .addOptions([
          {
            label: player1.username,
            description: `Game won ${player1.username}`,
            value: player1.id,
          },
          {
            label: player2.username,
            description: `Game won ${player2.username}`,
            value: player2.id,
          },
          {
            label: player3.username,
            description: `Game won ${player3.username}`,
            value: player3.id,
          },
          {
            label: player4.username,
            description: `Game won ${player4.username}`,
            value: player4.id,
          },
        ])
      const selectReturn = new MessageActionRow().addComponents(gameWinner)
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Game Result")
        .setDescription(
          ` **Select the winner**
		  \n${player1.username}: ${deck1.Deck_Name} 
		  \n${player2.username}: ${deck2.Deck_Name}
		  \n${player3.username}: ${deck3.Deck_Name}
		  \n${player4.username}: ${deck4.Deck_Name}`
        )

      // Show the modal to the user
      await interaction.reply({
        content: "Sucess!",
        embeds: [embed],
        components: [selectReturn],
        ephemeral: true,
      })

      //////////////
    } catch (error) {
      console.log("Error:")
      console.error(error)
      await interaction.reply({
        content:
          "There was an error while executing this command! " +
          " be sure that every user is selected from discord users and they have decklists registered, and user is not repeated!",
        ephemeral: true,
      })
    }
  },

  async selectmenus(interaction) {
    const tmp = interaction.message.embeds[0].description
    const message = tmp.split("\n")
    player1 = message[2]
    player2 = message[4]
    player3 = message[6]
    player4 = message[8]

    const winnerId = interaction.values[0]
    winner = await selectUserInDatabase(winnerId)

    const discordId = interaction.member.guild.id
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Result of the game")
      .setDescription(`${player1} \n${player2} \n${player3} \n${player4}
	   \n------------- WINNER -------------
        ${winner.username}
      `)

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("ConfirmButton")
        .setLabel("Correct")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("DenyButton")
        .setLabel("Wrong")
        .setStyle("DANGER")
    )

    const sucessButton = await interaction.reply({
      content: "Sucess!",
      embeds: [embed],
      fetchReply: true,
      components: [row],
    })

    const collector = sucessButton.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 15000,
    })

    collector.on("collect", async (i) => {
      player_interacting = i.user.username
      let clickedByPlayer = false
      let playersId = []
      const players = interaction.message.components[0].components[0].options
      players.map((player) => {
        if (player.value === interaction.values[0]) {
          clickedByPlayer = true
        } else {
          playersId.push(player.value)
        }
      })

      if (i.customId === "ConfirmButton" && clickedByPlayer) {
        const game = await createGame()

        if (!!game) {
          assignDecks = await assignDecksToGame(
            game,
            playersId[0],
            playersId[1],
            playersId[2],
            winnerId,
            discordId
          )
        } else {
          i.reply(`There's error with creating game`)
        }

        if (game) {
          i.reply(`${player_interacting} has confirmed the game`)
        } else {
          i.reply(
            `There is a problem with adding the game, contact the bot administrator`
          )
        }
      }

      if (i.customId === "DenyButton" && clickedByPlayer) {
        i.reply(`${player_interacting} has canceled the game`)
      }
      if (!clickedByPlayer) {
        i.reply(
          `${player_interacting} did not participate in the game, game has to be confirmed by one of the players`
        )
      }
    })
  },
}
