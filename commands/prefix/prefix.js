const prefixSchema = require('../../models/prefix')
const { Messgae, Message } = require('discord.js')
module.exports = {
     name: 'prefix',
     description: "Set the Custom Prefix",
     /** 
      * @param {Message} message 
      */
     run : async (client, message, args) => {          
          if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permissions to use this command!');
          const res = await args.join(" ");
          if(!res) return message.channel.send('Please specify a prefix to change to.');

          prefixSchema.findOne({ Guild : message.guild.id }, async(err, data) => {
               if(err) throw err;
               if(data) {
                    prefixSchema.findOneAndDelete({ Guild : message.guild.id })
                    data = new prefixSchema({ 
                         Guild : message.guild.id,
                         Prefix: res
                    })
                    data.save()
                    message.channel.send(`Your prefix has been updated to **${res}** for this sever!`)
               } else {
                    data = new prefixSchema({
                         Guild : message.guild.id,
                         Prefix: res
                    })
                    data.save()
                    message.channel.send(`Custom prefix in this sever is now set to **${res}**`);
               }
          })
     }
}