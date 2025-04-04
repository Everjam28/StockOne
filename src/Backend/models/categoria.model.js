const sql = require('mssql');

class Categoria {
    static async obtenerCategorias() {
        try {
            const resultado = await sql.query('SELECT * FROM Categoria');
            return resultado.recordset;
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            throw error;
        }
    }

    static async obtenerCategoriaPorId(idCategoria) {
        try {
            const resultado = await sql.query`
                SELECT * FROM Categoria WHERE idCategoria = ${idCategoria}
            `;
    
            return resultado.recordset.length > 0 ? resultado.recordset[0] : null;
        } catch (error) {
            console.error('Error al obtener categoría por ID:', error);
            throw error;
        }
    }
    

    static async crearCategoria({ nombre }) {
        const resultado = await sql.query`
            INSERT INTO Categoria (nombre)
            VALUES (${nombre});
            SELECT SCOPE_IDENTITY() AS idCategoria;
        `;
        return resultado.recordset[0].idCategoria;
    }


    // categoria.model.js
static async actualizarCategoria(idCategoria, { nombre }) {
    try {
        const resultado = await sql.query`
            UPDATE Categoria
            SET nombre = ${nombre}
            WHERE idCategoria = ${idCategoria}
        `;
        return resultado.rowsAffected[0] > 0; // Devuelve si la actualización fue exitosa
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        throw error;
    }
}

    static async eliminarCategoria(idCategoria) {
        try {
            await sql.query`
                DELETE FROM Categoria WHERE idCategoria = ${idCategoria}
            `;
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            throw error;
        }
    }
}

module.exports = Categoria;
