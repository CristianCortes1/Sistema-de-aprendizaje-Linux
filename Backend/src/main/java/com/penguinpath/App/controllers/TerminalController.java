package com.penguinpath.App.controllers;
import com.penguinpath.App.persistence.model.Comando;
import com.penguinpath.App.persistence.repository.ComandoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/terminal")
@CrossOrigin(origins = "http://localhost:5173")// permite peticiones desde tu front
public class TerminalController {

    private final ComandoRepository comandoRepository;

    public TerminalController(ComandoRepository comandoRepository) {
        this.comandoRepository = comandoRepository;
    }

    // POST: ejecutar un comando
    @PostMapping("/ejecutar")
    public ResponseEntity<?> ejecutar(@RequestBody Map<String, String> body) {
        String comandoIngresado = body.get("input");

        Comando comando = comandoRepository.findByNombre(comandoIngresado);

        if (comando != null) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "mensaje", "✅ Correcto: " + comando.getDescripcion()
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "mensaje", "❌ Incorrecto. Intenta de nuevo."
            ));
        }
    }

    // GET: listar todos los comandos
    @GetMapping("/comandos")
    public ResponseEntity<?> listarComandos() {
        return ResponseEntity.ok(comandoRepository.findAll());
    }
}

