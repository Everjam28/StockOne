// backend/routes/role.routes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

router.post('/', roleController.crearRol); // Crear rol
router.get('/', roleController.obtenerRoles); // Obtener todos los roles
router.get('/:id', roleController.obtenerRolPorId); // Obtener rol por ID
router.put('/:id', roleController.actualizarRol); // Actualizar rol
router.delete('/:id', roleController.eliminarRol); // Eliminar rol

module.exports = router;
