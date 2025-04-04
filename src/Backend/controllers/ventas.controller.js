const Venta = require('../models/ventas.model');

const sql = require('mssql');

class VentaController {

   // static async obtenerVentas(req, res) {
    //try {
      //  const ventas = await Venta.obtenerVentas();
        //res.status(200).json({ ventas });
    //} catch (error) {
        //res.status(500).json({ error: "Error al obtener las ventas" });
    //}
//}



    static async obtenerVentas(req, res) {
        try {
            const ventas = await Venta.obtenerVentas();
            res.status(200).json({ ventas });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las ventas" });
        }
    }
    static async obtenerDetalleVenta(req, res) {
        const { id } = req.params;
        
        console.log("ID recibido:", id); // Agregar para depuración
    
        if (!id) {
            return res.status(400).json({ error: "ID de venta requerido" });
        }
    
        try {
            const detalle = await Venta.obtenerDetalleVenta(id);
            console.log("Detalle obtenido:", detalle); // Agregar para depuración
    
            res.status(200).json(detalle);
        } catch (error) {
            console.error("Error al obtener el detalle de la venta:", error);
            res.status(500).json({ error: "Error al obtener el detalle de la venta" });
        }
    }
    


    static async registrarVenta(req, res) {
        const { tipoPago, total, productos } = req.body; // Productos es un array con { idProducto, cantidad, precio }

        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: "Debe agregar al menos un producto" });
        }

        try {
            const numeroDocumento = await Venta.generarNumeroDocumento();
            const idVenta = await Venta.crearVenta({ numeroDocumento, tipoPago, total });

            // Insertar productos en DetalleVenta y actualizar stock
            for (const item of productos) {
                await Venta.registrarDetalleVenta(idVenta, item.idProducto, item.cantidad, item.precio);
                await Venta.reducirStock(item.idProducto, item.cantidad);
            }

            res.status(201).json({ message: "Venta registrada exitosamente", idVenta });
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            res.status(500).json({ error: "Error al registrar la venta" });
        }
    }
}


module.exports = VentaController;
