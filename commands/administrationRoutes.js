const express = require('express');
const router = express.Router();

const {
    getAllPlayers
} = require('./administration/administrationController');  

// Rutas usando las funciones de 'showAllPlayers'
router.get('/jugadores', getAllPlayers); // Ruta para obtener los jugadores

module.exports = router;
