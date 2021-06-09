const db = require('../../models/warns')

module.exports = {
     name : 'clearwarn',
     aliases: ['cw'],
     description : 'Clear all warn from user',
     /**
      * @param {Message} message
     */
    run : async(client, message, args)=> {
         if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`You do not have permission to use this command.`)
         const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
         if(!user) return message.channel.send('User not found.');
         db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err, data) => {
              if(err) throw err;
              if(data) {
                   await db.findOneAndDelete({
                        user : user.user.id, 
                        guildid: message.guild.id
                   })
                   message.channel.send(`Cleared **${user.user.tag}**'s warns`);
              } else {
                   message.channel.send(`**${user.user.tag}**, This user does not have any warns in this server!`)
              }
         })
    }
}