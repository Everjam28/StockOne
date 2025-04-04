const express = require('express');
const CategoriaController = require('../controllers/categoria.controller');

const router = express.Router();
router.get('/', CategoriaController.obtenerCategorias);
router.get('/:id', CategoriaController.obtenerCategoriaPorId);


router.post('/', CategoriaController.crearCategoria);
router.put('/:id', CategoriaController.actualizarCategoria);
router.delete('/:id', CategoriaController.eliminarCategoria);

module.exports = router;
