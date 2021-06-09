const db = require('../../models/warns')

module.exports = {
     name : 'remove-warn',
     aliases: ['rmw'],
     description : 'Remove warn from user',
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
                   let number = parseInt(args[1]) - 1;
                   data.content.splice(number, 1)
                   message.channel.send(`**Removed the warn from ${user.user.tag}!**`);
                   data.save();
              } else {
                   message.channel.send(`**${user.user.tag}**, This user does not have any warns in this server!`)
              }
         })
    }
}