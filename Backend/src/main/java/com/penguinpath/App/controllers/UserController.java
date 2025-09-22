package com.penguinpath.App.controllers;
import com.penguinpath.App.persistence.model.Usuario;
import com.penguinpath.App.persistence.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Obtener todos los usuarios en formato JSON
    @GetMapping
    public List<Usuario> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtener un usuario por ID
    @GetMapping("/{id}")
    public Usuario getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Crear un nuevo usuario
    @PostMapping
    public Usuario createUser(@RequestBody Usuario usuario) {
        return userRepository.save(usuario);
    }

    // Actualizar un usuario existente
    @PutMapping("/{id}")
    public Usuario updateUser(@PathVariable Long id, @RequestBody Usuario usuarioDetails) {
        return userRepository.findById(id).map(usuario -> {
            usuario.setUsername(usuarioDetails.getUsername());
            usuario.setEmail(usuarioDetails.getEmail());
            usuario.setPassword(usuarioDetails.getPassword());
            return userRepository.save(usuario);
        }).orElse(null);
    }

    // Eliminar un usuario
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}
