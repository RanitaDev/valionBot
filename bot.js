require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { Rcon } = require('rcon-client');

//CONFIGURACIÓN GENERAL DEL BOT
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

bot.once('ready', () => {
    console.log(`${bot.user.tag} ahora está funcionando! Yeeei!`);
});


// Función para conectarse a RCON
async function sendRconCommand(command) {

    const rcon = new Rcon({
        host: process.env.RCON_HOST,
        port: process.env.RCON_PORT,
        password: process.env.RCON_PASSWORD
    });

    try {
        await rcon.connect();
        const response = await rcon.send(command);
        console.log('EXECUTED COMMAND: ', command, ' - SUCCESS!');
        return response;
    } catch (error) {
        console.error('Error en RCON:', error);
        return 'Error al conectarse al servidor RCON.';
    }
}

bot.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignorar mensajes de otros bots
    
    const args = message.content.split(' '); // Dividir el mensaje en palabras
    if (args[0] !== '!valion') return; // Asegurarse de que el comando empieza con !valion
    
    if (args[1] === 'jugadores') {
        const response = await sendRconCommand('ListPlayers');

        if (!response || response.trim() === 'No Players Connected') {
            message.reply('📭 No hay jugadores conectados en este momento.');
            return;
        }

        const players = response.split('\n').filter(line => line.trim() !== '');

        let playerList = '👥 **Jugadores conectados:**\n';
        players.forEach(player => {
            playerList += `▶ ${player}\n`;
        });

        message.reply(playerList);
        return;
    }

    const command = args.slice(1).join(' '); // Tomamos todo después de "!ark"
    const response = await sendRconCommand(command);
    message.reply(`Respuesta del servidor: \n\`\`\`${response}\`\`\``);
});


bot.login(process.env.DISCORD_TOKEN);

