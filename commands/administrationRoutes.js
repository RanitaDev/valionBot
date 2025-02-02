const express = require('express');
const router = express.Router();

const {
    getAllPlayers,
    giveItemToPlayer
} = require('./administration/administrationController');  

// Rutas usando las funciones de 'showAllPlayers'
router.get('/jugadores', getAllPlayers); // Ruta para obtener los jugadores

//router.post('/giveItemToPlayer', giveItemToPlayer);

module.exports = router;
