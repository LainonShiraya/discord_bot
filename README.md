# EDH Discord Bot

Bot for storing game statistics in magic the gathering commander(edh) format. 
The program was created using JavaScript and Discord.js with the help of MySQL for data storage.
It allows user to store the stats of each game played like f.e decklists, wins, loses, games, match history
on each discord separately.

## Prerequisite - Structure of config.json file ‼

![obraz](https://user-images.githubusercontent.com/59234543/225375104-310fa125-21d9-4dda-9d0b-10656a97f1e0.png) 

* clientId - Id of discord bot discord account

* guildId - Id of discord channel that bot got added to

* token - token of discord bot to access discord api

 ## Run the application ( In the project folder ) 
 
 * To download required node_modules
 ```sh
 npm i
  ```
  * To start the application
 ```sh
 node commands.js - to save the commands on discord channel ( uses the guildId )
 
 node main.js - to start the application
 ```
 
 ## Database Structure
 
 ### [MySQL Database create script](https://github.com/LainonShiraya/discord_bot/blob/main/Discord_bot.sql)
 
 ![obraz](https://user-images.githubusercontent.com/59234543/225377604-d6b76a37-d151-4ef0-8f9c-bd38ab20ce7c.png)
 
### Structure of .env file required to connect with database
```
DB_HOST= database host ( if locally, localhost )
DB_USER= database user/login
DB_PASS= database password
DB_DATABASE= name of MySQL database
DISC_TOKEN= Token of discord bot from discord developer website
```

# Bot Commands

![obraz](https://user-images.githubusercontent.com/59234543/225380951-23e47d75-0a2b-4ae0-9204-40e67da340d2.png)

## Screenshot examples

![obraz](https://user-images.githubusercontent.com/59234543/225382226-05ab85b1-592b-4405-97f4-a0bd378ecf46.png)
#### Green tick means that decklist is currently selected by the user, and next games he plays will be saved to this decklist

 <p float="center" align="center">
 
![obraz](https://user-images.githubusercontent.com/59234543/225383279-4a809e47-f041-4587-92af-7b023064da58.png)

![obraz](https://user-images.githubusercontent.com/59234543/225385565-a249d737-6ede-4a89-8dc2-a966467bda6d.png)

![obraz](https://user-images.githubusercontent.com/59234543/225385491-4f14e763-1ada-49fa-b7d6-ab13ab6ef708.png)
</p>

