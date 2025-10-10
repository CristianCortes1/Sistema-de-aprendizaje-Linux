package com.penguinpath.backend.dto;

/**
 * Data Transfer Object (DTO) para las solicitudes de inicio de sesión.
 * 
 * Contiene las credenciales necesarias para autenticar un usuario en el sistema.
 * Se utiliza como objeto de entrada en el endpoint de login.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
public class LoginRequest {
    
    /**
     * Nombre de usuario para la autenticación.
     * Puede ser el username o correo electrónico según la implementación.
     */
    public String username;
    
    /**
     * Contraseña del usuario en texto plano.
     * Será validada contra la contraseña encriptada almacenada en la base de datos.
     */
    public String password;
}
