require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const roleRoutes = require('./routes/role.routes'); 
const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');
const categoriaRoutes= require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');
const ventasRoutes = require('./routes/ventas.routes') // <-- Agregar esta línea

// ...

const app = express();
const port = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middleware para procesar JSON
app.use(express.json());

// Habilitar CORS
app.use(cors());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/categoria',categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventasRoutes);

app.get('/', (req, res) => {
    res.send('Servidor en ejecución...');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
