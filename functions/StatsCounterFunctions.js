const deckGamesPlayed = decklist => {
  return decklist.wins + decklist.loses;
};

const deckWinPerc = decklist => {
  const number = decklist.wins / (decklist.wins + decklist.loses);
  return (number * 100).toFixed(2);
};

const playerWinPerc = user => {
  let wins = 0;
  let loses = 0;
  user.decklists.map(
    decklist => (wins += decklist.wins) && (loses += decklist.loses)
  );
  number = wins / (wins + loses);
  return (number * 100).toFixed(2);
};

const playerGamesPlayed = user => {
  let gamesPlayed = 0;
  user.decklists.map(
    decklist => (gamesPlayed += decklist.wins + decklist.loses)
  );
  console.log("gamesPlayed: " + gamesPlayed);
  return gamesPlayed;
};

module.exports = {
  playerGamesPlayed,
  playerWinPerc,
  deckGamesPlayed,
  deckWinPerc,
};
