require('discord-reply');
const {
     MessageEmbed
} = require('discord.js')
module.exports = {
     name: 'unban',
     description: "Unban a user from the guild!",
     category: 'moderation',

     run: async (client, message, args) => {
          if (!message.member.hasPermission("BAN_MEMBERS")) return message.lineReply("**You Dont Have The Permissions To Unban Someone! - [BAN_MEMBERS]**")
          const id = args[0];
          if (!id) return message.lineReply("**Please Enter An ID!**")
          let bannedMemberInfo = await message.guild.fetchBans();
          let bannedMember;
          bannedMember = bannedMemberInfo.find(b => b.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || bannedMemberInfo.get(args[0]) || bannedMemberInfo.find(bm => bm.user.tag.toLowerCase() === args[0].toLocaleLowerCase());
          if (!bannedMember) return message.lineReply("**Please Provide A Valid Username, Tag Or ID Or The User Is Not Banned!**")

          let reason = args.slice(1).join(" ")

          if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.lineReply("**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**");
          try {
               if (reason) {
                    message.guild.members.unban(bannedMember.user.id, reason)
                    var sembed = new MessageEmbed()
                         .setColor("GREEN")
                         .setDescription(`**${bannedMember.user.tag} has been unbanned for ${reason}**`)
                    message.lineReply(sembed)
               } else {
                    message.guild.members.unban(bannedMember.user.id, reason)
                    var sembed2 = new MessageEmbed()
                         .setColor("GREEN")
                         .setDescription(`**${bannedMember.user.tag} has been unbanned**`)
                    message.lineReply(sembed2)
               }
          } catch {

          }

     }
}