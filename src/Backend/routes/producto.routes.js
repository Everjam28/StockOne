const express = require('express');
const ProductoController = require('../controllers/producto.controller');

const router = express.Router();

router.get('/', ProductoController.obtenerProductos);
router.get('/:id', ProductoController.obtenerProductoPorId);
router.post('/', ProductoController.crearProducto);
router.put('/:id', ProductoController.actualizarProducto);
router.delete('/:id', ProductoController.eliminarProducto);

module.exports = router;
