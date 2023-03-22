const { doesExistQuery, insertQuery, getDataQuery } = require("./DbQueries.js")

async function addUserToDatabase(userId, username) {
  const doesExist = await doesExistQuery(
    "select * from user where Discord_ID = ?",
    [userId]
  )

  if (!doesExist) {
    return await insertQuery("Insert into user values (?,?)", [
      userId,
      username,
    ])
  }
  return false
}

async function findUserInDatabase(userId) {
  return await doesExistQuery("select * from user where Discord_ID = ?", [
    userId,
  ])
}

async function selectUserInDatabase(userId) {
  return await getDataQuery("Select * from user where Discord_ID = ?", [userId])
}

async function selectAllUsersFromDatabase() {
  return await getDataQuery("Select * from user", [])
}

module.exports = {
  addUserToDatabase,
  findUserInDatabase,
  selectAllUsersFromDatabase,
  selectUserInDatabase,
}
