const { SlashCommandBuilder } = require("@discordjs/builders")
const {
  findDeckInDatabase,
  addDeckToDatabase,
  selectDeckFromDatabase,
  getAllDecksFromDatabase,
  updateDecklistLink,
} = require("../database/MySqlDeckQueries")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("decks")
    .setDescription("Options related to your decks !")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add decklist to your account!")
        .addStringOption((option) =>
          option
            .setName("deck")
            .setDescription("put the name of your deck")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("list")
            .setDescription(
              "put the list of your deck here, moxfield preferably"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("select")
        .setDescription("Select decklist as your main!")
        .addStringOption((option) =>
          option
            .setName("deck")
            .setDescription("put the name of your deck")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Change the link to your decklist!")
        .addStringOption((option) =>
          option
            .setName("deck")
            .setDescription("put the name of your deck")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription("put the link to decklist")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    // variables //
    const subCommands = interaction.options.getSubcommand()
    const commandUser = interaction.user.username
    const userId = interaction.user.id
    const deckList = interaction.options.getString("list")
    const deckName = interaction.options.getString("deck")
    const deckLink = interaction.options.getString("link")
    const discordId = interaction.member.guild.id
    if (!subCommands) {
      await interaction.reply(`Unknown deck option`)
    }
    if (subCommands === "add") {
      findDeckInDatabase(userId, deckName).then(async (response) => {
        if (!response) {
          addDeckToDatabase(userId, deckList, deckName).then(
            async (response) => {
              if (response > 0) {
                await interaction.reply(
                  `${commandUser} successfully added deck to database~!`
                )
              } else {
                await interaction.reply(
                  `${commandUser} something went wrong with adding deck to database~!`
                )
              }
            }
          )
          return
        }
        await interaction.reply(`Your Deck with that name already exists`)
        return
      })
    }
    if (subCommands === "select") {
      findDeckInDatabase(userId, deckName).then(async (response) => {
        const DeckId = response.Deck_ID
        if (response) {
          const deckSelection = await selectDeckFromDatabase(
            DeckId,
            discordId,
            userId
          )
          if (deckSelection) {
            await interaction.reply(
              `${commandUser} successfully selected deck in database~!`
            )
            return
          }
          await interaction.reply(
            `${commandUser} something went wrong with selecting a deck in database~!`
          )
          return
        }
        await interaction.reply(
          `Deck does not exist: ${deckName}, 
					check the spelling and if the deck is registered, contact admin if both cases are correct`
        )
        return
      })
    }
    if (subCommands === "update") {
      const decklistUpdated = await updateDecklistLink(
        deckLink,
        userId,
        deckName
      )
      if (decklistUpdated) {
        await interaction.reply(
          `${commandUser} successfully changed link to decklist-~!`
        )
        return
      }
      await interaction.reply(
        `${commandUser} Link do decklist could not be changed~!`
      )
      return
    }
  },

  async autocomplete(interaction) {
    // variables //
    const subCommands = interaction.options.getSubcommand()
    const focusedValue = interaction.options.getFocused()
    ////////////
    if (subCommands === "select" || subCommands === "update") {
      getAllDecksFromDatabase(interaction.user.id).then(async (res) => {
        const choices = res.map(function (deck) {
          return deck["Deck_Name"]
        })
        const filtered = choices.filter((choice) =>
          choice.startsWith(focusedValue)
        )
        const response = await interaction.respond(
          filtered.map((choice) => ({ name: choice, value: choice }))
        )
      })
    }
  },
}
