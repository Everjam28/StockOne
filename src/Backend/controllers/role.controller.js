const Rol = require('../models/role.model');

const roleController = {
    obtenerRoles: async (req, res) => {
        try {
            const roles = await Rol.obtenerRoles();
            res.json(roles);
        } catch (error) {
            console.error('Error en controlador obtenerRoles:', error);
            res.status(500).json({ error: 'Error al obtener roles' });
        }
    },

    obtenerRolPorId: async (req, res) => {
        try {
            const idRol = req.params.id;
            const rol = await Rol.obtenerRolPorId(idRol);
            
            if (!rol) {
                return res.status(404).json({ mensaje: 'Rol no encontrado' });
            }
            
            res.json(rol);
        } catch (error) {
            console.error('Error en controlador obtenerRolPorId:', error);
            res.status(500).json({ error: 'Error al obtener rol por ID' });
        }
    },

    crearRol: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            
            if (!nombre) {
                return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
            }
            
            const idRol = await Rol.crearRol({ nombre, descripcion });
            res.status(201).json({ idRol, mensaje: 'Rol creado exitosamente' });
        } catch (error) {
            console.error('Error en controlador crearRol:', error);
            res.status(500).json({ error: 'Error al crear rol' });
        }
    },

    actualizarRol: async (req, res) => {
        try {
            const idRol = req.params.id;
            const { nombre } = req.body;
            
            if (!nombre) {
                return res.status(400).json({ error: 'El nombre del rol es obligatorio' });
            }
            
            const resultado = await Rol.actualizarRol(idRol, { nombre });
            
            if (!resultado) {
                return res.status(404).json({ mensaje: 'Rol no encontrado o no modificado' });
            }
            
            res.json({ mensaje: 'Rol actualizado exitosamente' });
        } catch (error) {
            console.error('Error en controlador actualizarRol:', error);
            res.status(500).json({ error: 'Error al actualizar rol' });
        }
    },

    eliminarRol: async (req, res) => {
        try {
            const idRol = req.params.id;
            const resultado = await Rol.eliminarRol(idRol);
            
            if (!resultado) {
                return res.status(404).json({ mensaje: 'Rol no encontrado' });
            }
            
            res.json({ mensaje: 'Rol eliminado exitosamente' });
        } catch (error) {
            console.error('Error en controlador eliminarRol:', error);
            res.status(500).json({ error: 'Error al eliminar rol' });
        }
    }
};

module.exports = roleController;