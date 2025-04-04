const express = require('express');
const VentasController = require('../controllers/ventas.controller');
//const verificarToken = require('../middlewares/authMiddleware');  // Importa el middleware

const router = express.Router();

// 🔐 Protege las rutas con el middleware
router.get('/',  VentasController.obtenerVentas);
router.get('/detalle/:id', VentasController.obtenerDetalleVenta);
router.post('/',  VentasController.registrarVenta);

module.exports = router;
