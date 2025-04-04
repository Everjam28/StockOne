// usuario.controller.js
const sql = require('mssql');
const Usuario = require('../models/usuario.model'); // Asegúrate de que la ruta sea correcta

class UsuarioController {
    // Obtener todos los usuarios
    static async obtenerUsuarios(req, res) {
        try {
            const usuarios = await Usuario.obtenerUsuarios(); // Llama al modelo para obtener los usuarios
            if (!usuarios || usuarios.length === 0) {
                return res.status(404).json({ mensaje: 'No hay usuarios registrados' });
            }
            res.json({ usuarios }); // Responde con la lista de usuarios
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    }

    // Obtener usuario por ID
    static async obtenerUsuarioPorId(req, res) {
        try {
            const { id } = req.params;
            const idUsuario = parseInt(id);
            
            if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "ID de usuario inválido" });
            }
            
            const usuario = await Usuario.obtenerUsuarioPorId(idUsuario);
            
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            
            res.json({ usuario });
        } catch (error) {
            console.error("Error al obtener usuario por ID:", error);
            res.status(500).json({ 
                error: "Error interno al obtener el usuario", 
                details: error.message 
            });
        }
    }

    // Obtener usuario por correo
    static async obtenerUsuarioPorCorreo(req, res) {
        try {
            const { correo } = req.query; // Asumiendo que se pasa como query parameter
            
            if (!correo) {
                return res.status(400).json({ error: "Correo no proporcionado" });
            }
            
            const usuario = await Usuario.obtenerUsuarioPorCorreo(correo);
            
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            
            res.json({ usuario });
        } catch (error) {
            console.error("Error al obtener usuario por correo:", error);
            res.status(500).json({ 
                error: "Error interno al obtener el usuario", 
                details: error.message 
            });
        }
    }

    // Crear un usuario
    static async crearUsuario(req, res) {
        try {
            const { idUsuario, nombreCompleto, correo, clave, esActivo, idRol } = req.body;

            // Validar que el rol proporcionado exista en la base de datos
            const rol = await sql.query`SELECT * FROM Rol WHERE idRol = ${idRol}`;
            if (!rol.recordset.length) {
                return res.status(400).json({ error: 'Rol inválido' });
            }

            // Llamar al modelo para crear el usuario
            const nuevoUsuarioId = await Usuario.crearUsuario({ 
                idUsuario, 
                nombreCompleto, 
                correo, 
                clave, 
                esActivo, 
                idRol 
            });

            res.status(201).json({ 
                message: 'Usuario creado exitosamente', 
                idUsuario: nuevoUsuarioId 
            });

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(500).json({ 
                error: 'Error al crear el usuario', 
                details: error.message 
            });
        }
    }

    // Actualizar usuario
    static async actualizarUsuario(req, res) {
        try {
            const { id } = req.params; // ID desde la URL
            const { nombreCompleto, correo, clave, esActivo } = req.body; // Datos desde el cuerpo
    
            console.log("📌 ID recibido:", id);
            console.log("📌 Datos recibidos:", { nombreCompleto, correo, clave, esActivo });
    
            // Convertir ID a número
            const idUsuario = parseInt(id);
            if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "ID de usuario inválido" });
            }
    
            // Verificar si el usuario existe antes de actualizarlo
            const usuarioExistente = await Usuario.obtenerUsuarioPorId(idUsuario);
            if (!usuarioExistente) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
    
            // Llamar al modelo para actualizar el usuario
            await Usuario.actualizarUsuario(idUsuario, { 
                nombreCompleto, 
                correo, 
                clave, 
                esActivo 
            });
    
            res.json({ mensaje: "Usuario actualizado correctamente" });
    
        } catch (error) {
            console.error("❌ Error al actualizar usuario:", error);
            res.status(500).json({ 
                error: "Error interno al actualizar el usuario", 
                details: error.message 
            });
        }
    }

    // Eliminar usuario
    static async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            const idUsuario = parseInt(id);
            
            if (isNaN(idUsuario)) {
                return res.status(400).json({ error: "ID de usuario inválido" });
            }
            
            // Verificar si el usuario existe
            const usuario = await Usuario.obtenerUsuarioPorId(idUsuario);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            
            await Usuario.eliminarUsuario(idUsuario);
            res.json({ mensaje: "Usuario eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            res.status(500).json({ 
                error: "Error interno al eliminar el usuario",
                details: error.message
            });
        }
    }
}

module.exports = UsuarioController;