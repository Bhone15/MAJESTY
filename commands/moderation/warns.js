const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js');

module.exports = {
     name : 'warns',
     aliases: ['ws'],
     description : 'Check the warnings of user',
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
               if(data) {
                    message.channel.send(new MessageEmbed()
                    .setTitle(`${user.user.tag}'s warns`)
                    .setDescription(
                         data.content.map(
                              (w, i) => 
                              `\`${i + 1}\` | **Moderator :** ${message.guild.members.cache.get(w.moderator).user.tag} \n **Reason :** ${w.reason}`                              
                         )
                    )
                    .setColor('BLUE')
                    )
               } else {
                    message.channel.send(`**${user.user.tag}**, has no warnings.`);
               }
          });
     }
}