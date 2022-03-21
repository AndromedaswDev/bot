const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const https = require('https');
const config = require('./config.json')
const { v4: uuidv4 } = require('uuid')
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * (this.length))]
}
const Discord = require('discord.js')

const { Client, Intents, MessageActionRow } = require('discord.js');

const Bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

const disbut = require('discord-buttons');
disbut(Bot);

Bot.login(config.token);

Bot.on('message', message => {

  if (message.author.bot) return false;

  var authorized = message.member.hasPermission('MANAGE_MESSAGES');

  console.log(authorized)

  const proxies = JSON.parse(fs.readFileSync('proxies.json'));
  const limits = JSON.parse(fs.readFileSync('ratelimit.json'));
  if (message.content.startsWith(config.prefix)) {
    message.arguments = message.content.split(' ')
    message.arguments[0] = message.arguments[0].split(config.prefix)[1]
    var command = message.arguments.splice(0, 1)
    var arguments = message.arguments
    if (command == 'proxy') {
      if (arguments.length == 0) {
        message.channel.send('choose proxy lmao')
      } else {
        var auth = false
        Object.keys(proxies).map(key => {
          if (key == arguments[0].toUpperCase()) auth = true
        })
        if (!auth) return message.channel.send(`<@${message.author.id}> Please Choose A Real Proxy Type`)
        var embed = CreateEmbed(message.author, arguments[0])
        if (embed == false) return message.reply('You are being rate limited', { ephemeral: true })
        message.author.send({ embed: embed })
        message.reply('Check Your Direct Messages', { ephemeral: true })
      }
    }
    if (command == 'gui') {
      var rows = Math.ceil(Object.keys(proxies).length / 5)
      console.log(rows)
      var embed = new Discord.MessageEmbed()
        .setColor('#0000FF')
        .setTitle('Things Proxy Bot')
        .setURL('https://discord.gg/' + config.invite)
        .setDescription('EngineXNetwork Proxy Service')
        .setFooter('Made by ' + config.creator, config.footIcon);
      var button = new disbut.MessageButton().setLabel('Ludicrous').setStyle('PRIMARY').setID('ludicrous');
      var button1 = new disbut.MessageButton().setLabel('Something').setStyle('PRIMARY').setID('so');
      const row = new Discord.MessageActionRow()
        .addComponents(
          button
        )
        .addComponents(
          button1
        );
      if (!authorized) return false;
      Bot.channels.fetch('949492201870741517').then(e => e.send({ embeds: [embed], components: [row] }))
    }
    if (command == 'add') {
      if (!authorized) return false;

    }
    if (command == 'remove') {
      if (!authorized) return false;

    }
    if (command == 'report') {


    }
    if (command == 'refill') {
      if (!authorized) return false;
      limits.map(e => e.limit = 3)
      fs.writeFileSync('ratelimit.json', JSON.stringify(limits))
      message.channel.send('Proxy Limits Reset')
    }
    if (command == 'limit') {

     // if (!arguments[0]) arguments[0] = message.author.id

      if (!arguments[0]) return message.reply('Please Specify an ID')
      if (message.mentions && message.mentions.users) return message.mentions.users.map(e => {
        var id = e.id
        var a = limits.find(e => e.name === id)
        return message.channel.send('Limit for ' + arguments[0] + ': ' + a.limit)
      })
      var id = arguments[0]
      var a = limits.find(e => e.name === id)
      return message.channel.send('Limit for ' + arguments[0] + ': ' + a.limit)
    }
    if (command == 'reset') {
      if (!authorized) return false;
      if (!arguments[0]) return message.reply('Please Specify an ID')
      if (message.mentions && message.mentions.users) return message.mentions.users.map(e => {
        var id = e.id
        var a = limits.find(a => a.name === id)
        a.limit = parseInt(arguments[1]) || 3
        fs.writeFileSync('ratelimit.json', JSON.stringify(limits))
        return message.channel.send((arguments[1] ? (arguments[1] + ' ') : '') + 'Proxies Reset For User ' + arguments[0])
      })
      var id = arguments[0]
      var a = limits.find(e => e.name === id)
      a.limit = arguments[1] || 3
      fs.writeFileSync('ratelimit.json', JSON.stringify(limits))
      return message.channel.send((arguments[1] ? (arguments[1] + ' ') : '') + 'Proxies Reset For User ' + (arguments[1] ? arguments[2] == 'true' ? '<@' + arguments[0] + '>' : arguments[0] : '<@' + arguments[0] + '>'))
    }
  }
})
//eroor=func.var(trolledbitch)
function CreateEmbed(user, type) {
  const limits = JSON.parse(fs.readFileSync('ratelimit.json'));
  const proxies = JSON.parse(fs.readFileSync('proxies.json'));

  var limit = (limits.find(e => e.name == user.id)) ? (limits.find(e => e.name == user.id)).limit : 799
  if (limit == 799) {
    limit = 3;
    limits.push({ name: user.id, limit: 3 })
  }

  if ((limit - 1) < 0) {
    return false
  }

  limit--

  var k2 = (limits.find(e => e.name == user.id))
  k2.limit = limit
  fs.writeFileSync('ratelimit.json', JSON.stringify(limits))
  var embed = new Discord.MessageEmbed()
    .setColor('#ADD8E6')
    .setTitle('Proxy Dispenser')
    .setURL('https://discord.gg/' + config.invite)
    .setDescription('EngineXNetwork Proxy Service')
    .addFields(
      { name: 'Link:', value: proxies[type.toUpperCase()].random() }
    )
    .addField('Type:', type.toUpperCase(), false)
    .addField('Remaining Requestable Proxies:', limit, true)
    .addField('Reminder:', 'Use `%report ' + type.toUpperCase() + ' reason` to report any issue with the proxy!', false)
    .setFooter('Made by ' + config.creator, config.footIcon);
  return embed
}

Bot.on('clickButton', async (button) => {
  var type = null;
  switch (button.id) {
    case "ludicrous":
      type = "LD"
      break;
    case "so":
      type = "LD"
      break;
  }
  var user = await Bot.users.fetch(button.clicker.id);
  var embed = CreateEmbed(user, type)
  if (embed == false) return button.reply.send('You are being rate limited.', { ephemeral: true })
  user.send({ embed: embed })
  button.reply.send('Check Your Direct Messages', { ephemeral: true });
});

Bot.on('clickButton', async (button) => {
  var type = null;
  switch (button.id) {
    case "ludicrous":
      type = "HU"
      break;
    case "so":
      type = "HU"
      break;
  }
  var user = await Bot.users.fetch(button.clicker.id);
  var embed = CreateEmbed(user, type)
  if (embed == false) return button.reply.send('You are being rate limited.', { ephemeral: true })
  user.send({ embed: embed })
  button.reply.send('Check Your Direct Messages', { ephemeral: true });
});