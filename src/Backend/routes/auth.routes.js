const express = require('express');
const { iniciarSesion, cambiarClavePrimeraVez } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', iniciarSesion);
router.post('/cambiar-clave', cambiarClavePrimeraVez);

module.exports = router;