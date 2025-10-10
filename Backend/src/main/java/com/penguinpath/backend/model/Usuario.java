package com.penguinpath.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

/**
 * Entidad que representa un usuario en el sistema de aprendizaje de Linux PenguinPath.
 * Esta clase mapea a la tabla 'usuarios' en el esquema 'penguin_path' de la base de datos.
 * 
 * Contiene información básica del usuario como credenciales, progreso y configuración.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@Entity
@Table(name = "usuarios", schema = "penguin_path")
public class Usuario {
    /**
     * Identificador único del usuario en la base de datos.
     * Se genera automáticamente como clave primaria.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario", nullable = false)
    private Integer id;

    /**
     * Nombre de usuario único para identificación en el sistema.
     * Máximo 25 caracteres.
     */
    @Column(name = "username", nullable = false, length = 25)
    private String username;

    /**
     * Dirección de correo electrónico del usuario.
     * Utilizada para comunicaciones y recuperación de cuenta.
     * Máximo 60 caracteres.
     */
    @Column(name = "correo", nullable = false, length = 60)
    private String correo;

    /**
     * Campo de contraseña del usuario.
     * Se almacena de forma encriptada por motivos de seguridad.
     */
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    /**
     * Identificador del avatar seleccionado por el usuario.
     * Valor por defecto: 1
     */
    @ColumnDefault("1")
    @Column(name = "avatar")
    private Integer avatar;

    /**
     * Contador de días consecutivos de actividad del usuario.
     * Valor por defecto: 0
     */
    @ColumnDefault("0")
    @Column(name = "racha")
    private Integer racha;

    /**
     * Puntos de experiencia acumulados por el usuario.
     * Valor por defecto: 0
     */
    @ColumnDefault("0")
    @Column(name = "experiencia")
    private Integer experiencia;

    /**
     * Fecha de la última conexión del usuario al sistema.
     * Utilizada para calcular rachas y estadísticas de actividad.
     */
    @Column(name = "ultima_conexion")
    private LocalDate ultimaConexion;

    /**
     * Obtiene el identificador único del usuario.
     * 
     * @return el ID del usuario
     */
    public Integer getId() {
        return id;
    }

    /**
     * Establece el identificador único del usuario.
     * 
     * @param id el ID a asignar al usuario
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * Obtiene el nombre de usuario.
     * 
     * @return el nombre de usuario
     */
    public String getUsername() {
        return username;
    }

    /**
     * Establece el nombre de usuario.
     * 
     * @param username el nombre de usuario a asignar
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * Obtiene el correo electrónico del usuario.
     * 
     * @return la dirección de correo electrónico
     */
    public String getCorreo() {
        return correo;
    }

    /**
     * Establece el correo electrónico del usuario.
     * 
     * @param correo la dirección de correo electrónico a asignar
     */
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    /**
     * Obtiene la contraseña encriptada del usuario.
     * 
     * @return la contraseña encriptada
     */
    public String getPassword() {
        return password;
    }

    /**
     * Establece la contraseña del usuario.
     * 
     * @param password la contraseña a asignar (debe estar encriptada)
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Obtiene el identificador del avatar del usuario.
     * 
     * @return el ID del avatar seleccionado
     */
    public Integer getAvatar() {
        return avatar;
    }

    /**
     * Establece el avatar del usuario.
     * 
     * @param avatar el ID del avatar a asignar
     */
    public void setAvatar(Integer avatar) {
        this.avatar = avatar;
    }

    /**
     * Obtiene la racha actual de días consecutivos de actividad.
     * 
     * @return el número de días consecutivos de actividad
     */
    public Integer getRacha() {
        return racha;
    }

    /**
     * Establece la racha de días consecutivos de actividad.
     * 
     * @param racha el número de días consecutivos a asignar
     */
    public void setRacha(Integer racha) {
        this.racha = racha;
    }

    /**
     * Obtiene los puntos de experiencia del usuario.
     * 
     * @return los puntos de experiencia acumulados
     */
    public Integer getExperiencia() {
        return experiencia;
    }

    /**
     * Establece los puntos de experiencia del usuario.
     * 
     * @param experiencia los puntos de experiencia a asignar
     */
    public void setExperiencia(Integer experiencia) {
        this.experiencia = experiencia;
    }

    /**
     * Obtiene la fecha de la última conexión del usuario.
     * 
     * @return la fecha de la última conexión
     */
    public LocalDate getUltimaConexion() {
        return ultimaConexion;
    }

    /**
     * Establece la fecha de la última conexión del usuario.
     * 
     * @param ultimaConexion la fecha de última conexión a asignar
     */
    public void setUltimaConexion(LocalDate ultimaConexion) {
        this.ultimaConexion = ultimaConexion;
    }
}