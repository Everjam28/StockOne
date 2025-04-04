const sql = require('mssql');

class Venta {

    static async obtenerVentas() {
        try {
            const resultado = await sql.query`
                SELECT v.idVenta, v.numeroDocumento, v.tipoPago, v.total, v.fechaRegistro
                FROM Venta v
                GROUP BY v.idVenta, v.numeroDocumento, v.tipoPago, v.total, v.fechaRegistro
                ORDER BY v.fechaRegistro DESC;
            `;
    
            return resultado.recordset;
        } catch (error) {
            console.error("Error al obtener las ventas:", error);
            throw error;
        }
    }
    
    
    static async obtenerDetalleVenta(idVenta) {
        try {
            const resultado = await sql.query`
                SELECT dv.idDetalleVenta, dv.idProducto, p.nombre AS nombreProducto, 
                       dv.cantidad, dv.precio, dv.total
                FROM DetalleVenta dv
                INNER JOIN Producto p ON dv.idProducto = p.idProducto
                WHERE dv.idVenta = ${idVenta};
            `;
    
            return resultado.recordset;
        } catch (error) {
            console.error("Error al obtener el detalle de la venta:", error);
            throw error;
        }
    }
    

    static async generarNumeroDocumento() {
        try {
            const resultado = await sql.query`
                SELECT MAX(numeroDocumento) AS ultimoNumero FROM Venta
            `;
            let nuevoNumero = 1;
            if (resultado.recordset[0].ultimoNumero) {
                nuevoNumero = parseInt(resultado.recordset[0].ultimoNumero) + 1;
            }
            return nuevoNumero.toString().padStart(8, '0');
        } catch (error) {
            console.error("Error al generar número de documento:", error);
            throw error;
        }
    }
    static async crearVenta({ numeroDocumento, tipoPago, total }) {
        try {
            const resultado = await sql.query`
                INSERT INTO Venta (numeroDocumento, tipoPago, total, fechaRegistro)
                VALUES (${numeroDocumento}, ${tipoPago}, ${total}, GETDATE());
                SELECT SCOPE_IDENTITY() AS idVentas;
            `;
            return resultado.recordset[0].idVentas;
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            throw error;
        }
    }

    static async registrarDetalleVenta(idVenta, idProducto, cantidad, precio) {
        try {
            await sql.query`
                INSERT INTO DetalleVenta (idVenta, idProducto, cantidad, precio, total)
                VALUES (${idVenta}, ${idProducto}, ${cantidad}, ${precio}, ${cantidad * precio});
            `;
        } catch (error) {
            console.error("Error al registrar el detalle de venta:", error);
            throw error;
        }
    }

    static async reducirStock(idProducto, cantidad) {
        try {
            await sql.query`
                UPDATE Producto SET stock = stock - ${cantidad} WHERE idProducto = ${idProducto};
            `;
        } catch (error) {
            console.error("Error al reducir el stock:", error);
            throw error;
        }
    }
}


module.exports = Venta;
