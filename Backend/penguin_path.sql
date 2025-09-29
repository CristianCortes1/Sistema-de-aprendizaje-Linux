
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS penguin_path
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE penguin_path;

-- ========================
-- Tabla Usuarios
-- ========================
DROP TABLE IF EXISTS Usuarios;
CREATE TABLE Usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(25) NOT NULL UNIQUE,
  correo VARCHAR(60) NOT NULL UNIQUE,
  contraseña VARCHAR(100) NOT NULL, -- aquí deberías guardar un hash (bcrypt)
  avatar INT,
  racha INT DEFAULT 0,
  experiencia INT DEFAULT 0,
  ultima_conexion DATE
) ENGINE=InnoDB;

-- ========================
-- Tabla Lecciones
-- ========================
DROP TABLE IF EXISTS Lecciones;
CREATE TABLE Lecciones (
  id_leccion INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ========================
-- Tabla Progresos (N:M entre Usuarios y Lecciones)
-- ========================
DROP TABLE IF EXISTS Progresos;
CREATE TABLE Progresos (
  usuario_id INT NOT NULL,
  leccion_id INT NOT NULL,
  progreso TINYINT DEFAULT 0, -- porcentaje 0 a 100
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, leccion_id),
  FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (leccion_id) REFERENCES Lecciones(id_leccion) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========================
-- Tabla Retos (cada lección puede tener varios retos)
-- ========================
DROP TABLE IF EXISTS Retos;
CREATE TABLE Retos (
  id_reto INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(300) NOT NULL,
  retroalimentacion VARCHAR(150),
  leccion_id INT NOT NULL,
  FOREIGN KEY (leccion_id) REFERENCES Lecciones(id_leccion) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========================
-- Tabla Comandos (cada reto puede tener varios comandos)
-- ========================
DROP TABLE IF EXISTS Comandos;
CREATE TABLE Comandos (
  id_comando INT AUTO_INCREMENT PRIMARY KEY,
  comando VARCHAR(100) NOT NULL,
  reto_id INT NOT NULL,
  FOREIGN KEY (reto_id) REFERENCES Retos(id_reto) ON DELETE CASCADE
) ENGINE=InnoDB;

