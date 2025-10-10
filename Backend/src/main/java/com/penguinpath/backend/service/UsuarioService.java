package com.penguinpath.backend.service;

import com.penguinpath.backend.model.Usuario;
import com.penguinpath.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Servicio que maneja la lógica de negocio relacionada con usuarios.
 * 
 * Proporciona métodos para operaciones CRUD, autenticación, registro
 * y funcionalidades específicas como el manejo de rachas y experiencia.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@Service
public class UsuarioService {

    /**
     * Repositorio para operaciones de acceso a datos de usuarios.
     */
    private final UsuarioRepository usuarioRepository;
    
    /**
     * Encoder para encriptar y validar contraseñas.
     */
    private final PasswordEncoder encoder;

    /**
     * Constructor para inyección de dependencias.
     * 
     * @param usuarioRepository repositorio de usuarios
     * @param encoder encoder para contraseñas
     */
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder encoder) {
        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * Crea un nuevo usuario con los datos proporcionados, encripta la contraseña
     * e inicializa los valores por defecto (racha: 0, experiencia: 0, avatar: 1).
     * 
     * @param username nombre de usuario único
     * @param correo dirección de correo electrónico única
     * @param password contraseña en texto plano (será encriptada)
     * @return el usuario registrado con su ID generado
     */
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

    /**
     * Autentica un usuario y maneja la lógica de rachas.
     * 
     * Valida las credenciales del usuario y actualiza su racha según su última conexión:
     * - Si se conecta el día siguiente, incrementa la racha
     * - Si hay una brecha en las conexiones, reinicia la racha a 0
     * 
     * @param username nombre de usuario para autenticar
     * @param password contraseña en texto plano
     * @return el usuario autenticado con datos actualizados
     * @throws RuntimeException si el usuario no existe o la contraseña es incorrecta
     */
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


    /**
     * Guarda un usuario en la base de datos.
     * 
     * @param usuario el usuario a guardar
     * @return el usuario guardado
     */
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    /**
     * Obtiene una lista de todos los usuarios registrados.
     * 
     * @return lista completa de usuarios
     */
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Busca un usuario por su ID.
     * 
     * @param id el identificador del usuario
     * @return Optional conteniendo el usuario si existe, vacío en caso contrario
     */
    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(Long.valueOf(id));
    }

    /**
     * Busca un usuario por su nombre de usuario.
     * 
     * @param username el nombre de usuario a buscar
     * @return Optional conteniendo el usuario si existe, vacío en caso contrario
     */
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    /**
     * Busca un usuario por su correo electrónico.
     * 
     * @param correo la dirección de correo a buscar
     * @return Optional conteniendo el usuario si existe, vacío en caso contrario
     */
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    /**
     * Actualiza los datos de un usuario existente.
     * 
     * @param id el identificador del usuario a actualizar
     * @param datos objeto con los nuevos datos del usuario
     * @return Optional conteniendo el usuario actualizado si existe, vacío en caso contrario
     */
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

    /**
     * Elimina un usuario del sistema.
     * 
     * @param id el identificador del usuario a eliminar
     * @return true si el usuario fue eliminado exitosamente, false si no existe
     */
    public boolean eliminar(Integer id) {
        if (usuarioRepository.existsById(Long.valueOf(id))) {
            usuarioRepository.deleteById(Long.valueOf(id));
            return true;
        }
        return false;
    }

    /**
     * Obtiene el ranking de usuarios ordenados por experiencia.
     * 
     * Retorna una lista de todos los usuarios ordenados de mayor a menor
     * experiencia para mostrar el ranking del sistema.
     * 
     * @return lista de usuarios ordenada por experiencia descendente
     */
    public List<Usuario> obtenerRanking() {
        return usuarioRepository.findAllByOrderByExperienciaDesc();
    }
}
