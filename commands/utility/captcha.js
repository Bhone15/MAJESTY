const db = require('quick.db');
module.exports = {
     name: 'captcha',
     aliases: ['cap', 'cha'],
     description: 'Moderate for Verification',
     run: async (client, message, args) => {
          if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("**You Do Not Have Permissions To Use This Command");
          if (!args[0]) return message.channel.send("This command is with toggle feature, So you need to provide `on` or `off`")
          if (args[0] === 'on') {
               await db.set(`captcha-${message.guild.id}`, true)
               message.channel.send('Alright, Turned on captcha verification feature')
          } else if (args[0] === 'off') {
               await db.delete(`captcha-${message.guild.id}`)
               message.channel.send('Okay, Turned off captcha verification feature')
          } else {
               return message.channel.send("Please provide a valid command which is `on` or `off`");
          }
     }
}