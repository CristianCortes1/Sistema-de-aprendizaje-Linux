package com.penguinpath.backend.controller;

import com.penguinpath.backend.model.Usuario;
import com.penguinpath.backend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para operaciones CRUD y funcionalidades relacionadas con usuarios.
 * 
 * Proporciona endpoints para gestionar usuarios, incluyendo operaciones básicas
 * de creación, lectura, actualización y eliminación, así como funcionalidades
 * específicas como el ranking de usuarios.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    /**
     * Servicio para operaciones relacionadas con usuarios.
     */
    private final UsuarioService usuarioService;

    /**
     * Constructor para inyección de dependencias.
     * 
     * @param usuarioService el servicio de usuario a inyectar
     */
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Obtiene una lista de todos los usuarios registrados en el sistema.
     * 
     * @return lista completa de usuarios
     */
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    /**
     * Obtiene un usuario específico por su ID.
     * 
     * @param id el identificador único del usuario
     * @return ResponseEntity con el usuario encontrado o 404 si no existe
     */
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Integer id) {
        Optional<Usuario> usuario = usuarioService.buscarPorId(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Crea un nuevo usuario en el sistema.
     * 
     * @param usuario objeto Usuario con los datos a guardar
     * @return el usuario creado con su ID generado
     */
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.guardar(usuario);
    }

    /**
     * Actualiza los datos de un usuario existente.
     * 
     * @param id el identificador del usuario a actualizar
     * @param usuario objeto con los nuevos datos del usuario
     * @return ResponseEntity con el usuario actualizado o 404 si no existe
     */
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Optional<Usuario> actualizado = usuarioService.actualizar(id, usuario);
        return actualizado.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Elimina un usuario del sistema.
     * 
     * @param id el identificador del usuario a eliminar
     * @return ResponseEntity con código 204 si se eliminó exitosamente o 404 si no existe
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        if (usuarioService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Obtiene el ranking de usuarios ordenados por experiencia.
     * 
     * Los usuarios se ordenan de mayor a menor experiencia para mostrar
     * el ranking de mejores jugadores en el sistema.
     * 
     * @return lista de usuarios ordenada por experiencia descendente
     */
    @GetMapping("/ranking")
    public List<Usuario> ranking() {
        return usuarioService.obtenerRanking();
    }
}
