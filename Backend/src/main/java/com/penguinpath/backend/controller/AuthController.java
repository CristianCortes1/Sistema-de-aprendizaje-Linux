package com.penguinpath.backend.controller;

import com.penguinpath.backend.dto.RegistroRequest;
import com.penguinpath.backend.dto.LoginRequest;
import com.penguinpath.backend.dto.UsuarioResponse;
import com.penguinpath.backend.model.Usuario;
import com.penguinpath.backend.security.JwtUtil;
import com.penguinpath.backend.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para manejar la autenticación de usuarios.
 * 
 * Proporciona endpoints para el registro y login de usuarios en el sistema.
 * Todos los endpoints devuelven un token JWT para la autenticación posterior.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    /**
     * Servicio para operaciones relacionadas con usuarios.
     */
    private final UsuarioService service;

    /**
     * Constructor para inyección de dependencias.
     * 
     * @param service el servicio de usuario a inyectar
     */
    public AuthController(UsuarioService service) {
        this.service = service;
    }

    /**
     * Endpoint para registrar un nuevo usuario en el sistema.
     * 
     * Crea un nuevo usuario con los datos proporcionados y genera un token JWT
     * para autenticación automática después del registro.
     * 
     * @param req objeto con los datos de registro (username, correo, password)
     * @return respuesta con los datos del usuario creado y el token JWT
     */
    @PostMapping("/registro")
    public UsuarioResponse registro(@RequestBody RegistroRequest req) {
        Usuario usuario = service.registrar(req.username, req.correo, req.password);
        String token = JwtUtil.generarToken(usuario.getUsername());
        return UsuarioResponse.from(usuario, token);
    }

    /**
     * Endpoint para autenticar un usuario existente.
     * 
     * Valida las credenciales del usuario y genera un token JWT
     * para mantener la sesión autenticada.
     * 
     * @param req objeto con las credenciales de login (username, password)
     * @return respuesta con los datos del usuario autenticado y el token JWT
     */
    @PostMapping("/login")
    public UsuarioResponse login(@RequestBody LoginRequest req) {
        Usuario usuario = service.login(req.username, req.password);
        String token = JwtUtil.generarToken(usuario.getUsername());
        return UsuarioResponse.from(usuario, token);
    }
}
