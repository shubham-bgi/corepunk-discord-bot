const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const rankRairty = require('./data/rank.json');
const metadata = require("./data/metadata_rank.json");
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const botConfig = require('./botConfig.json');

bot.login(botConfig.token);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', msg => {
    if (msg.author.bot || msg.channel.type === 'dm' || !(msg.mentions.users.has(bot.user.id) || msg.content.startsWith(botConfig.prefix))) return;
    const args = msg.content.split(/ +/);
    const id = +args.pop();
    if (!id || isNaN(id)) {
        msg.channel.send(`Usage: @${bot.user.username} id\nExample: @${bot.user.username} 10`);
        return;
    }
    if (id < 1 || id > 10000) {
        msg.channel.send(`Id should be in range of 1 - 10000.`);
        return;
    }

    console.log(`${msg.author.username}#${msg.author.discriminator} asked for id - ${id}`)
    const obj = metadata[id - 1];
    rankRairty.forEach(ele => {
        const [lower, upper]  =  ele.rankRange.split('-')
        if(obj.rank>=lower && obj.rank<=upper) {
            obj.rarity = ele.rarity;
        }
    })
    const embed = new EmbedBuilder()
        .setTitle(obj.name)
        .setDescription(`**${obj.description}**\n**${obj.rarity} Rank #${obj.rank}**`)
        .setImage(obj.image);
        // .setFooter({ text: `**${obj.rarity} Rank #${obj.rank}**` });

    msg.channel.send({ embeds: [embed] });
});