const deckGamesPlayed = decklist => {
  return decklist.wins + decklist.loses;
};

const deckWinPerc = decklist => {
	if(decklist.Games === 0){
		return 0;
	}
	else {
  const number = decklist.Wins / decklist.Games;
  return (number * 100).toFixed(2);
	}
};

const playerWinPerc = (wins,games) => {
	if(games === 0){
		return 0;
	} else {
  number = wins / games;
  return (number * 100).toFixed(2);
	}
};

const playerGamesPlayed = user => {
  let gamesPlayed = 0;
  user.decklists.map(
    decklist => (gamesPlayed += decklist.wins + decklist.loses)
  );
  return gamesPlayed;
};

module.exports = {
  playerGamesPlayed,
  playerWinPerc,
  deckGamesPlayed,
  deckWinPerc,
};
