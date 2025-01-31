const { Rcon } = require('rcon-client');

// Función para conectarse a RCON y ejecutar el comando
async function sendRconCommand(command) {
    const rcon = new Rcon({
        host: process.env.RCON_HOST,
        port: process.env.RCON_PORT,
        password: process.env.RCON_PASSWORD
    });

    try {
        await rcon.connect();
        const response = await rcon.send(command);
        console.log('EXECUTED COMMAND: ', command, '- SUCCESS!');
        return response;
    } catch (error) {
        console.error('Error en RCON:', error);
        return 'Error al conectarse al servidor RCON.';
    }
}

// Controlador para manejar la petición de jugadores
async function getAllPlayers(req, res) {
    const response = await sendRconCommand('ListPlayers');

    if (!response || response.trim() === 'No Players Connected') {
        return res.json({ message: '📭 No hay jugadores conectados en este momento.' });
    }

    const players = response.split('\n').filter(line => line.trim() !== '');

    let playerList = '👥 **Jugadores conectados:**\n';
    players.forEach(player => {
        playerList += `▶ ${player}\n`;
    });

    return res.json({ message: playerList });
}

module.exports = { 
    getAllPlayers 
};
