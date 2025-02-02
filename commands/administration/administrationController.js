const { Rcon } = require('rcon-client');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const server = config.RCON_SERVERS;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para conectarse a RCON y ejecutar el comando
async function sendRconCommand(serverName, command) {
    // Obtén los detalles del servidor de config.json
    const server = config.RCON_SERVERS[serverName];
    
    if (!server) {
        console.error(`Servidor no encontrado: ${serverName}`);
        return 'Error: Servidor no encontrado';
    }

    const rcon = new Rcon({
        host: server.RCON_HOST,
        port: server.RCON_PORT,
        password: server.RCON_PASS,
        timeout: 10000
    });

    try {
        await rcon.connect();
        const response = await rcon.send(command);
        console.log(`EXECUTED COMMAND on ${serverName}: `, command);
        return response;
    } catch (error) {
        console.error('Error en RCON:', error);
        return 'Error al conectarse al servidor RCON.';
    }
}

// Controlador para manejar la petición de jugadores
async function getAllPlayers(req, res, intern = false) {
    const allPlayers = [];

    // Iterar sobre todos los servidores definidos en config.json
    for (const serverName in config.RCON_SERVERS) {
        if (config.RCON_SERVERS.hasOwnProperty(serverName)) {
            const response = await sendRconCommand(serverName, 'ListPlayers');

            if (!response || response.trim() === 'No Players Connected') {
                continue;
            }

            const players = response.split('\n').filter(line => line.trim() !== '');
            const playerListWithMap = players.map(player => {
                return `${player}`; // Solo mapa y nombre del jugador
            });

            // Concatenar la lista de jugadores con el nombre del servidor
            allPlayers.push(...playerListWithMap);
        }
    }

    if (allPlayers.length === 0) {
        return res.json({ message: '📭 No hay jugadores conectados en ningún servidor en este momento.' });
    }

    let playerList = '👥 **Jugadores conectados:**\n';
    allPlayers.forEach(player => {
        playerList += `- ${player}\n`;  // Mostrar solo mapa y nombre sin números
    });
    
    return res.json({ message: playerList });
}


// async function giveItemToPlayer(req, res) {
    
//     const EOS = await getAllPlayers(null, null, true);    
//     if(!EOS) return res.json({ message: `El jugador con **EOS: ${req.body.playerId}**\n no existe o no está conectado`});

//     const response = await sendRconCommand(
//         `giveItemToPlayer ${req.body.playerId} ${req.body.item} ${req.body.quantity} ${req.body.quality} ${req.body.isBp}`
//     );
//     const players = playersOnline.message;
//     return playersOnline;

// }

module.exports = { 
    getAllPlayers,
    //giveItemToPlayer
};
