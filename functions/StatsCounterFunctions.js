const deckWinPerc = (decklist) => {
  if (decklist.Games === 0) {
    return 0
  } else {
    const number = decklist.Wins / decklist.Games
    return (number * 100).toFixed(2)
  }
}

const playerWinPerc = (wins, games) => {
  if (games === 0) {
    return 0
  } else {
    number = wins / games
    return (number * 100).toFixed(2)
  }
}

module.exports = {
  playerWinPerc,
  deckWinPerc,
}
