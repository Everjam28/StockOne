const sql = require('mssql');

class Rol {
    static async obtenerRoles() {
        try {
            const resultado = await sql.query('SELECT * FROM Rol');
            return resultado.recordset;
        } catch (error) {
            console.error('Error al obtener roles:', error);
            throw error;
        }
    }

    static async obtenerRolPorId(idRol) {
        try {
            const resultado = await sql.query`
                SELECT * FROM Rol WHERE idRol = ${idRol}
            `;
            return resultado.recordset[0];
        } catch (error) {
            console.error('Error al obtener rol por ID:', error);
            throw error;
        }
    }

    static async crearRol({ nombre, descripcion }) {
        try {
            const resultado = await sql.query`
                INSERT INTO Rol (nombre, descripcion)
                VALUES (${nombre}, ${descripcion});
                SELECT SCOPE_IDENTITY() AS idRol;
            `;
            return resultado.recordset[0].idRol;
        } catch (error) {
            console.error('Error al crear rol:', error);
            throw error;
        }
    }

    static async actualizarRol(idRol, { nombre }) {
        try {
            const resultado = await sql.query`
                UPDATE Rol
                SET nombre = ${nombre}
                WHERE idRol = ${idRol}
            `;
            return resultado.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            throw error;
        }
    }
    static async eliminarRol(idRol) {
        try {
            const resultado = await sql.query`
                DELETE FROM Rol WHERE idRol = ${idRol}
            `;
            return resultado.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            throw error;
        }
    }
}

module.exports = Rol;

