const blacklist = require('../../models/blacklist')
const owner = require('../../config.json');
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
     name : 'blacklist',
     aliases: ['bl'],
     description: 'blacklist the user',
     /**
      * @param {Message} message 
      */
     run : async (client, message, args) => {
          if(message.author.id !== owner.OWNER_ID) {
               const embed = new MessageEmbed()
               .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
               .setTitle(`Error`)
               .setColor(`RANDOM`)
               .setDescription(`❌ This command is only allowed for my developer!`)
               .setTimestamp();
               return message.channel.send(embed);
          }
          const User = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
          if(!User) return message.channel.send('User is not valid.')

          blacklist.findOne({ id : User.user.id }, async (err, data) => {
               if(err) throw err;
               if(data) {
                    message.channel.send(`**${User.displayName}** has already been blacklisted!`)
               } else {
                    data = new blacklist({ id : User.user.id })
                    data.save()
                    .catch(err => console.log(err))
                    message.channel.send(`${User.user.tag} has  been added to blacklist.`)
               }
               
          })
     }
}