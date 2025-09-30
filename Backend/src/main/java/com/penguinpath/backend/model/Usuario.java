package com.penguinpath.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

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
    private String password;

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

<<<<<<< HEAD
    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
=======
    public String getpassword() {
        return password;
    }

    public void setpassword(String password) {
        this.password = password;
>>>>>>> Frontend
    }

    public Integer getAvatar() {
        return avatar;
    }

    public void setAvatar(Integer avatar) {
        this.avatar = avatar;
    }

    public Integer getRacha() {
        return racha;
    }

    public void setRacha(Integer racha) {
        this.racha = racha;
    }

    public Integer getExperiencia() {
        return experiencia;
    }

    public void setExperiencia(Integer experiencia) {
        this.experiencia = experiencia;
    }

    public LocalDate getUltimaConexion() {
        return ultimaConexion;
    }

    public void setUltimaConexion(LocalDate ultimaConexion) {
        this.ultimaConexion = ultimaConexion;
    }
}