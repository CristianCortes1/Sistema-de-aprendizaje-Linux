package com.penguinpath.backend.controller;

import com.penguinpath.backend.dto.RegistroRequest;
import com.penguinpath.backend.dto.LoginRequest;
import com.penguinpath.backend.model.Usuario;
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
    public Usuario registro(@RequestBody RegistroRequest req) {
        return service.registrar(req.username, req.correo, req.contraseña);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody LoginRequest req) {
        return service.login(req.username, req.contraseña);
    }
}
