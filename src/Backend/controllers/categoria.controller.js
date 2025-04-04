const Categoria = require('../models/categoria.model');

class CategoriaController {
    static async obtenerCategorias(req, res) {
        try {
            const categorias = await Categoria.obtenerCategorias();
            res.json({ categorias });
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            res.status(500).json({ error: 'Error al obtener las categorías' });
        }
    }

    static async obtenerCategoriaPorId(req, res) {
        try {
            const { id } = req.params;
            const categoria = await Categoria.obtenerCategoriaPorId(id);
            
            if (!categoria) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada' });
            }
    
            res.json({ categoria });
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            res.status(500).json({ mensaje: 'Error al obtener categoría' });
        }
    }
    

    static async crearCategoria(req, res) {
        try {
            const { nombre } = req.body;
            const idCategoria = await Categoria.crearCategoria({ nombre });
            res.status(201).json({ message: 'Categoría creada exitosamente', idCategoria });
        } catch (error) {
            res.status(400).json({ error: 'Error al crear la categoría' });
        }
    }

    static async actualizarCategoria(req, res) {
        try {
            const idCategoria = req.params.id;
            const { nombre } = req.body;
            
            if (!nombre) {
                return res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
            }
            
            const resultado = await Categoria.actualizarCategoria(idCategoria, { nombre });
            
            if (!resultado) {
                return res.status(404).json({ mensaje: 'Categoría no encontrada o no modificada' });
            }
            
            res.json({ mensaje: 'Categoría actualizada exitosamente' });
        } catch (error) {
            console.error('Error en controlador actualizarCategoria:', error);
            res.status(500).json({ error: 'Error al actualizar categoría' });
        }
    }
    
    static async eliminarCategoria(req, res) {
        try {
            const { id } = req.params;
            await Categoria.eliminarCategoria(id);
            res.status(200).json({ message: 'Categoría eliminada exitosamente' });
        } catch (error) {
            res.status(400).json({ error: 'Error al eliminar la categoría' });
        }
    }
}

module.exports = CategoriaController;
