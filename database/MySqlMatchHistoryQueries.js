import {
  doesExistQuery,
  insertQuery,
  getDataQuery,
  updateQuery,
  deleteQuery,
} from "./DbQueries.js"

async function getMatchHistoryOfDiscord(discordId) {
  return await getDataQuery(
    "select Game_Game_ID as Game_ID, d1.Deck_name deck_1,  d2.Deck_name deck_2, d3.Deck_name deck_3, d4.Deck_name deck_4, d5.Deck_name Winner_deck," +
      " u1.username username_1, u2.username username_2, u3.username username_3, u4.username username_4, u5.username Winner_username " +
      "from deck_game dg" +
      " join deck d1 on dg.Deck_1_Deck_ID = d1.Deck_ID" +
      " join deck d2 on dg.Deck_2_Deck_ID = d2.Deck_ID" +
      " join deck d3 on dg.Deck_3_Deck_ID = d3.Deck_ID" +
      " join deck d4 on dg.Deck_4_Deck_ID = d4.Deck_ID" +
      " join deck d5 on dg.Winner = d5.Deck_ID" +
      " join user u1 on d1.User_Discord_ID = u1.Discord_ID" +
      " join user u2 on d2.User_Discord_ID = u2.Discord_ID" +
      " join user u3 on d3.User_Discord_ID = u3.Discord_ID" +
      " join user u4 on d4.User_Discord_ID = u4.Discord_ID" +
      " join user u5 on d5.User_Discord_ID = u5.Discord_ID" +
      " inner join deck_stats on d1.Deck_ID = deck_stats.Deck_Deck_ID" +
      " WHERE deck_stats.Discord_Channel_ID = ? LIMIT 20",
    [discordId]
  )
}

async function getMatchHistoryUser(userId, discordId) {
  return await getDataQuery(
    "select Game_Game_ID as Game_ID, d1.Deck_name deck_1,  d2.Deck_name deck_2, d3.Deck_name deck_3, d4.Deck_name deck_4, d5.Deck_name Winner_deck," +
      " u1.username username_1, u2.username username_2, u3.username username_3, u4.username username_4, u5.username Winner_username " +
      "from deck_game dg" +
      " join deck d1 on dg.Deck_1_Deck_ID = d1.Deck_ID" +
      " join deck d2 on dg.Deck_2_Deck_ID = d2.Deck_ID" +
      " join deck d3 on dg.Deck_3_Deck_ID = d3.Deck_ID" +
      " join deck d4 on dg.Deck_4_Deck_ID = d4.Deck_ID" +
      " join deck d5 on dg.Winner = d5.Deck_ID" +
      " join user u1 on d1.User_Discord_ID = u1.Discord_ID" +
      " join user u2 on d2.User_Discord_ID = u2.Discord_ID" +
      " join user u3 on d3.User_Discord_ID = u3.Discord_ID" +
      " join user u4 on d4.User_Discord_ID = u4.Discord_ID" +
      " join user u5 on d5.User_Discord_ID = u5.Discord_ID" +
      " inner join deck_stats on d1.Deck_ID = deck_stats.Deck_Deck_ID" +
      " where u1.Discord_ID = ? or ( u2.Discord_ID = ? or u3.Discord_ID = ? or u4.Discord_ID = ? ) AND deck_stats.Discord_Channel_ID = ? " +
      " LIMIT 20",
    [userId, userId, userId, userId, discordId]
  )
}

async function deleteGameFromDatabase(gameId, discordId) {
  const GameParams = await getDataQuery(
    "Select * from deck_game where Game_Game_ID = ?",
    [gameId]
  )
  await deleteQuery(
    "delete from deck_game where Game_Game_ID = ? AND Discord_channel_ID = ?",
    [gameId, discordId]
  )
  await deleteQuery(
    "delete game from game inner join deck_game on game.Game_ID = deck_game.Game_Game_ID  where Game_ID = ? AND Discord_Channel_ID = ?",
    [gameID, discordId]
  )
  Promise.all([
    updateQuery(
      "update deck_stats set Loses = Loses -1 where ( Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID = ? ) AND Discord_Channel_ID = ?",
      [
        GameParams.Deck_1_Deck_ID,
        GameParams.Deck_2_Deck_ID,
        GameParams.Deck_3_Deck_ID,
        discordId,
      ]
    ),
    updateQuery(
      "update deck_stats  set Wins = Wins -1 where Deck_Deck_ID = ? AND Discord_Channel_ID = ? ",
      [GameParams.Winner, discordId]
    ),
    updateQuery(
      "update deck_stats  set Games = Games -1 where ( Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID = ? ) AND Discord_Channel_ID = ?",
      [
        GameParams.Deck_1_Deck_ID,
        GameParams.Deck_2_Deck_ID,
        GameParams.Deck_3_Deck_ID,
        GameParams.Winner,
        discordId,
      ]
    ),
  ])
  return true
}

module.exports = {
  getMatchHistoryOfDiscord,
  getMatchHistoryUser,
  deleteGameFromDatabase,
}
