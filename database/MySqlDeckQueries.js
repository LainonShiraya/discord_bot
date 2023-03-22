const {
  doesExistQuery,
  insertQuery,
  getDataQuery,
  updateQuery,
} = require ("./DbQueries.js")

async function findDeckInDatabase(user, deckname) {
  const query = "Select * from deck where User_Discord_ID = ? AND Deck_name = ?"
  const doesDeckExist = await doesExistQuery(query, [user, deckname])
  if (!doesDeckExist) {
    return false
  }
  return await getDataQuery(query, [user, deckname])
}

async function addDeckToDatabase(user, deckLink, deckname) {
  return await insertQuery(
    "Insert into deck(User_Discord_ID, Deck_Link, Deck_Name) values(?,?,?)",
    [user, deckLink, deckname]
  )
}

async function getAllDecksFromDatabase(userId) {
  return await getDataQuery("select * from deck where User_Discord_ID = ?", [
    userId,
  ])
}

async function getAllDecksFromDiscord(userId) {
  return await getDataQuery(
    "Select * from deck inner join Deck_Stats on deck.Deck_ID = Deck_Stats.Deck_Deck_ID where User_Discord_ID = ?",
    [userId]
  )
}

async function updateDecklistLink(deckLink, userId, deckName) {
  return await updateQuery(
    "update deck set Deck_Link = ? where User_Discord_ID = ? and Deck_name = ?",
    [deckLink, userId, deckName]
  )
}

async function selectDeckFromDatabase(deckId, discordChannelId, userId) {
  const deckHasAlreadyPlayed = await doesExistQuery(
    "Select * from Deck_Stats where Deck_Deck_ID = ? AND Discord_Channel_ID = ?",
    [deckId, discordChannelId]
  )
  if (!deckHasAlreadyPlayed) {
    await insertQuery(
      "insert into Deck_stats(Deck_Deck_ID, Wins,Loses,Games,Selected,Discord_Channel_ID) values(?,0,0,0,false,?)",
      [deckId, discordChannelId]
    )
  }
  await updateQuery(
    "update deck_stats inner join deck on Deck_Stats.Deck_Deck_ID = deck.Deck_ID  set selected = false where Discord_Channel_ID = ? AND User_Discord_ID = ? ",
    [discordChannelId, userId]
  )
  return await updateQuery(
    "Update deck_stats set Selected = true where Deck_Deck_ID = ?",
    [deckId]
  )
}

async function getUserSelectedDeckFromDatabase(user) {
  return await getDataQuery(
    "Select * from deck inner join Deck_Stats on deck.Deck_ID = Deck_Stats.Deck_Deck_ID where User_Discord_ID = ? AND Selected = true",
    [user]
  )
}

module.exports = {
  findDeckInDatabase,
  addDeckToDatabase,
  selectDeckFromDatabase,
  getAllDecksFromDatabase,
  getUserSelectedDeckFromDatabase,
  updateDecklistLink,
  getAllDecksFromDiscord,
}
