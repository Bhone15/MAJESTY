const blacklist = require('../../models/blacklist')
const owner = require('../../config.json');
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
     name : 'unblacklist',
     aliases: ['unbl'],
     description: 'unblacklist the user',
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
                    await blacklist.findOneAndDelete({ id: User.user.id })
                    .catch(err => console.log(err))
                    message.channel.send(`**${User.displayName}** has been removed from blacklist.`)
               } else {
                    message.channel.send(`**${User.displayName}** is not blacklisted.`)
               }
               
          })
     }
}