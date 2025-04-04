const express = require('express');
const UsuarioController = require('../controllers/usuario.controller');

//const verificarToken = require('../middlewares/authMiddleware');  // Importa el middleware
const router = express.Router();

// Rutas para los usuarios
router.get('/', UsuarioController.obtenerUsuarios);
router.get('/:id', UsuarioController.obtenerUsuarioPorId);
router.get('/correo', UsuarioController.obtenerUsuarioPorCorreo); // Nueva ruta para buscar por correo
router.post('/', UsuarioController.crearUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);

module.exports = router;