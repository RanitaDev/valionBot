require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'valion',
        description: 'Lista de comandos disponibles',
        options: [
            {
                name: 'comando',
                type: ApplicationCommandOptionType.String,
                description: 'Elige un comando',
                required: true,
                choices: [
                    { name: 'jugadores', value: 'jugadores' },
                    { name: 'giveItemToPlayer', value: 'giveItemToPlayer' }
                ]
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registrando slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registrados.');
    } catch (error) {
        console.error('❌ Error al registrar comandos:', error);
    }
})();
