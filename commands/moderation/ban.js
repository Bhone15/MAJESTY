require('discord-reply');
const {
     MessageEmbed
} = require('discord.js')
module.exports = {
     name: 'ban',
     description: "Ban the user",
     category: 'moderation',
     run: async (client, message, args) => {
          try {
               if (!message.member.hasPermission("BAN_MEMBERS")) return message.lineReply("**You Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
               if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.lineReply("**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**");
               if (!args[0]) return message.lineReply("**Please Provide A User To Ban!**")

               let banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
               if (!banMember) return message.lineReply("**User Is Not In The Guild**");
               if (banMember === message.member) return message.lineReply("**You Cannot Ban Yourself**")

               var reason = args.slice(1).join(" ");

               if (!banMember.bannable) return message.lineReply("**Can't Ban That User**")
               try {
                    const sembed2 = new MessageEmbed()
                         .setColor("RED")
                         .setDescription(`**You Have Been Banned From ${message.guild.name} for - ${reason || "No Reason!"}**`)
                         .setFooter(message.guild.name, message.guild.iconURL({
                              dynamic: true
                         }))
                    banMember.send(sembed2).then(() =>
                         message.guild.members.ban(banMember)).catch(() => null)
               } catch {
                    message.guild.members.ban(banMember)
               }
               if (reason) {
                    var sembed = new MessageEmbed()
                         .setColor("GREEN")
                         .setDescription(`**${banMember.user.username}** has been banned for ${reason}`)
                    message.lineReply(sembed)
               } else {
                    var sembed2 = new MessageEmbed()
                         .setColor("GREEN")
                         .setDescription(`**${banMember.user.username}** has been banned`)
                    message.lineReply(sembed2)
               }
          } catch (e) {
               return message.lineReply(`**${e.message}**`)
          }
     }
}