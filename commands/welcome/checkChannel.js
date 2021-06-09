const Schema = require('../../models/welcomeChannel');
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
     name : 'check-channel',
     aliases: ['chc'],
     description : 'Check the welcome channel',
     /**
      * @param {Client} client
      * @param {Message} message
      * @param {String[]} args
      */
     run: async(client, message, args) => {
          if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You do not have permission to use this command.`);
          
          Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
               if(!data) return message.channel.send('This guild has no data stored!');

               const channel = client.channels.cache.get(data.Channel);
               message.reply(`Welcome Channel => **${channel}**`)

          });
     }
}