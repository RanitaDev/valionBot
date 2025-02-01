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

// NO FUINCIOAN 
// async function getAllIdPlayers(eos) {
//     const playerId = await sendRconCommand(`showMyAdminManager`);
//     console.log(playerId);
//     return playerId;
// }

// Controlador para manejar la petición de jugadores
async function getAllPlayers(req, res, intern = false) {
    const response = await sendRconCommand('ListPlayers');

    if (!response || response.trim() === 'No Players Connected') {
        return res.json({ message: '📭 No hay jugadores conectados en este momento.' });
    }

    const players = response.split('\n').filter(line => line.trim() !== '');
    const filterEOS = players.map(item => item.split(', ')[1].trim())
                                   .filter(code => code.startsWith('0002'));

    let playerList = '👥 **Jugadores conectados:**\n';
    players.forEach(player => {
        playerList += `▶ ${player}\n`;
    });

    if(intern) return filterEOS;

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
    giveItemToPlayer
};
