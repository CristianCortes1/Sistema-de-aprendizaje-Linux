package com.penguinpath.App.persistence.repository;

import com.penguinpath.App.persistence.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Usuario, Long> {
}
