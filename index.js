const {
    Collection,
    Client,
    Discord,
    MessageEmbed,
    MessageAttachment
} = require('discord.js')
const ms = require('ms');
const fs = require('fs')
const client = new Client({
    disableEveryone: true
})
const blacklist = require('./models/blacklist');
const prefixSchema = require('./models/prefix');
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const config = require('./config.json')
const prefix = config.prefix
const token = config.token
const dbURL = config.MONGODB_URL
const db = require('quick.db');
const welcomeSchema = require('./models/welcomeChannel');
const Timeout = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.prefix = async function(message) {
    let custom;

    const data = await prefixSchema.findOne({ Guild : message.guild.id })
    .catch(err => console.log(err))

    if(data) {
        custom = data.Prefix;
    } else {
        custom = prefix;
    }
    return custom;
}

client.on('ready', () => {
    client.user.setActivity(`${prefix}help`)
    console.log(`${client.user.username} ✅`)
})
client.on('message', async message => {
    if (message.author.bot) return;
    const p = await client.prefix(message)
    if(message.mentions.users.first()) {
        if(message.mentions.users.first().id === '851463001072468029') return message.channel.send(`My prefix for \`${message.guild.name}\` is \`${p}\`, Type \`${p}help\` for help.`);
    }
    if (!message.content.startsWith(p)) return;
    blacklist.findOne({ id : message.author.id}, async (err, data) => {
        if(err) throw err;
        if(!data) {
            if (!message.guild) return;
            if (!message.member) message.member = await message.guild.fetchMember(message);
            const args = message.content.slice(p.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            if (cmd.length == 0) return;
            let command = client.commands.get(cmd)
            if (!command) command = client.commands.get(client.aliases.get(cmd));
            if (command) {
                command.run(client, message, args)
            } 
        } else {
            message.channel.send('You are blacklisted, you cannot use any command!');
        }
    })    
})

//antispam event 
const userMap = new Map();
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (db.has(`antispam-${message.guild.id}`) === false) return;
    if (userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        const {
            lastMessage,
            timer
        } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;
        console.log(difference);

        if (difference > DIFF) {
            clearTimeout(timer);
            console.log('Cleared Timedout');
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                userMap.delete(message.author.id);
                console.log('Removed from map.')
            }, TIME)
            userMap.set(message.author.id, userData)
        } else {
            ++msgCount;
            if (parseInt(msgCount) === LIMIT) {
                let muterole = message.guild.roles.cache.find(role => role.name === 'muted');
                if (!muterole) {
                    try {
                        muterole = await message.guild.roles.create({
                            name: "muted",
                            permissions: []
                        })
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite({
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false
                            })
                        })
                    } catch (e) {
                        console.log(e)
                    }
                }
                message.member.roles.add(muterole);
                message.channel.send('You have been muted coz of spamming!');
                setTimeout(() => {
                    message.member.roles.remove(muterole);
                    message.channel.send('You have been unmuted, Don\'t spam next time!');
                }, TIME)
            } else {
                userData.msgCount = msgCount;
                userMap.set(message.author.id, userData);
            }
        }
    } else {
        let fn = setTimeout(() => {
            userMap.delete(message.author.id);
            console.log('Removed from map.')
        }, TIME);
        userMap.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        })
    }
})


//welcome system 
client.on('guildMemberAdd', async (member) => {
    welcomeSchema.findOne({ Guild: member.guild.id}, async (e, data) => {
        if(!data) return;
        const user = member.user;
        const embed = new MessageEmbed()
        .setTitle(`Welcome to **${member.guild.name}**`)
        .setThumbnail(member.guild.iconURL( {dynamic : true} ))
        .setColor(`#8015EA`)
        .setDescription(`WELCOME, <@${user.id}> TO EMPYREAN ESPORTS HOPE YOU HAVE A GREAT TIM HERE \n TOTAL MEMBERS: ${member.guild.memberCount}`)
        .setTimestamp();
          const channel = member.guild.channels.cache.get(data.Channel);
          channel.send(embed);
    })
})

//verify with captcha system
client.on('guildMemberAdd', async (member) => {
    if (db.has(`captcha-${member.guild.id}`) === false) return;
    const url = 'https://api.no-api-key.com/api/v2/captcha';
    try {
        fetch(url)
            .then(res => res.json())
            .then(async json => {
                // console.log(json)
                const msg = await member.send(
                    new MessageEmbed()
                    .setTitle('Please enter the captcha to Verify')
                    .setDescription('You may have 1m to try!')
                    .setImage(json.captcha)
                    .setColor("RANDOM")
                    .setTimestamp()
                )
                try {
                    const filter = (m) => {
                        if (m.author.bot) return;
                        if (m.author.id === member.id && m.content === json.captcha_text) return true;
                        else {
                            msg.channel.send("You have answered the captcha")
                        }
                    };
                    const response = await msg.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ['time']
                    })
                    if (response) {
                        msg.channel.send('Cograts, you have answered the captcha.')
                    }
                } catch (error) {
                    msg.channel.send(`You have been kicked from **${member.guild.name}** for not answering the captcha correctly.`)
                    member.kick()
                }
            })
    } catch (error) {
        console.log(error);
    }
})
//connecting mongodb
mongoose.connect(dbURL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false
}).then(() => {
     console.log('Connected to the database!');
}).catch((err) => {
     console.log(err);
});
// if the bot got kicked the data for prefix will delete from database
client.on('guildDelete', async (guild) => {
    prefixSchema.findOne({ Guild : guild.id }, async (err, data) => {
        if(err) throw err;
        if(data) {
            prefixSchema.findOneAndDelete({ Guild : guild.id }).then(console.log('deleted data.'))
        }
    })
})

client.login(token)