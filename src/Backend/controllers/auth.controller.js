const { sql } = require('../config/db');
const jwt = require('jsonwebtoken');

// Función para iniciar sesión
const iniciarSesion = async (req, res) => {
    const { correo, clave } = req.body;

    try {
        // Conectar a la base de datos
        const pool = await sql.connect();

        // Buscar el usuario por correo y clave
        const result = await pool.request()
            .input("correo", sql.VarChar, correo)
            .input("clave", sql.VarChar, clave)
            .query(`
                SELECT u.idUsuario, u.nombreCompleto, u.correo, u.idRol, r.nombre as nombreRol, 
                       u.esActivo, u.primeraVez
                FROM Usuario u
                INNER JOIN Rol r ON u.idRol = r.idRol
                WHERE u.correo = @correo AND u.clave = @clave
            `);

        // Verificar si se encontró un usuario
        if (result.recordset.length === 0) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        const usuario = result.recordset[0];

        // Verificar si el usuario está activo
        if (!usuario.esActivo) {
            return res.status(403).json({ error: "Usuario inactivo. Contacte al administrador." });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                idUsuario: usuario.idUsuario,
                correo: usuario.correo,
                idRol: usuario.idRol,
                nombreRol: usuario.nombreRol
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Responder con el token y la información del usuario
        res.json({
            token,
            usuario: {
                idUsuario: usuario.idUsuario,
                nombreCompleto: usuario.nombreCompleto,
                correo: usuario.correo,
                idRol: usuario.idRol,
                nombreRol: usuario.nombreRol,
                primeraVez: usuario.primeraVez
            },
            primeraVez: usuario.primeraVez === 1 // Enviar explícitamente si es primera vez
        });

    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión." });
    }
};

// Función para cambiar clave y cédula en el primer inicio de sesión
const cambiarClavePrimeraVez = async (req, res) => {
    const { nuevaCedula, nuevaClave, correo } = req.body;

    try {
        // Conectar a la base de datos
        const pool = await sql.connect();

        // Verificar si el usuario existe y si primeraVez es 1
        const result = await pool.request()
            .input("correo", sql.VarChar, correo)
            .query(`
                SELECT idUsuario, primeraVez 
                FROM Usuario 
                WHERE correo = @correo
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const usuario = result.recordset[0];

        if (usuario.primeraVez === 0) {
            return res.status(400).json({ error: "El usuario ya ha cambiado su contraseña previamente." });
        }

        // Actualizar cédula y clave del usuario
        await pool.request()
            .input("nuevaCedula", sql.VarChar, nuevaCedula)
            .input("nuevaClave", sql.VarChar, nuevaClave)
            .input("correo", sql.VarChar, correo)
            .query(`
                UPDATE Usuario 
                SET idUsuario = @nuevaCedula, clave = @nuevaClave, primeraVez = 0
                WHERE correo = @correo AND primeraVez = 1
            `);

        res.status(200).json({ 
            success: true,
            mensaje: "Contraseña y cédula actualizadas correctamente." 
        });

    } catch (error) {
        console.error("❌ Error al actualizar clave y cédula:", error);
        res.status(500).json({ 
            success: false,
            error: "Error al actualizar clave y cédula." 
        });
    }
};

module.exports = { iniciarSesion, cambiarClavePrimeraVez };