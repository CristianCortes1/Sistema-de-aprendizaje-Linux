package com.penguinpath.backend.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de seguridad para la aplicación Spring Boot.
 * 
 * Define la configuración de Spring Security incluyendo autenticación,
 * autorización, CORS y encriptación de contraseñas.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    /**
     * Configura la cadena de filtros de seguridad.
     * 
     * Establece las reglas de autorización, desactiva CSRF (apropiado para APIs REST),
     * habilita CORS y permite acceso sin autenticación a todos los endpoints
     * (actualmente configurado para desarrollo).
     * 
     * @param http objeto HttpSecurity para configurar la seguridad
     * @return la cadena de filtros de seguridad configurada
     * @throws Exception si ocurre un error en la configuración
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors()
                .and()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // preflight
                        .requestMatchers("/**").permitAll() // login sin auth
                        .anyRequest().authenticated() // resto protegido
                );

        return http.build();
    }

    /**
     * Configura CORS (Cross-Origin Resource Sharing) para permitir requests del frontend.
     * 
     * Permite requests desde el frontend en localhost:5173 con todos los métodos HTTP
     * necesarios y habilita el envío de credenciales.
     * 
     * @return configurador de MVC con configuración CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173") // frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    /**
     * Proporciona un encoder BCrypt para encriptar contraseñas.
     * 
     * BCrypt es un algoritmo de hash seguro que incluye salt automático
     * y es resistente a ataques de fuerza bruta.
     * 
     * @return una instancia de BCryptPasswordEncoder
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
