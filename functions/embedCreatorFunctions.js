const { users } = require("../mockupData.js");
const { MessageEmbed } = require("discord.js");
const {
  playerGamesPlayed,
  playerWinPerc,
  deckGamesPlayed,
  deckWinPerc,
} = require("./StatsCounterFunctions");
const showAllUsersEmbed = () => {
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Statistics of all users: ")
    .addFields(
      users
        .sort(function (a, b) {
          return a.username
            .toLowerCase()
            .localeCompare(b.username.toLowerCase());
        })
        .map(function (user) {
          let decklists = user.decklists
            .map(function (decklist) {
              return (
                `\n ** ${decklist.id}. ${
                  decklist.deckname
                }** Games played : ${deckGamesPlayed(
                  decklist
                )} | Win ratio: ${deckWinPerc(decklist)}%` +
                " \n " +
                decklist.decklink +
                " \n"
              );
            })
            .toString()
            .replace(",", "");
          if (decklists.length < 1)
            decklists = "User has no decklists registered";
          console.log(decklists);
          return {
            name: `${user.username}`,
            value: decklists,
            inline: false,
          };
        })
    );
  return embed;
};

const showCertainUserEmbed = (userFound, interaction) => {
  const userEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`Decklists of ${interaction.options.getUser("user").username}`)
    .setDescription(
      `Games played : ${playerGamesPlayed(
        userFound
      )} | General win ratio: ${playerWinPerc(userFound)}%`
    )
    .setThumbnail(interaction.options.getUser("user").displayAvatarURL())
    .addFields(
      userFound.decklists.map(function (decklist) {
        return {
          name: `** ${decklist.id}. ${
            decklist.deckname
          }** Games played : ${deckGamesPlayed(
            decklist
          )} | Win ratio: ${deckWinPerc(decklist)}%`,
          value: decklist.decklink,
          inline: false,
        };
      })
    );
  return userEmbed;
};

module.exports = { showAllUsersEmbed, showCertainUserEmbed };
