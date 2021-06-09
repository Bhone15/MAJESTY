require('discord-reply');
const {
     MessageEmbed
} = require('discord.js');
module.exports = {
     name: 'removerole',
     aliases: ['rmr', 'remove'],
     description: "Remove role from user",
     category: 'utility',

     run: async (client, message, args) => {
          if (!message.member.hasPermission(["MANAGE_ROLES"]))
               return message.lineReply("You don't have permission to perform this command!");

          let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

          if (!rMember) return message.lineReply("Please provide a user to remove a role from!");

          let role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first();

          if (!role) return message.lineReply("Please provide a role to remove from said user.");

          if (!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.lineReply("I don't have permission to perform this command. Please give me Manage Roles Permission!");

          if (!rMember.roles.cache.has(role.id)) {
               let rolDEL_err = new MessageEmbed()
                    .setColor(`#FF0000`)
                    .setDescription(`Error ❌ | ${rMember.displayName}, Does not have this role!`);

               return message.lineReply(rolDEL_err);
          } else {
               await rMember.roles.remove(role.id).catch(e => message.channel.send(e.message))

               let rolDEL = new MessageEmbed()
                    .setColor(`#00FF00`)
                    .setDescription(`Success ✅ | ${rMember} has been removed from **${role.name}**`)

               message.lineReply(rolDEL)

          }
     }
}