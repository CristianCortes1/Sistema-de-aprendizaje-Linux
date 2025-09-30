package com.penguinpath.backend.service;

import com.penguinpath.backend.model.Usuario;
import com.penguinpath.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder encoder) {
        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
    }

    public Usuario registrar(String username, String correo, String password) {
        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setCorreo(correo);
        usuario.setPassword(encoder.encode(password));
        usuario.setRacha(0);
        usuario.setExperiencia(0);
        usuario.setAvatar(1);
        usuario.setUltimaConexion(LocalDate.now());
        return usuarioRepository.save(usuario);
    }

    public Usuario login(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!encoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("password incorrecta");
        } else {
            if (usuario.getUltimaConexion() == null || usuario.getUltimaConexion().isBefore(LocalDate.now())) {
                usuario.setUltimaConexion(LocalDate.now());
                usuario.setRacha(usuario.getRacha() + 1);
                usuarioRepository.save(usuario);
                // si no se conecta en un dia quitar racha
            } else {
                usuario.setRacha(0);
                usuario.setUltimaConexion(LocalDate.now());
                usuarioRepository.save(usuario);
            }
        }
        return usuario;
    }


    // ==============================
    // Crear o actualizar usuarios
    // ==============================
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // ==============================
    // Listar todos los usuarios
    // ==============================
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // ==============================
    // Buscar usuario por ID
    // ==============================
    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(Long.valueOf(id));
    }

    // ==============================
    // Buscar usuario por username
    // ==============================
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // ==============================
    // Buscar usuario por correo
    // ==============================
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    // ==============================
    // Actualizar usuario
    // ==============================
    public Optional<Usuario> actualizar(Integer id, Usuario datos) {
        return usuarioRepository.findById(Long.valueOf(id)).map(usuario -> {
            usuario.setUsername(datos.getUsername());
            usuario.setCorreo(datos.getCorreo());
            usuario.setPassword(datos.getPassword());
            usuario.setAvatar(datos.getAvatar());
            usuario.setRacha(datos.getRacha());
            usuario.setExperiencia(datos.getExperiencia());
            return usuarioRepository.save(usuario);
        });
    }

    // ==============================
    // Eliminar usuario
    // ==============================
    public boolean eliminar(Integer id) {
        if (usuarioRepository.existsById(Long.valueOf(id))) {
            usuarioRepository.deleteById(Long.valueOf(id));
            return true;
        }
        return false;
    }

    // ==============================
    // Ranking de usuarios por experiencia
    // ==============================
    public List<Usuario> obtenerRanking() {
        return usuarioRepository.findAllByOrderByExperienciaDesc();
    }
}
