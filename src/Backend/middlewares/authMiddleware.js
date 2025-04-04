const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
    }

    // Extraer el token si viene con prefijo Bearer
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) // Quitar 'Bearer '
        : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = verificarToken;