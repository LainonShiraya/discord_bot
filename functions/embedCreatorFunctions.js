const { users } = require("../mockupData.js");
const { MessageEmbed } = require("discord.js");
const { playerWinPerc, deckWinPerc } = require("./StatsCounterFunctions");
const {
  selectAllUsersFromDatabase,
  getAllDecksfromDiscord,
  getMatchHistory,
  getMatchHistoryUser,
} = require("./MysqlDataManagementFunctions");

const showAllUsersEmbed = async () => {
  const users = await selectAllUsersFromDatabase();

  return Promise.all(
    users.map(async (user) => {
      const userDecks = await getAllDecksfromDiscord(user.Discord_ID).then(
        (decks) => {
          let decklists = [];
          if (decks.length < 1) {
            decklists.push("User has no decklists registered");
          } else {
            decks.map((deck) => {
              decklists.push(
                ` \n \n  ** ${deck.Selected ? ":white_check_mark:" : ""} ${
                  deck.Deck_ID
                }. ${deck.Deck_Name}**
						 \n Games played: ${deck.Games} | Win ratio: ${deckWinPerc(deck)}% 
						 \n Decklist: ${deck.Deck_Link}`
              );
            });
          }

          return {
            name: user.username,
            value: decklists.toString().replace(",", ""),
            inline: false,
          };
        }
      );

      return userDecks;
    })
  );
};

const showCertainUserEmbed = async (interaction) => {
  let games = 0;
  let wins = 0;
  const user = interaction.options.getUser("user");
  const decks = await getAllDecksfromDiscord(user.id).then((response) => {
    if (response.length > 0) {
      response.map((deck) => {
        games += deck.Games;
        wins += deck.Wins;
      });
      return response;
    }
  });
  const values = decks.map(function (decklist) {
    return {
      name: `** ${decklist.Selected ? ":white_check_mark:  " : ""} ${
        decklist.Deck_ID
      }. ${decklist.Deck_Name} ** \n   Games played : ${
        decklist.Games
      } | Win ratio: ${playerWinPerc(decklist.Wins, decklist.Games)}%`,
      value: `Link: ${decklist.Deck_Link}`,
      inline: false,
    };
  });
  const userEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Decklists of ${user.username}`)
    .setDescription(
      `Games played : ${games} | General win ratio: ${playerWinPerc(
        wins,
        games
      )}%`
    )
    .setThumbnail(user.displayAvatarURL())
    .addFields(values)
    .setDescription("It shows decks that got selected on atleast once");

  return userEmbed;
};

const showMatchHistoryAll = async (discordId) => {
  const matches = await getMatchHistory(discordId);
  const values = matches.map(function (match) {
    return {
      name: `Game ${match.Game_ID}`,
      value: `${match.deck_1} ( ${match.username_1} )
				  ${match.deck_2} ( ${match.username_2} )
				  ${match.deck_3} ( ${match.username_3} )
				  ${match.deck_4} ( ${match.username_4} )
				 Winner:
				 ${match.Winner_deck} ( ${match.Winner_username} )`,
      inline: false,
    };
  });
  const userEmbed = new MessageEmbed()
    .setColor("0xdd2c53")
    .setTitle(`Match History`)
    .setDescription(`Last 20 games played by the discord community`)
    .addFields(values);

  return userEmbed;
};

const showMatchHistoryUser = async (interaction, discordId) => {
  const user = interaction.options.getUser("player");
  const matches = await getMatchHistoryUser(user.id, discordId);
  const values = matches.map(function (match) {
    return {
      name: `Game ${match.Game_ID}`,
      value: `${match.deck_1} ( ${match.username_1} ) 
					  ${match.deck_2} ( ${match.username_2} )
					  ${match.deck_3} ( ${match.username_3} )
					  ${match.deck_4} ( ${match.username_4} )
					  Winner:
					   ${match.Winner_deck} ( ${match.Winner_username} )`,
      inline: false,
    };
  });
  const userEmbed = new MessageEmbed()
    .setColor("0xdd2c53")
    .setTitle(`Match History of ${user.username}`)
    .setDescription(`Last 20 games played by the player`)
    .addFields(values)
    .setThumbnail(user.displayAvatarURL());

  return userEmbed;
};
module.exports = {
  showAllUsersEmbed,
  showCertainUserEmbed,
  showMatchHistoryAll,
  showMatchHistoryUser,
};
