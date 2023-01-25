var mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE
  });
  
function addUserToDatabase(userId,userName){

	// user
return connection.promise().execute('Insert into user(Discord_ID, username) values (?,?)',[userId,userName]).then( response => {
	return response[0].affectedRows;
})
}

function findUserInDatabase(user) {
	
	return connection.promise().query('Select * from user where Discord_ID = ?',[user]).then( (results,fields) => {
		if(results[0][0]){
			return true;
		} else {
			return false
		};
	})
} 
module.exports = {
addUserToDatabase,
findUserInDatabase
};

// decks 

function findDeckInDatabase(user, deckname) {
	
	return connection.promise().query('Select * from deck where User_Discord_ID = ? AND Deck_name = ?',[user, deckname]).then( (results,fields) => {
		if(results[0][0]){
			return true;
		} else {
			return false
		};
	})
} 

function addDeckToDatabase(user, deckLink, deckName) {
	
	return connection.promise().execute('Insert into deck(User_Discord_ID, Deck_Link, Deck_Name) values(?,?,?)',[user,deckLink, deckName]).then( (response,fields) => {
		return response[0].affectedRows;
	})
} 

function getAllDecksfromDatabase(user) {
	
	// select deck user wants
	return connection.promise().query('Select * from deck where User_Discord_ID = ?',[user]).then(response => {
		console.log('response from get all Decks');
		console.log(response);
		return response[0];
	})

} 


function selectDeckfromDatabase(user,deckName) {
	
	// set all decks of user to selected = false
	connection.promise().execute('Update deck set Selected = false where User_Discord_ID = ?',[user]);

	// select deck user wants
	return connection.promise().execute('Update deck set Selected = true where User_Discord_ID = ? AND Deck_Name = ?',[user,deckName]).then(response => {
		return response[0].affectedRows;
	})

} 
module.exports = {
	findDeckInDatabase,
	addDeckToDatabase,
	selectDeckfromDatabase,
	getAllDecksfromDatabase
	};