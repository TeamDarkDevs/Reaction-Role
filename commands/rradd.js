 
 const Discord = require("discord.js")
 const { attention, yes, mention, channele, msg } = require('./../emojis.json')

 module.exports = {
    name: "rradd",
    description: "set auto-partner channel",
    run: async (client, message, args, db, prefix) => {
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**YOU MUST HAVE PERMISSIONS.**`)
    let channel = message.mentions.channels.first();
    if(!channel) return message.channel.send(`${prefix}rradd <#channeL> <MESSAGEID> <ROLE> <EMOJI>`)
        if(!args[1]) return message.channel.send(`${prefix}rradd ${channel} <MESSAGEID> <ROLE> <EMOJI>`)        
    
    let messageid = client.channels.cache.get(`${channel.id}`).messages.fetch(`${args[1]}`)
     if(!messageid) return message.channel.send(`**That's not an vaild message iD** `)
    
    if(isNaN(args[1])) return message.channel.send(`Message ID Must Be ANumber`)
    let role = message.mentions.roles.first();
    if(!role) return message.channel.send(`${prefix}rradd ${channel} ${args[1]} <@role> <Emoji> `)
    let check = message.guild.roles.cache.find(r => r.name === `${role.name}`)
    if(!check) return message.channel.send(`invaild role!`)
    if(!args[3]) return message.channel.send(`${prefix}rradd ${channel} ${args[1]} ${role.name} <EMOJI> `)
    let customemoji = Discord.Util.parseEmoji(args[3]);
    let emojicheck = client.emojis.cache.find(emoji => emoji.id === `${customemoji.id}`);
    if(!emojicheck) return message.channel.send(`this emoji is invaild! (You Cant use discord default emotes)`)
  let embed = new Discord.MessageEmbed()
 .setThumbnail(message.guild.iconURL())
 .setTitle(`${yes} Reaction Role Sucsses!`)
 .setDescription(`**Done!**
 
 **${msg} [Go To Message](https://discord.com/channels/${message.guild.id}/${channel.id}/${args[1]})
 ${mention} Role : ${role}
 ${attention} [Emoji](https://cdn.discordapp.com/emojis/${emojicheck.id}.png?v=1) : ${emojicheck}
 ${channele} Channel : ${channel}**
 `)
 .setTimestamp()
 .setFooter(message.guild.name , message.guild.iconURL())

    message.channel.send(embed)
     client.channels.cache.get(`${channel.id}`).messages.fetch(`${args[1]}`).then(a => {
         a.react(emojicheck.id)
     db.set(`rrremove_${message.guild.id}_${args[1]}2`, channel.id)
     db.set(`rrremove_${message.guild.id}_${args[1]}_${args[3]}`, emojicheck.id)
     db.set(`rerremove_${message.guild.id}_${args[1]}`, args[1])
     db.set(`emoteid_${message.guild.id}_${emojicheck.id}`, emojicheck.id)
     db.set(`role_${message.guild.id}_${emojicheck.id}`, role.id)
     db.set(`message_${message.guild.id}_${emojicheck.id}`, args[1])
     let data = {
         author: message.author.username
     }
    db.push(`reactiondata_${message.guild.id}`)
        })

    }}
