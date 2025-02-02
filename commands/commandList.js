const commands = {
    players: {
        description: "Muestra la lista de jugadores registrados.",
        method: "GET",
        endpoint: "/jugadores",
        args: []
    },
    
    giveItemToPlayer: {
        description: "Entrega un objeto a un jugador.",
        method: "POST",
        endpoint: "/giveItemToPlayer",
        args: [
            { name: "playerId", description: "ID del jugador que recibirá el objeto." },
            { name: "item", description: "Nombre del objeto a entregar." },
            { name: "quantity", description: "Cantidad de objetos a entregar." },
            { name: "quality", description: "Calidad del objeto (1-100)." },
            { name: "isBp", description: "Indicar si es un Blueprint (true/false)." }
        ]
    }
};

module.exports = commands;