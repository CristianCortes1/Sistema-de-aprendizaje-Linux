package com.penguinpath.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

/**
 * Utilidad para manejar tokens JWT (JSON Web Tokens).
 * 
 * Proporciona métodos estáticos para generar y validar tokens JWT
 * utilizados en la autenticación de usuarios del sistema.
 * 
 * @author Sistema PenguinPath
 * @version 1.0
 */
public class JwtUtil {
    
    /**
     * Clave secreta utilizada para firmar los tokens JWT.
     * En producción, esta clave debería estar en variables de entorno.
     */
    private static final String SECRET_KEY = "RUFINOCRISTIANCORTES23kjasuy336778hgdfjh783894ghkjsnader"; // cámbiala y guárdala bien
    
    /**
     * Tiempo de expiración del token en milisegundos (1 día).
     */
    private static final long EXPIRATION_TIME = 86400000; // 1 día

    /**
     * Genera un token JWT para un usuario específico.
     * 
     * El token incluye el nombre de usuario como subject, fecha de emisión
     * y fecha de expiración. Se firma con la clave secreta usando HS256.
     * 
     * @param username el nombre de usuario para incluir en el token
     * @return el token JWT generado como string
     */
    public static String generarToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    /**
     * Extrae el nombre de usuario de un token JWT.
     * 
     * Parsea y valida el token usando la clave secreta, luego extrae
     * el subject que contiene el nombre de usuario.
     * 
     * @param token el token JWT del cual extraer el username
     * @return el nombre de usuario contenido en el token
     * @throws io.jsonwebtoken.JwtException si el token es inválido o ha expirado
     */
    public static String extraerUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
