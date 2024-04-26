const net = require('net');
const axios = require('axios');

const BOT_USERNAME = 'nome do usuário';
const BOT_PASSWORD = 'oauth';
const CHANNELS = ['#channel1', '#channel2', '#channel3']; // Adicione quantos canais você precisar, só seguir o mesmo padrão
const BANNED_WORDS = ['palavra1', 'palavra2', 'palavra3']; // Adicione as palavras aqui, pode colocar quantas quiser

const server = 'irc.chat.twitch.tv';
const port = 6667;

const client = new net.Socket();

client.on('data', async data => {
    const message = data.toString().trim();
  
  
  // Parse JOIN message to get broadcaster's ID
  if (message.includes('JOIN')) {
    const channelId = parseBroadcasterId(message);
    console.log(`Broadcaster's channel ID: ${channelId}`);
  }
});
  
function parseBroadcasterId(message) {
    const parts = message.split(' ');
    const channelName = parts[2].substring(1); // Remove leading '#'
    return channelName;
  }
  
  client.connect(port, server, () => {
    console.log('Connected to IRC server');
    
    client.write(`PASS ${BOT_PASSWORD}\r\n`);
    client.write(`NICK ${BOT_USERNAME}\r\n`);
    
    CHANNELS.forEach(channel => {
      client.write(`JOIN ${channel}\r\n`);
    });
  });
  
  client.on('data', async data => {
    const message = data.toString().trim();
    console.log(message);
    
    // Parse message and check for banned words
    if (isMessageFromChannel(message)) {
      const channelName = parseBroadcasterId(message);
      const sender = parseSender(message);
      const content = parseContent(message);
    
      if (containsBannedWord(content)) {
        console.log(`Banned word detected from ${sender}: ${content}`);
        const moderatorId = await getChannelId(BOT_USERNAME); // Ele vai substituir o BOT_USERNAME com seu nick que deixou lá em cima, seja seu nick pessoal, ou algum bot seu
        const channelId = await getChannelId(channelName); // Vai pegar o canal onde ocorreu a mensagem do bot
        if (channelId) {
          const userId = await getChannelId(sender); 
          if (userId) {
            await banUser(sender, userId, channelId, moderatorId);
          }
        }
      }
    }
  });
  
  function isMessageFromChannel(message) {
    return message.includes('PRIVMSG');
  }
  
  function parseSender(message) {
    return message.split('!')[0].slice(1);
  }
  
  function parseContent(message) {
    return message.split('PRIVMSG')[1].trim();
  }
  
  function containsBannedWord(content) {
    const regex = new RegExp(BANNED_WORDS.join('|'), 'i');
    return regex.test(content);
  }
    
  async function getChannelId(username) {
    try {
      const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Client-ID': 'Client-ID',
          'Authorization': 'Bearer Acess_Token'        //Vai apenas substituir o Acess_Token com seu Token, Bearer e as aspas devem ficar
        }
      });
  
      // Extract the channel ID from the response
      const data = response.data.data;
      if (data.length > 0) {
        const channelId = data[0].id;
        return channelId;
      } else {
        console.error(`No channel found for username: ${username}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching channel ID for username ${username}: ${error.message}`);
      return null;
    }
  }
  
  
  async function banUser(senderId, userId, channelId, moderatorId) {
    const token = 'Acess Token';
   
    console.log(`User ID: ${userId}`);
    console.log(`Channel ID: ${channelId}`);
   
    const url = `https://api.twitch.tv/helix/moderation/bans`;
    const body = {
      'broadcaster_id': channelId,
      'data': { 'user_id': userId, 'reason': 'Bot de auto divulgacao' },
      'moderator_id': moderatorId
    };
    
    try {
      const response = await axios.post(url, body, {
        headers: {
          'Client-ID': 'Client ID',        //No Client_ID você substituirá com o seu Client-iD, mantenha das aspas
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response.data);
      console.log(`User ${senderId} banned successfully`);
    } catch (error) {
      if (error.response) {
        console.error(`Error response data:`, error.response.data);
        console.error(`Error response status:`, error.response.status);
      } else if (error.request) {
        console.error(`No response received:`, error.request);
      } else {
        console.error(`Error setting up the request:`, error.message);
      }
    }
  }

(`setTimeout(connectToServer, 100);`)
