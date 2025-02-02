require('dotenv').config();
const { Client, GatewayIntentBits, InteractionType } = require('discord.js');
const express = require('express');
const commandRoutes = require('./commands/administrationRoutes');
const axios = require('axios');
const commands = require('./commands/commandList'); 

const app = express();
const port = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '!valion';

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

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    // Diferir la respuesta para evitar el timeout
    await interaction.deferReply();
    
    const { commandName, options } = interaction;

    if (commandName === 'valion') {
        const selectedCommand = options.getString('comando');

        if (selectedCommand === 'jugadores') {
            try {
                const response = await axios.get('http://localhost:3000/api/jugadores');
                // Usar editReply para actualizar el mensaje diferido
                await interaction.editReply(response.data.message);
            } catch (error) {
                console.error('Error al obtener jugadores:', error);
                await interaction.editReply('Hubo un error al obtener los jugadores.');
            }
        } else if (selectedCommand === 'giveItemToPlayer') {
            await interaction.editReply('📌 Este comando requiere argumentos. Usa `/valion giveItemToPlayer` seguido de los valores.');
        }
    }
});


// bot.on('messageCreate', async (message) => {
//     if (message.author.bot) return;

//     const args = message.content.split(' ');
//     if (!args[0].startsWith(PREFIX)) return;

//     const commandName = args[1];

//     // Si solo escriben "!valion", mostrar la lista de comandos
//     if (!commandName) {
//         const commandList = Object.keys(commands)
//             .map(cmd => `🔹 **${PREFIX} ${cmd}** - ${commands[cmd].description}`)
//             .join("\n");

//         return message.reply(`📜 **Lista de comandos disponibles:**\n\n${commandList}`);
//     }

//     // Verificar si el comando existe
//     if (!commands[commandName]) {
//         return message.reply(`⚠️ Comando no reconocido. Usa \`${PREFIX}\` para ver la lista de comandos.`);
//     }

//     const commandInfo = commands[commandName];

//     try {
//         if (commandInfo.args.length === 0) {
//             // Comando sin argumentos (GET)
//             const response = await axios.get(`http://localhost:3000/api${commandInfo.endpoint}`);
//             return message.reply(response.data.message);
//         } else {
//             // Si el usuario no pasó argumentos, mostrar ayuda del comando
//             if (args.length <= 2) {
//                 const helpMessage = `📌 **Uso de \`${PREFIX} ${commandName}\`**\n${commandInfo.description}\n\n` +
//                     commandInfo.args.map(arg => `🔹 **${arg.name}**: ${arg.description}`).join("\n");

//                 return message.reply(helpMessage);
//             }

//             // Extraer argumentos
//             const userArgs = args.slice(2);
//             if (userArgs.length < commandInfo.args.length) {
//                 return message.reply(`⚠️ Faltan argumentos. Usa \`${PREFIX} ${commandName}\` para ver los detalles.`);
//             }

//             // Construir datos para la petición POST
//             const requestData = {};
//             commandInfo.args.forEach((arg, index) => {
//                 requestData[arg.name] = userArgs[index];
//             });

//             const response = await axios.post(`http://localhost:3000/api${commandInfo.endpoint}`, requestData);
//             message.reply(response.data.message);
//         }
//     } catch (error) {
//         console.error('Error al ejecutar el comando:', error);
//         message.reply('❌ Hubo un error al ejecutar el comando.');
//     }
// });

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
