const { Message } = require('discord.js');
module.exports = {
     name : 'unmute',
     aliases: ['unm'],
     description: "Unmute the user",
     /**
     * @param {Message} message 
     */
     run : async(client, message, args) => {
          if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permissions to use this command!');
          const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
          if(!Member) return message.channel.send('Member is not found!');

          const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted');
          if(Member.roles.cache.has(role.id)){
               await Member.roles.remove(role)
               message.channel.send(`**${Member.displayName}** is now unmuted.`);
          } else {
               return message.channel.send(`**${Member.displayName}**, This user is not muted!`)
          }
     }
}