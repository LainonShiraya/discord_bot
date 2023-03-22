const { connection } = require("../database/DbConnection.js")
//import {connection} from './DbConnection.js';
// users
function addUserToDatabase(userId, username) {
  return connection
    .promise()
    .query("select * from user where Discord_ID = ?", [userId])
    .then((res) => {
      if (!res[0][0]) {
        return connection
          .promise()
          .execute("Insert into user values (?,?)", [userId, username])
          .then((res) => {
            return res[0].affectedRows
          })
      }
    })
}

function findUserInDatabase(userId) {
  return connection
    .promise()
    .query("select * from user where Discord_ID = ?", [userId])
    .then((results) => {
      if (results[0][0]) {
        return true
      } else {
        return false
      }
    })
}

function selectUserInDatabase(user) {
  return connection
    .promise()
    .query("Select * from user where Discord_ID = ?", [user])
    .then((results, fields) => {
      return results[0][0]
    })
}

function selectAllUsersFromDatabase() {
  // select all users from database
  return connection
    .promise()
    .query("Select * from user", [])
    .then((response) => {
      return response[0]
    })
}

// decks
function findDeckInDatabase(user, deckname) {
  return connection
    .promise()
    .query("Select * from deck where User_Discord_ID = ? AND Deck_name = ?", [
      user,
      deckname,
    ])
    .then((results, fields) => {
      if (results[0][0]) {
        return results[0][0]
      } else {
        return false
      }
    })
}

function addDeckToDatabase(user, deckLink, deckName) {
  return connection
    .promise()
    .execute(
      "Insert into deck(User_Discord_ID, Deck_Link, Deck_Name) values(?,?,?)",
      [user, deckLink, deckName]
    )
    .then((response, fields) => {
      return response[0].affectedRows
    })
}

function getAllDecksfromDatabase(user) {
  return connection
    .promise()
    .query("Select * from deck where User_Discord_ID = ?", [user])
    .then((response) => {
      return response[0]
    })
}

function getAllDecksfromDiscord(user) {
  return connection
    .promise()
    .query(
      "Select * from deck inner join Deck_Stats on deck.Deck_ID = Deck_Stats.Deck_Deck_ID where User_Discord_ID = ?",
      [user]
    )
    .then((response) => {
      return response[0]
    })
}
function updateDecklistLink(deckLink, userId, deckName) {
  return connection
    .promise()
    .execute(
      "update deck set Deck_Link = ? where User_Discord_ID = ? and Deck_name = ?",
      [deckLink, userId, deckName]
    )
    .then((response, fields) => {
      return response[0].affectedRows
    })
}

function selectDeckfromDatabase(deckId, discordChannelId, userId) {
  return connection
    .promise()
    .execute(
      "Select * from Deck_Stats where Deck_Deck_ID = ? AND Discord_Channel_ID = ?",
      [deckId, discordChannelId]
    )
    .then(async (res) => {
      if (!res[0][0]) {
        await connection
          .promise()
          .execute(
            "insert into Deck_stats(Deck_Deck_ID, Wins,Loses,Games,Selected,Discord_Channel_ID) values(?,0,0,0,false,?)",
            [deckId, discordChannelId]
          )
      }
      await connection
        .promise()
        .execute(
          "update deck_stats inner join deck on Deck_Stats.Deck_Deck_ID = deck.Deck_ID  set selected = false where Discord_Channel_ID = ? AND User_Discord_ID = ? ",
          [discordChannelId, userId]
        )
      // select deck user wants
      return connection
        .promise()
        .execute(
          "Update deck_stats set Selected = true where Deck_Deck_ID = ?",
          [deckId]
        )
        .then((response) => {
          return response[0].affectedRows
        })
    })
}

function getUserSelectedDeckfromDatabase(user) {
  return connection
    .promise()
    .query(
      "Select * from deck inner join Deck_Stats on deck.Deck_ID = Deck_Stats.Deck_Deck_ID where User_Discord_ID = ? AND Selected = true",
      [user]
    )
    .then((response) => {
      return response[0][0]
    })
}

// game
function createGame() {
  return connection
    .promise()
    .execute("Insert into game(Date) values (CURDATE())", [])
    .then((response) => {
      console.log(response)
      if (response[0].affectedRows > 0) {
        return connection
          .promise()
          .query("SELECT Game_ID from game ORDER BY Game_ID DESC LIMIT 1", [])
          .then((res) => {
            return res[0][0].Game_ID
          })
      } else {
        return false
      }
    })
}

async function assignDecksToGame(
  gameID,
  player1ID,
  player2ID,
  player3ID,
  winnerID,
  discordId
) {
  // odwrócić zapytania, najpierw insert into decK_game, potem ustawic win/loss/games
  const playerDeck_1 = await getUserSelectedDeckfromDatabase(player1ID)
  const playerDeck_2 = await getUserSelectedDeckfromDatabase(player2ID)
  const playerDeck_3 = await getUserSelectedDeckfromDatabase(player3ID)
  const winnerDeck = await getUserSelectedDeckfromDatabase(winnerID)

  return connection
    .promise()
    .execute(
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
    .then((response) => {
      if (response[0].affectedRows > 0) {
        return Promise.all([
          connection
            .promise()
            .execute(
              "update deck_stats set Loses = Loses + 1 where ( Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID  = ? ) AND Selected = true AND Discord_Channel_ID = ?",
              [
                playerDeck_1.Deck_ID,
                playerDeck_2.Deck_ID,
                playerDeck_3.Deck_ID,
                discordId,
              ]
            ),

          connection
            .promise()
            .execute(
              "update deck_stats set Wins = Wins + 1 where Deck_Deck_ID  = ? AND Discord_Channel_ID = ?",
              [winnerDeck.Deck_ID, discordId]
            ),

          connection
            .promise()
            .execute(
              "update deck_stats set Games = Games + 1 where ( Deck_Deck_ID  = ? or Deck_Deck_ID  = ? or Deck_Deck_ID  = ? or Deck_Deck_ID  = ? ) AND Selected = true AND Discord_Channel_ID = ?",
              [
                playerDeck_1.Deck_ID,
                playerDeck_2.Deck_ID,
                playerDeck_3.Deck_ID,
                winnerDeck.Deck_ID,
                discordId,
              ]
            ),
        ]).then((res) => {
          return true
        })
      } else {
        return false
      }
    })
}

//match history
function getMatchHistory(discordId) {
  return connection
    .promise()
    .query(
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
    .then((response) => {
      return response[0]
    })
}

function getMatchHistoryUser(userId, discordId) {
  return connection
    .promise()
    .query(
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
    .then((response) => {
      return response[0]
    })
}

function deleteGameFromHistory(gameID, discordId) {
  return connection
    .promise()
    .query("Select * from deck_game where Game_Game_ID = ?", [gameID])
    .then(async (response) => {
      const stats = response[0][0]
      await connection
        .promise()
        .execute(
          "delete from deck_game where Game_Game_ID = ? AND Discord_channel_ID = ?",
          [gameID, discordId]
        )
      await connection
        .promise()
        .execute(
          "delete game from game inner join deck_game on game.Game_ID = deck_game.Game_Game_ID  where Game_ID = ? AND Discord_Channel_ID = ?",
          [gameID, discordId]
        )

      return Promise.all([
        connection
          .promise()
          .execute(
            "update deck_stats set Loses = Loses -1 where ( Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID = ? ) AND Discord_Channel_ID = ?",
            [
              stats.Deck_1_Deck_ID,
              stats.Deck_2_Deck_ID,
              stats.Deck_3_Deck_ID,
              discordId,
            ]
          ),
        connection
          .promise()
          .execute(
            "update deck_stats  set Wins = Wins -1 where Deck_Deck_ID = ? AND Discord_Channel_ID = ? ",
            [stats.Winner, discordId]
          ),
        connection
          .promise()
          .execute(
            "update deck_stats  set Games = Games -1 where ( Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID = ? or Deck_Deck_ID = ? ) AND Discord_Channel_ID = ?",
            [
              stats.Deck_1_Deck_ID,
              stats.Deck_2_Deck_ID,
              stats.Deck_3_Deck_ID,
              stats.Winner,
              discordId,
            ]
          ),
      ]).then((res) => {
        return true
      })
    })
}

module.exports = {
  // users
  addUserToDatabase,
  findUserInDatabase,
  selectAllUsersFromDatabase,
  selectUserInDatabase,
  // decks
  findDeckInDatabase,
  addDeckToDatabase,
  selectDeckfromDatabase,
  getAllDecksfromDatabase,
  getUserSelectedDeckfromDatabase,
  updateDecklistLink,
  getAllDecksfromDiscord,
  // game
  createGame,
  assignDecksToGame,
  //match history
  getMatchHistory,
  getMatchHistoryUser,
  deleteGameFromHistory,
}
