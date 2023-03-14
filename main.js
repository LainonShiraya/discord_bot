const fs = require("node:fs");
const path = require("node:path");
const { Client, Intents, Collection } = require("discord.js");
require('dotenv').config();
const client = new Client({ intents: ["GUILDS"] });

client.once("ready", async () => {
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
  console.log("Checking command names");
  console.log(command.data.name);
}

client.on("interactionCreate", async interaction => {

  console.log("Checking commands funcionality");
  console.log(interaction.commandName);
  const command = client.commands.get(interaction.commandName);

  if (!command && !interaction.isSelectMenu() && !interaction.isButton())
    return;

  try {
    if (interaction.isCommand()) await command.execute(interaction);
    if (interaction.isAutocomplete()) await command.autocomplete(interaction);
    if (interaction.isSelectMenu())
      await client.commands.get("game").selectmenus(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
client.login(process.env.DISC_TOKEN);
