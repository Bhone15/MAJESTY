const Schema = require('../../models/welcomeChannel');
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
     name : 'set-channel',
     aliases: ['sc'],
     description : 'Set the welcome channel',
     /**
      * @param {Client} client
      * @param {Message} message
      * @param {String[]} args
      */
     run: async(client, message, args) => {
          if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You do not have permission to use this command.`);
          
          const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
          if(!channel) return message.reply('Please mention a channel or channel ID!');
          Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
               if(data) {
                    data.channel = channel.id;
                    data.save();
               } else {
                    new Schema({
                         Guild: message.guild.id,
                         Channel: channel.id
                    }).save();
               }
               message.channel.send(`**${channel}** has been set as the welcome channel.`);

          });
     }
}