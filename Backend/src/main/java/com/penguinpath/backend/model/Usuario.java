package com.penguinpath.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "usuarios", schema = "penguin_path")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario", nullable = false)
    private Integer id;

    @Column(name = "username", nullable = false, length = 25)
    private String username;

    @Column(name = "correo", nullable = false, length = 60)
    private String correo;

    @Column(name = "`contraseña`", nullable = false, length = 100)
    private String contraseña;

    @ColumnDefault("1")
    @Column(name = "avatar")
    private Integer avatar;

    @ColumnDefault("0")
    @Column(name = "racha")
    private Integer racha;

    @ColumnDefault("0")
    @Column(name = "experiencia")
    private Integer experiencia;

    @Column(name = "ultima_conexion")
    private LocalDate ultimaConexion;

}