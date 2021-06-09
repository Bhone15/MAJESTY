const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js');

module.exports = {
     name : 'warn',
     aliases: ['w'],
     description : 'Warn the user from guild',
     /**
      * @param {Message} message
     */
     run : async(client, message, args)=> {
          if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You do not have permission to use this command.`)
          const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
          if(!user) return message.channel.send('User not found.');
          let reason = args.slice(1).join(" ");
          if(!reason) reason = "No reason provided";
          db.findOne({ guildid: message.guild.id, user: user.user.id }, async(err, data) => {
               if(err) throw err;
               if(!data) {
                    data = new db({
                         guildid: message.guild.id,
                         user : user.user.id,
                         content : [
                              {
                                   moderator : message.author.id,
                                   reason : reason
                              }
                         ]
                    })
               } else {
                    const obj = {
                         moderator: message.author.id,
                         reason : reason
                    }
                    data.content.push(obj)
               }
               data.save()
          });
          user.send(new MessageEmbed()
          .setDescription(`You have been warned for ${reason}.`)
          .setColor('RED')
          )
          message.channel.send(new MessageEmbed()
          .setDescription(`Warned ${user} for ${reason}`)
          .setColor('BULE')
          )
     }
}