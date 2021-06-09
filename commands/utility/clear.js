require('discord-reply');
module.exports = {
     name: 'clear',
     aliases: ['purge'],
     description: 'Delete bulk amount of messages',
     run: async (client, message, args) => {
          if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply("You don't have permission to use this command!");
          if (!args[0]) return message.lineReply('Please specify an amount to delete (1-99)');
          if (isNaN(args[0])) return message.lineReply('Only number are allowed')
          if (parseInt(args[0]) > 99) return message.lineReply('The max amount of message you can delete is 99');
          await message.channel.bulkDelete(parseInt(args[0]) + 1)
               .catch(err => message.channel.send(err.message))
          message.channel.send(`Deleted ${args[0]} messages!`).then(m => m.delete({
               timeout: 5000
          }));

     }
}