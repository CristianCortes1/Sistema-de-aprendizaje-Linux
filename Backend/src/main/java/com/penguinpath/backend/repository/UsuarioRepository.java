package com.penguinpath.backend.repository;

import com.penguinpath.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones de acceso a datos de la entidad Usuario.
 * 
 * Extiende JpaRepository para proporcionar operaciones CRUD básicas
 * y define métodos adicionales para consultas específicas de usuarios.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su dirección de correo electrónico.
     * 
     * @param correo la dirección de correo electrónico a buscar
     * @return Optional conteniendo el usuario si existe, vacío en caso contrario
     */
    Optional<Usuario> findByCorreo(String correo);

    /**
     * Busca un usuario por su nombre de usuario.
     * 
     * @param username el nombre de usuario a buscar
     * @return Optional conteniendo el usuario si existe, vacío en caso contrario
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Obtiene todos los usuarios ordenados por experiencia de forma descendente.
     * 
     * Este método se utiliza para generar el ranking de usuarios en el sistema,
     * mostrando primero a los usuarios con mayor experiencia.
     * 
     * @return lista de usuarios ordenada por experiencia descendente
     */
    List<Usuario> findAllByOrderByExperienciaDesc();
}
