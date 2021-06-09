require('discord-reply');
const {
     MessageEmbed
} = require('discord.js')
module.exports = {
     name: 'addrole',
     aliases: ['add', 'adr'],
     description: "Add role to user",
     category: 'utility',

     run: async (client, message, args) => {
          if (!message.member.hasPermission(["MANAGE_ROLES"])) return message.lineReply("You dont have permission to perform this command!")

          let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

          if (!rMember) return message.lineReply("Please provide a user to add a role.")

          let role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first()

          if (!role) return message.lineReply("Please provide a valid role to add to said user.")


          if (!message.guild.me.hasPermission(["MANAGE_ROLES"])) return message.lineReply("I don't have permission to perform this command. Please give me Manage Roles Permission!")

          if (rMember.roles.cache.has(role.id)) {

               return message.lineReply(`${rMember.displayName}, already has the role!`)

          } else {

               await rMember.roles.add(role.id).catch(e => message.channel.send(e.message))

               message.lineReply(`${rMember.displayName} has been added to **${role.name}**`)

          }

     }
}