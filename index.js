require('dotenv').config();
const { OpenAI } = require('openai');
const fs = require('fs')

const { Client, Collection, PermissionFlagsBits } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const montoken = process.env.token;

const client = new Client({ intents: 3276799 });


const commandHandler = new Collection();

const commands = []

//Commande Handler moderation and slashcommands
const rest = new REST({ version: '9' }).setToken(montoken);

const mesCommands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of mesCommands) {
  const commandName = file.split(".")[0]
  const command = require(`./commands/${commandName}`)
  commandHandler.set(commandName, command)
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${command} is missing a required "data" or "execute" property.`);
  }
}

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();


client.on('ready', () => {
  console.log('Je suis ready')
})




client.on("messageCreate", async (message) => {
  if (message.content === "salut") {
    message.react("👋").then(console.log).catch(console.error);
  } else {
    if (message.content === "Salut") {
      message.react("👋").then(console.log).catch(console.error);
    } else {
      if (message.content === "Bonjour") {
        message.react("👋").then(console.log).catch(console.error);
      } else {
        if (message.content === "bonjour") {
          message.react("👋").then(console.log).catch(console.error);
        }
      }
    }
  }
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
})


client.on('messageCreate', async (message) => {
  const channel_id = process.env.channel_id?.split(','); //utiliser la , pour séparer et crée le tableau dans le .env

  if (message.author.bot || !channel_id.includes(message.channel.id) || message.content.startsWith('!')) {
    return;
  }
  let conversations = [{ role: 'user', content: 'Je suis un bot' }];

  try {
    await message.channel.sendTyping();
    const prevMessage = await message.channel.messages.fetch({ limit: 15 });
    prevMessage.reverse().forEach((message) => {
      if (message.content.startsWith('!') || (message.author.bot && message.author.id !== client.user.id)) {
        return;
      }
      const role = message.author.id === client.user.id ? 'assistant' : 'user'
      const name = message.author.username.replace(/_s+\g.'_'/g, '').replace(/[\w\s]/gi, ' ');

      conversations.push({ role: role, content: message.content, name: name });
    });
    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversations.map(conversation => ({
        role: conversation.role,
        content: conversation.content
      })),
    });
    if (completions.choices.length > 0 && completions.choices[0].message) {
      await message.reply(completions.choices[0].message);
    }
  } catch (error) {
    console.error(`Une erreur s'est produite ${error.message}`)
  }
})


//interactionCreate de la commande Modération
const unbanCommand = require('./commands/unban');
const kickCommand = require('./commands/kick');
const banCommand = require('./commands/ban');
const purgeCommand = require('./commands/purge');
const Maping = new Map();
Maping.set(kickCommand.data.name, kickCommand) && Maping.set(banCommand.data.name, banCommand) && Maping.set(unbanCommand.data.name, unbanCommand) && Maping.set(purgeCommand.data.name, purgeCommand);

client.on('interactionCreate', async (execute) => {
  if (!execute.isCommand()) return;

  const command = Maping.get(execute.commandName)
  if (!command) return

  try {
    await command.execute(execute);
  } catch (error) {
    console.error(error)
    await execute.reply({ content: 'une erreur s\' est produite' });
  }
})


client.login(process.env.token);