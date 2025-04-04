const Producto = require('../models/producto.model');

class ProductoController {
    static async obtenerProductos(req, res) {
        try {
            const productos = await Producto.obtenerProductos();
            res.json({ productos });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    }

    static async obtenerProductoPorId(req, res) {
        const { id } = req.params;
        try {
            const producto = await Producto.obtenerProductoPorId(id);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ producto });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener producto' });
        }
    }

    static async crearProducto(req, res) {
        const { nombre, descripcion, precio, stock, idCategoria } = req.body;
    
        try {
            // No necesitas pasar idProducto, SQL Server lo generará automáticamente
            const resultado = await Producto.crearProducto({ nombre, descripcion, precio, stock, idCategoria });
    
            if (!resultado) {
                return res.status(400).json({ error: 'No se pudo crear el producto' });
            }
    
            res.status(201).json({ message: 'Producto creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear producto' });
        }
    }
    

    static async actualizarProducto(req, res) {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, idCategoria } = req.body;
        try {
            const resultado = await Producto.actualizarProducto(id, { nombre, descripcion, precio, stock, idCategoria });
            if (!resultado) {
                return res.status(404).json({ error: 'Producto no encontrado o no modificado' });
            }
            res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar producto' });
        }
    }

    static async eliminarProducto(req, res) {
        const { id } = req.params;
        try {
            const resultado = await Producto.eliminarProducto(id);
            if (!resultado) {
                return res.status(404).json({ error: 'Producto no encontrado o no eliminado' });
            }
            res.json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar producto' });
        }
    }
}

module.exports = ProductoController;
