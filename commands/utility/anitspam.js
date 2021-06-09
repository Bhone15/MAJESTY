const db = require('quick.db');
module.exports = {
     name: 'antispam',
     aliases: ['anti', 'nospam'],
     description: 'Moderate for Spamming',
     run: async (client, message, args) => {
          if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("**You Do Not Have Permissions To Use This Command");
          if (!args[0]) return message.channel.send("This command is with toggle feature, So you need to provide `on` or `off`")
          if (args[0] === 'on') {
               await db.set(`antispam-${message.guild.id}`, true)
               message.channel.send('Alright, Turned on antispam feature')
          } else if (args[0] === 'off') {
               await db.delete(`antispam-${message.guild.id}`)
               message.channel.send('Okay, Turned off antispam feature')
          } else {
               return message.channel.send("Please provide a valid command which is `on` or `off`");
          }
     }
}