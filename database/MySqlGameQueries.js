const {
  insertQuery,
  updateQuery,
  insertQueryReturnsId,
} = require("./DbQueries.js")
const { getUserSelectedDeckFromDatabase } = require("./MySqlDeckQueries")
async function createGame() {
  const gameResultId = await insertQueryReturnsId(
    "Insert into game(Date) values (CURDATE())",
    []
  )
  if (!!gameResultId) {
    return gameResultId
  }
  return false
}

async function assignDecksToGame(
  gameID,
  player1ID,
  player2ID,
  player3ID,
  winnerID,
  discordId
) {
  const playerDeck_1 = await getUserSelectedDeckFromDatabase(player1ID)
  const playerDeck_2 = await getUserSelectedDeckFromDatabase(player2ID)
  const playerDeck_3 = await getUserSelectedDeckFromDatabase(player3ID)
  const winnerDeck = await getUserSelectedDeckFromDatabase(winnerID)

  const addDecksToTheGame = await insertQuery(
    "Insert into deck_game(Game_Game_ID, Deck_1_Deck_ID, Deck_2_Deck_ID, Deck_3_Deck_ID, Deck_4_Deck_ID, Winner,discord_Channel_ID) values(?,?,?,?,?,?,?)",
    [
      gameID,
      playerDeck_1.Deck_ID,
      playerDeck_2.Deck_ID,
      playerDeck_3.Deck_ID,
      winnerDeck.Deck_ID,
      winnerDeck.Deck_ID,
      discordId,
    ]
  )
  if (addDecksToTheGame) {
    await updateQuery(
      "update deck_stats set Loses = Loses + 1 where ( Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID  = ? ) AND Selected = true AND Discord_Channel_ID = ?",
      [
        playerDeck_1.Deck_ID,
        playerDeck_2.Deck_ID,
        playerDeck_3.Deck_ID,
        discordId,
      ]
    ),
      await updateQuery(
        "update deck_stats set Wins = Wins + 1 where Deck_Deck_ID  = ? AND Discord_Channel_ID = ?",
        [winnerDeck.Deck_ID, discordId]
      ),
      await updateQuery(
        "update deck_stats set Games = Games + 1 where ( Deck_Deck_ID  = ? or Deck_Deck_ID  = ? or Deck_Deck_ID  = ? or Deck_Deck_ID  = ? ) AND Selected = true AND Discord_Channel_ID = ?",
        [
          playerDeck_1.Deck_ID,
          playerDeck_2.Deck_ID,
          playerDeck_3.Deck_ID,
          winnerDeck.Deck_ID,
          discordId,
        ]
      )
    return true
  }
  return false
}

module.exports = {
  createGame,
  assignDecksToGame,
}
