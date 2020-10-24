 
 const Discord = require("discord.js")
 const { attention, yes, mention, channele, msg } = require('./../emojis.json')

 module.exports = {
    name: "rrdel",
    description: "delete reaction role",
    run: async (client, message, args, db, prefix) => {
    if(!args[0]) return message.channel.send(`${prefix}rrdelete (messageid) (emoji)`)
    let channel = await db.get(`rrremove_${message.guild.id}_${args[0]}2`)
    let messageid = await db.get(`rerremove_${message.guild.id}_${args[0]}`)

    if(!channel) return message.channel.send(`**Message ID Not Found**`)
    if(!messageid) return message.channel.send(`**MessageID Not Found**`)
    let a = client.channels.cache.get(channel).messages.fetch(args[0])
   if(!a) return message.channel.send(`**That's Message ID Invaild**`)
   if(!args[1]) return message.channel.send(`${prefix}rrdelete (mesageid) (emoji)`)
   let customemoji = Discord.Util.parseEmoji(args[1]);
   
   let emojicheck = client.emojis.cache.find(emoji => emoji.id === `${customemoji.id}`);
   if(!emojicheck) return message.channel.send(`this emoji is invaild!`)

   let emote = await db.get(`rrremove_${message.guild.id}_${args[0]}_${args[1]}`)
   if(!emote) return message.channel.send(`theres no emojis with ${emojicheck} on ${args[0]}`)
   client.channels.cache.get(channel).messages.fetch(args[0]).then(darkcodes => {
darkcodes.reactions.cache.get(`${emojicheck.id}`).remove() 
   })

   let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription(`**Sucsses**
        Removed  **${msg} [Go To Message](https://discord.com/channels/${message.guild.id}/${channel}/${args[0]})**
      ${attention} Reaciton Cleared 
      ${attention} Reaciton Role Removed.`)
        .setFooter(message.guild.name , message.guild.iconURL())
        .setTimestamp()
        message.channel.send(embed)
        db.delete(`emoteid_${message.guild.id}_${emojicheck}`)
        db.delete(`role_${message.guild.id}_${emojicheck}`)
        db.delete(`message_${message.guild.id}_${emojicheck}`)
       db.delete(`rrremove_${message.guild.id}_${args[0]}2`)
       db.delete(`rrremove_${message.guild.id}_${args[0]}_${args[1]}`)
       db.delete(`rerremove_${message.guild.id}_${args[0]}`)
 }}
