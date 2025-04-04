const sql = require('mssql');


class Usuario {
    static async obtenerUsuarios() {
        try {
            const resultado = await sql.query(`
                SELECT u.*, r.nombre AS rol
                FROM Usuario u
                JOIN Rol r ON u.idRol = r.idRol
            `);
            return resultado.recordset;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    }

    static async obtenerUsuarioPorId(idUsuario) {
        try {
            const resultado = await sql.query`
                SELECT u.*, r.nombre AS rol
                FROM Usuario u
                JOIN Rol r ON u.idRol = r.idRol
                WHERE u.idUsuario = ${idUsuario}
            `;
            return resultado.recordset[0];
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            throw error;
        }
    }

    static async obtenerUsuarioPorCorreo(correo) {
        try {
            const resultado = await sql.query`
                SELECT u.idUsuario, u.nombreCompleto, u.correo, u.clave, r.nombre AS rol
                FROM Usuario u
                JOIN Rol r ON u.idRol = r.idRol
                WHERE u.correo = ${correo}
            `;
    
            return resultado.recordset[0]; // Devuelve el usuario con rol
        } catch (error) {
            console.error('Error al obtener usuario por correo:', error);
            throw error;
        }
    }

// backend/models/usuario.model.js
static async crearUsuario({ idUsuario, nombreCompleto, correo, clave, esActivo, idRol }) {
    try {
        const resultado = await sql.query`
            INSERT INTO Usuario (idUsuario, nombreCompleto, correo, clave, esActivo, idRol, fechaRegistro)
            VALUES (${idUsuario}, ${nombreCompleto}, ${correo}, ${clave}, ${esActivo}, ${idRol}, GETDATE());
        `;
        return idUsuario;  // Como es la cédula, se devuelve directamente
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

static async actualizarUsuario(idUsuario, { nombreCompleto, correo, clave, esActivo }) {
    try {
        const request = new sql.Request();
        request.input('idUsuario', sql.Int, idUsuario);
        request.input('nombreCompleto', sql.NVarChar, nombreCompleto);
        request.input('correo', sql.NVarChar, correo);
        request.input('esActivo', sql.Bit, esActivo);

        let query = `
            UPDATE Usuario
            SET nombreCompleto = @nombreCompleto,
                correo = @correo,
                esActivo = @esActivo
        `;

        if (clave) {
            request.input('clave', sql.NVarChar, clave);
            query += `, clave = @clave `;
        }

        query += ` WHERE idUsuario = @idUsuario`;

        console.log("🔄 Ejecutando consulta UPDATE:", query);

        await request.query(query);
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        throw error; // Lanzamos el error para que el controlador lo capture
    }
}



    static async eliminarUsuario(idUsuario) {
        try {
            await sql.query`
                DELETE FROM Usuario WHERE idUsuario = ${idUsuario}
            `;
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    }
}

module.exports = Usuario;
