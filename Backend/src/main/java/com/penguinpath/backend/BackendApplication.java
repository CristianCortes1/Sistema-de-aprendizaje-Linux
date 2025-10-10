package com.penguinpath.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Spring Boot para el sistema PenguinPath.
 * 
 * Esta es la clase de entrada que inicia la aplicación backend del sistema
 * de aprendizaje de Linux. Configura automáticamente Spring Boot con
 * todas las dependencias y componentes necesarios.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@SpringBootApplication
public class BackendApplication {

	/**
	 * Método principal que inicia la aplicación Spring Boot.
	 * 
	 * Punto de entrada de la aplicación que configura y ejecuta el contexto
	 * de Spring Boot, iniciando el servidor web embebido y todos los servicios.
	 * 
	 * @param args argumentos de línea de comandos (no utilizados actualmente)
	 */
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
