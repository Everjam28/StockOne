require('dotenv').config();
const sql = require('mssql');

// Configuración de la base de datos
const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false, // No encriptar la conexión
        trustServerCertificate: true // Permitir certificados autofirmados
    }
};

// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('✅ Conexión a la base de datos establecida correctamente');

        // Verificar si ya existe un usuario administrador
        const result = await sql.query("SELECT COUNT(*) AS count FROM Usuario WHERE idRol = 1");
        if (result.recordset[0].count === 0) {
            console.log("⚠️ No se encontró un usuario administrador. Creando uno...");

            await sql.query(`
                INSERT INTO Usuario (idUsuario, nombreCompleto, correo, idRol, clave, esActivo, fechaRegistro, primeraVez)
                VALUES ('9999999999', 'Administrador', 'admin@email.com', 1, 'admin', 1, GETDATE(), 1)
            `);

            console.log("✅ Usuario administrador creado con éxito.");
        } else {
            console.log("✅ Ya existe un usuario administrador.");
        }

    } catch (err) {
        console.error('❌ Error al conectar a la base de datos:', err);
    }
};


module.exports = { connectDB, sql };
