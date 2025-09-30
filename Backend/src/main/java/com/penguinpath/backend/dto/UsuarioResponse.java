package com.penguinpath.backend.dto;

import com.penguinpath.backend.model.Usuario;

public record UsuarioResponse(
        int id,
        String username,
        String correo,
        int racha,
        int experiencia,
        int avatar,
        String token
) {
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
