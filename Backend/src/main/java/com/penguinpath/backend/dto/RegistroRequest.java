package com.penguinpath.backend.dto;

/**
 * Data Transfer Object (DTO) para las solicitudes de registro de nuevos usuarios.
 * 
 * Contiene toda la información necesaria para crear una nueva cuenta de usuario
 * en el sistema. Se utiliza como objeto de entrada en el endpoint de registro.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
public class RegistroRequest {
    
    /**
     * Nombre de usuario único que identificará al usuario en el sistema.
     * Debe ser único en toda la base de datos.
     */
    public String username;
    
    /**
     * Dirección de correo electrónico del usuario.
     * Se utiliza para comunicaciones y puede servir como método de login alternativo.
     * Debe ser único en toda la base de datos.
     */
    public String correo;
    
    /**
     * Contraseña del usuario en texto plano.
     * Será encriptada antes de almacenarse en la base de datos.
     */
    public String password;
}
