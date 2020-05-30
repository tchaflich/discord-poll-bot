require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const emojiRegex = require('emoji-regex');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});



/**
 * Was the sent message address to this bot?
 *
 * @param {object} message
 */
function isAddressedToMe(message) {
	return !!(message && message.mentions && message.mentions.users && message.mentions.users.find((u) => {
		return u.id === client.user.id;
	}));
}

const unicodeEmojiMatcher = emojiRegex();
const discordEmojiMatcher = /<:.+?:(\d+)>/gi;

function main(message) {
	const str = message.content;

	let results = [];

	var match;

	while ((match = unicodeEmojiMatcher.exec(str)) != null) {
		console.log(match);
		results.push({
			'index': match.index,
			'match': match[0],
		});
	}

	while ((match = discordEmojiMatcher.exec(str)) != null) {
		console.log(match);
		results.push({
			'index': match.index,
			'match': match[1],
		});
	}

	results.sort((a, b) => {
		return a.index - b.index;
	});

	results.forEach((a) => {
		try {
			message.react(a.match);
		} catch (e) {
			console.log(e);
		}
	});
}

client.on('message', message => {
	// cannot reply to non-authored or bot messages

	if (!message || !message.author) {
		return;
	}
	if (message.author.bot) {
		return;
	}

	if (message.content === 'ping') {
		message.reply('pong');
	}

	if (message.channel.type === 'dm' || isAddressedToMe(message)) {
		main(message);
	}
});

client.login(process.env.APIToken);
