package com.penguinpath.App.persistence.repository;

import com.penguinpath.App.persistence.model.Comando;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComandoRepository extends JpaRepository<Comando, Long> {
    Comando findByNombre(String nombre);
}

