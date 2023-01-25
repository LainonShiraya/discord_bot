const fs = require("node:fs");
const path = require("node:path");
const { Client, Intents, Collection } = require("discord.js");
const { token } = require("./config.json");
const { users } = require("./mockupData.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
  console.log("Ready!");
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
  console.log(command.data.name);
}

client.on("interactionCreate", async interaction => {
  // if (
  //   !interaction.channel.permissionsFor(client.user)
  //   // .has(Permissions.FLAGS.SEND_MESSAGES)
  // )
  //   return;
  console.log("sprawdzaimy interaction commandname");
  console.log(interaction.commandName);
  const command = client.commands.get(interaction.commandName);

  if (!command && !interaction.isSelectMenu() && !interaction.isButton())
    return;

  try {
    if (interaction.isCommand()) await command.execute(interaction);
    if (interaction.isAutocomplete()) await command.autocomplete(interaction);
    if (interaction.isSelectMenu())
      await client.commands.get("game").selectmenus(interaction);
    //if (interaction.isButton()) return;
    // await client.commands.get("game").selectmenus(interaction);
    //   await client.commands.get("game").buttonSubmit(interaction); //await command.selectmenus(interaction);
    // if (interaction.isModalSubmit()) {
    //   console.log("dzialaa");
    //   await client.commands.get("game").modalsubmit(interaction);
    // }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
client.login(token);
