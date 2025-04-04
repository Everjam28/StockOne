export interface User {
    idUsuario: number;
    nombreCompleto: string;
    correo: string;
    idRol: number;
    rol: string; // Antes era rolDescripcion, ahora debe coincidir con el backend
    clave: string;
    esActivo: boolean;
}
