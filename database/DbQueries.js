const { connection } = require("./DbConnection.js")
function doesExistQuery(query, paramArray) {
  return connection
    .promise()
    .query(query, paramArray)
    .then((results) => {
      return Boolean(results[0][0])
    })
}

function insertQuery(query, paramArray) {
  return connection
    .promise()
    .execute(query, paramArray)
    .then((results) => {
      if (results[0].affectedRows > 0) return true
      return false
    })
}

function insertQueryReturnsId(query, paramArray) {
	return connection
	  .promise()
	  .execute(query, paramArray)
	  .then((results) => {
		if (results[0].affectedRows > 0) return results[0].insertId
		return false
	  })
  }
  
function getDataQuery(query, paramArray) {
  return connection
    .promise()
    .query(query, paramArray)
    .then((results) => {
      if (results[0].length > 1) return results[0]
      return results[0][0]
    })
}

function updateQuery(query, paramArray) {
  return connection
    .promise()
    .query(query, paramArray)
    .then((results) => {
      if (results[0].affectedRows > 0) return true
      return false
    })
}
function deleteQuery(query, paramArray) {
  return connection
    .promise()
    .query(query, paramArray)
    .then((results) => {
      if (results[0].affectedRows > 0) return true
      return false
    })
}
module.exports = {
  doesExistQuery,
  insertQuery,
  insertQueryReturnsId,
  getDataQuery,
  updateQuery,
  deleteQuery,
}
