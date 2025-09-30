package com.penguinpath.backend.controller;

import com.penguinpath.backend.dto.RegistroRequest;
import com.penguinpath.backend.dto.LoginRequest;
import com.penguinpath.backend.dto.UsuarioResponse;
import com.penguinpath.backend.model.Usuario;
import com.penguinpath.backend.security.JwtUtil;
import com.penguinpath.backend.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioService service;

    public AuthController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping("/registro")
    public UsuarioResponse registro(@RequestBody RegistroRequest req) {
        Usuario usuario = service.registrar(req.username, req.correo, req.password);
        String token = JwtUtil.generarToken(usuario.getUsername());
        return UsuarioResponse.from(usuario, token);
    }

    @PostMapping("/login")
    public UsuarioResponse login(@RequestBody LoginRequest req) {
        Usuario usuario = service.login(req.username, req.password);
        String token = JwtUtil.generarToken(usuario.getUsername());
        return UsuarioResponse.from(usuario, token);
    }
}
