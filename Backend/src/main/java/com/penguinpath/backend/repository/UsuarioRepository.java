package com.penguinpath.backend.repository;

import com.penguinpath.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por correo
    Optional<Usuario> findByCorreo(String correo);

    // Buscar usuario por username
    Optional<Usuario> findByUsername(String username);

    // Ranking: listar usuarios ordenados por experiencia descendente
    List<Usuario> findAllByOrderByExperienciaDesc();
}
