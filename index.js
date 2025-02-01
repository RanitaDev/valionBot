require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const commandRoutes = require('./commands/administrationRoutes');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Configuración del bot de Discord
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Inicialización del bot
bot.once('ready', () => {
    console.log(`${bot.user.tag} ahora está funcionando!`);
});

// Escuchar los mensajes para interactuar con el bot
bot.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignorar mensajes de otros bots
    const args = message.content.split(' ');
    if (args[0] !== '!valion') return;
    const command = args[1];

    try {

        if(args.length<=2) {
            const response = await axios.get(`http://localhost:3000/api/${command}`);
            message.reply(response.data.message);
        } 

        if(args.length>2){
            const newArray = args.slice(2);
            const [playerId, item, quantity, quality, isBp] = newArray;
            const data = {
                playerId,
                item,
                quantity, 
                quality,
                isBp
            };

            const response = await axios.post(`http://localhost:3000/api/${command}`, data);
            message.reply(response.data.message);
        }

    } catch (error) {
        //console.error('Error al ejecutar el comando:', error);
        message.reply('Hubo un error al ejecutar el comando.');
    }
});

app.use(express.json());

// Usar las rutas en la API
app.use('/api', commandRoutes);

// Levantar el servidor
app.listen(port, () => {
    console.log(`Servidor API levantado en el puerto ${port}`);
});

// Iniciar el bot
bot.login(process.env.DISCORD_TOKEN);

module.exports = bot;
