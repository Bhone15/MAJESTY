require('discord-reply');
const {
     MessageEmbed
} = require('discord.js')
module.exports = {
     name: 'kick',
     description: "Kick the user",
     category: 'moderation',
     run: async (client, message, args) => {
          try {
               if (!message.member.hasPermission("KICK_MEMBERS")) return message.lineReply("**You Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**");
               if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.lineReply("**I Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**");

               if (!args[0]) return message.lineReply('**Enter A User To Kick!**')

               var kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
               if (!kickMember) return message.lineReply("**User Is Not In The Guild!**");

               if (kickMember.id === message.member.id) return message.lineReply("**You Cannot Kick Yourself!**")

               if (!kickMember.kickable) return message.lineReply("**Cannot Kick This User!**")

               var reason = args.slice(1).join(" ");
               try {
                    const sembed2 = new MessageEmbed()
                         .setColor("RED")
                         .setDescription(`**You Have Been Kicked From ${message.guild.name} for - ${reason || "No Reason!"}**`)
                         .setFooter(message.guild.name, message.guild.iconURL({
                              dynamic: true
                         }))
                    kickMember.send(sembed2).then(() =>
                         kickMember.kick()).catch(() => null)
               } catch {
                    kickMember.kick()
               }
               if (reason) {
                    var sembed = new MessageEmbed()
                         .setColor("GREEN")
                         .setDescription(`**${kickMember.user.username}** has been kicked for ${reason}`)
                    message.lineReply(sembed);
               } else {
                    var sembed2 = new MessageEmbed()
                         .setColor("GREEN")
                         .setDescription(`**${kickMember.user.username}** has been kicked`)
                    message.lineReply(sembed2);
               }
          } catch (e) {
               return message.channel.send(`**${e.message}**`)
          }
     }
}