package com.penguinpath.backend.dto;

import com.penguinpath.backend.model.Usuario;

/**
 * Data Transfer Object (DTO) para las respuestas que contienen información de usuario.
 * 
 * Este record representa la información de un usuario que se envía al cliente,
 * excluyendo datos sensibles como la contraseña e incluyendo el token de autenticación.
 * Se utiliza como respuesta en los endpoints de autenticación y consulta de usuarios.
 * 
 * @param id identificador único del usuario
 * @param username nombre de usuario
 * @param correo dirección de correo electrónico
 * @param racha días consecutivos de actividad
 * @param experiencia puntos de experiencia acumulados
 * @param avatar identificador del avatar seleccionado
 * @param token token JWT para autenticación
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
public record UsuarioResponse(
        int id,
        String username,
        String correo,
        int racha,
        int experiencia,
        int avatar,
        String token
) {
    /**
     * Método factory para crear una instancia de UsuarioResponse a partir de un Usuario y token.
     * 
     * Convierte una entidad Usuario en un DTO seguro para enviar al cliente,
     * excluyendo información sensible como la contraseña y agregando el token de autenticación.
     * 
     * @param usuario la entidad Usuario desde la cual crear la respuesta
     * @param token el token JWT generado para la autenticación
     * @return una nueva instancia de UsuarioResponse con los datos del usuario y el token
     */
    public static UsuarioResponse from(Usuario usuario, String token) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getCorreo(),
                usuario.getRacha(),
                usuario.getExperiencia(),
                usuario.getAvatar(),
                token
        );
    }
}
