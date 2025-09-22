package com.penguinpath.App.persistence.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "comandos")
public class Comando {

    // Getters y setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;  // Ej: "ls", "pwd"

    @Column(nullable = false, length = 500)
    private String descripcion;  // Explicación del comando

    public Comando() {
    }

    public Comando(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

}
