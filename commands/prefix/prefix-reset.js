const prefixSchema = require('../../models/prefix')
const { Messgae, Message } = require('discord.js')
const prefix = require('../../config.json').prefix
const { confirmation } = require('@reconlx/discord.js')
module.exports = {
     name: 'prefix-reset',
     description: "Set prefix back to default",
     /** 
      * @param {Message} message 
      */
     run : async (client, message, args) => {
          if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command!');
          await message.channel.send("Are you sure you want to reset the prefix?").then(async (msg) => {
               const emoji = await confirmation(msg, message.author, ['✅','❌'], 10000)
               if(emoji === '✅'){
                    msg.delete()
                    await prefixSchema.findOneAndDelete({ Guild: message.guild.id })
                    message.channel.send(`The prefix has been reset to **${prefix}**`)
               }
               if(emoji === '❌') {
                    msg.delete()
                    message.channel.send('**Reset prefix has been cancelled!**')
               }
          })
          
     }
}