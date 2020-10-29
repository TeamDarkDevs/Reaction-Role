const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const db = require('quick.db')
const prefix = config.prefix; 
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.sendStatus(200);
});

client.on('ready', () => {
 console.log("App Connected! " , client.user.tag)
 })
client.commands= new Discord.Collection();

const { join } = require('path');
const { readdirSync } = require('fs');
 const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name , command);
}

client.on("message", async message => {
   if(message.author.bot) return;
      if(message.channel.type === 'dm') return;
       if(message.content.startsWith(prefix)) {
          
 
          const args = message.content.slice(prefix.length).trim().split(/ +/);
  
          const command = args.shift().toLowerCase();
  
          if(!client.commands.has(command)) return;
  
          try {
              client.commands.get(command).run(client, message, args, db, prefix);
  
          } catch (error){
              console.error(error);
          }
       }
  })

 client.on('messageReactionAdd', async (reaction, user) => {
  console.log(user.username)
  if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();
  if(user.bot) return;
  let giveawayid = await db.get(`GiveawayEmbed_${reaction.message.id}`)
  console.log(giveawayid)
  if(!giveawayid) return
  let giveawayrole = await db.get(`GiveawayRole_${reaction.message.id}`)
  if(!giveawayrole) return;
   if(reaction.message.id == giveawayid && reaction.emoji.name == `🎉`) {
    var home = await db.get(`giveawaydone_${reaction.message.id}`)
     
    var reactioncheck = setInterval(async function() {
  
       let member = reaction.message.guild.members.cache.get(user.id) 
      let guild = client.guilds.cache.get(reaction.message.guild.id)
      let role = guild.roles.cache.find(role => role.id === `${giveawayrole}`); 	      

      if(!member.roles.cache.has(`${role.id}`)) { 
        reaction.users.remove(user.id) 
       }
       
 
if(home === null) {
    clearInterval()
    clearInterval(reactioncheck);
  return;
}
if(!home) {
  clearInterval()
  clearInterval(reactioncheck);
return;
}
},5000);
let member = reaction.message.guild.members.cache.get(user.id) 
let guild = client.guilds.cache.get(reaction.message.guild.id)
let role = guild.roles.cache.find(role => role.id === `${giveawayrole}`)
let ffff = new Discord.MessageEmbed()
.setThumbnail(reaction.message.guild.iconURL())
.setTitle(`Giveaway Entry Denied!`)
 .setColor(`#ff0000`)
.setDescription(`**There is a requirement of role you Must Have That Role to enter the giveaway!**\n\n*by reacting to a message sent by Giveaway, you agree to be messaged.*

  `)	
  let embed = new Discord.MessageEmbed()
  .setThumbnail(reaction.message.guild.iconURL())
  .setTitle(`Giveaway Entry Arpoved!`)
  .setColor(`#00FF00`)
  .setDescription(`**Your Entry for [this giveaway](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}) has been approved!**\n\n*by reacting to a message sent by Giveaway, you agree to be messaged.*
  
    `)
  .setTimestamp()
  .setFooter(reaction.message.guild.name , reaction.message.guild.iconURL())
if(member.roles.cache.has(`${role.id}`)) return user.send(embed)
if(!member.roles.cache.has(`${role.id}`)) return user.send(ffff)
}
})
client.on('messageReactionAdd', async (reaction, user) => {
   if(user.partial) await user.fetch();
  if(reaction.partial) await reaction.fetch();
  if(reaction.message.partial) await reaction.message.fetch();
  if(user.bot) return;
  let giveawayid = await db.get(`GiveawayEmbed_${reaction.message.id}`)
   if(!giveawayid) return
  let giveawayids = await db.get(`GiveawayID_${reaction.message.id}`)
  if(!giveawayids) return;
   if(reaction.message.id == giveawayid && reaction.emoji.name == `🎉`) {
     console.log(user.id)
     console.log(user)
let guild = client.guilds.cache.get(giveawayids)
let guildcheck = guild.member(user.id)

     var reactioncheck = setInterval(async function() {
   if(!guildcheck) { return reaction.users.remove(user.id); }
    
    },5000)
    if(guildcheck) {
      let embed = new Discord.MessageEmbed()
    .setThumbnail(reaction.message.guild.iconURL())
    .setTitle(`Giveaway Entry Arpoved!`)
    .setColor(`#00FF00`)
    .setDescription(`**Your Entry for [this giveaway](https://discord.com/channels/${reaction.message.guild.id}/${reaction.message.channel.id}/${reaction.message.id}) has been approved!**\n\n*by reacting to a message sent by Giveaway, you agree to be messaged.*`)
    user.send(embed) 
           }
           if(!guildcheck) {
       let ffff = new Discord.MessageEmbed()
      .setThumbnail(reaction.message.guild.iconURL())
      .setTitle(`Giveaway Entry Denied!`)
       .setColor(`#ff0000`)
      .setDescription(`**There is a requirement of role you Must Have That Role to enter the giveaway!**\n\n*by reacting to a message sent by Giveaway, you agree to be messaged.*`)
    reaction.users.remove(user.id)
      user.send(ffff)  
     }
   }
})
 
client.login(config.token)
