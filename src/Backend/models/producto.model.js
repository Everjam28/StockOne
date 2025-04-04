const sql = require('mssql');

class Producto {
    static async obtenerProductos() {
        try {
            const resultado = await sql.query(`
                SELECT * FROM Producto
            `);
            return resultado.recordset;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    static async obtenerProductoPorId(idProducto) {
        try {
            const resultado = await sql.query`
                SELECT * FROM Producto WHERE idProducto = ${idProducto}
            `;
            return resultado.recordset[0];
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    static async crearProducto({ nombre, descripcion, precio, stock, idCategoria }) {
        try {
            const pool = await sql.connect();
            const resultado = await pool.request()
                .input('nombre', sql.VarChar, nombre)
                .input('descripcion', sql.Text, descripcion)
                .input('precio', sql.Decimal, precio)
                .input('stock', sql.Int, stock)
                .input('idCategoria', sql.Int, idCategoria)
                .query(`
                    INSERT INTO Producto (nombre, descripcion, precio, stock, idCategoria)
                    OUTPUT INSERTED.idProducto
                    VALUES (@nombre, @descripcion, @precio, @stock, @idCategoria)
                `);
            return resultado.recordset[0]; // Retorna el nuevo producto creado
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        }
    }
    
    
    static async actualizarProducto(idProducto, { nombre, descripcion, precio, stock, idCategoria }) {
        try {
            const pool = await sql.connect();
            const resultado = await pool.request()
                .input('idProducto', sql.Int, idProducto)
                .input('nombre', sql.VarChar, nombre)
                .input('descripcion', sql.Text, descripcion)
                .input('precio', sql.Decimal, precio)
                .input('stock', sql.Int, stock)
                .input('idCategoria', sql.Int, idCategoria)
                .query(`
                    UPDATE Producto
                    SET nombre = @nombre, descripcion = @descripcion, precio = @precio, stock = @stock, idCategoria = @idCategoria
                    WHERE idProducto = @idProducto
                `);
            return resultado.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }
    
    static async eliminarProducto(idProducto) {
        try {
            const resultado = await sql.query`
                DELETE FROM Producto WHERE idProducto = ${idProducto}
            `;
            return resultado.rowsAffected[0] > 0;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

module.exports = Producto;
