# LECCIÓN 1: Introducción a Linux y Comandos Básicos

## 📚 Basado en Linux Bible - Capítulo 1 y 2

---

## 🎯 Objetivos de Aprendizaje

Al completar esta lección, el estudiante será capaz de:
1. Comprender qué es Linux y su importancia en la informática moderna
2. Navegar por el sistema de archivos usando la terminal
3. Listar archivos y directorios con diferentes opciones
4. Entender la estructura de directorios de Linux
5. Usar comandos básicos de navegación

---

## 📖 Contenido Teórico

### ¿Qué es Linux?

Linux es un **sistema operativo de código abierto** basado en Unix, creado por Linus Torvalds en 1991. A diferencia de Windows o macOS, Linux es:

- **Libre y gratuito**: Cualquiera puede usarlo, modificarlo y distribuirlo
- **Seguro**: Menos vulnerable a virus y malware
- **Potente**: Usado en servidores, supercomputadoras y dispositivos IoT
- **Flexible**: Múltiples distribuciones (Ubuntu, Fedora, Debian, CentOS)

### ¿Por qué aprender la terminal?

La **terminal** (o línea de comandos) es una interfaz poderosa que permite:
- Automatizar tareas repetitivas
- Administrar servidores remotos
- Mayor control y eficiencia
- Acceso a herramientas avanzadas
- Habilidad esencial para DevOps, SysAdmin y desarrollo

### Estructura de Directorios en Linux

Linux organiza todo en una jerarquía de árbol que comienza en `/` (raíz):

```
/                    (raíz - root)
├── home/           (directorios de usuarios)
│   └── usuario/    (tu directorio personal)
├── bin/            (binarios esenciales)
├── etc/            (archivos de configuración)
├── var/            (datos variables, logs)
├── tmp/            (archivos temporales)
├── usr/            (aplicaciones de usuario)
└── root/           (directorio del superusuario)
```

---

## 🔧 Comandos Básicos

### 1. pwd - Print Working Directory
**Muestra el directorio actual donde te encuentras**

```bash
pwd
```

Ejemplo de salida:
```
/home/usuario
```

---

### 2. ls - List
**Lista archivos y directorios**

#### Uso básico:
```bash
ls
```
Muestra archivos y carpetas en el directorio actual.

#### Opciones importantes:

```bash
ls -l
```
**Lista detallada** (long format) - muestra permisos, propietario, tamaño, fecha

Salida ejemplo:
```
drwxr-xr-x  2 usuario usuario 4096 nov  9 10:30 Documentos
-rw-r--r--  1 usuario usuario  256 nov  9 10:25 archivo.txt
```

```bash
ls -a
```
**Muestra archivos ocultos** (los que empiezan con punto `.`)

```bash
ls -la
```
**Combina ambas**: lista detallada incluyendo archivos ocultos

```bash
ls -lh
```
**Tamaños legibles** para humanos (KB, MB, GB en lugar de bytes)

---

### 3. cd - Change Directory
**Cambia de directorio (navega entre carpetas)**

#### Ejemplos:

```bash
cd /home
```
Ir a un directorio específico (ruta absoluta)

```bash
cd Documentos
```
Ir a una subcarpeta (ruta relativa)

```bash
cd ..
```
Subir un nivel (ir al directorio padre)

```bash
cd ~
```
Ir a tu directorio personal (/home/usuario)

```bash
cd /
```
Ir a la raíz del sistema

```bash
cd -
```
Volver al directorio anterior

---

### 4. clear
**Limpia la pantalla de la terminal**

```bash
clear
```

O usa el atajo de teclado: `Ctrl + L`

---

### 5. man - Manual
**Muestra la documentación de un comando**

```bash
man ls
```

Navega con las flechas, sal con `q`

---

## 🎮 Retos Prácticos

### Reto 1: ¿Dónde estoy?
**Objetivo**: Verificar tu ubicación actual en el sistema

**Comando esperado**: `pwd`

**Explicación**: Este comando imprime la ruta completa del directorio donde te encuentras actualmente.

---

### Reto 2: Ver qué hay aquí
**Objetivo**: Listar el contenido del directorio actual

**Comandos válidos**: 
- `ls`
- `ls -l`
- `ls -la`

**Explicación**: El comando `ls` muestra todos los archivos y carpetas visibles. Con `-l` ves detalles, con `-a` incluyes archivos ocultos.

---

### Reto 3: Lista detallada con tamaños legibles
**Objetivo**: Ver archivos con información detallada y tamaños en formato humano

**Comandos válidos**:
- `ls -lh`
- `ls -lha`
- `ls -hl`

**Explicación**: La opción `-h` convierte bytes a KB, MB, GB para facilitar la lectura.

---

### Reto 4: Navegar al directorio raíz
**Objetivo**: Ir al directorio raíz del sistema

**Comando esperado**: `cd /`

**Explicación**: `/` es el directorio raíz de todo el sistema de archivos Linux.

---

### Reto 5: Volver a tu casa
**Objetivo**: Regresar a tu directorio personal

**Comandos válidos**:
- `cd ~`
- `cd $HOME`
- `cd` (sin argumentos)

**Explicación**: Tu directorio personal es donde guardas tus archivos personales, generalmente `/home/tu_usuario`.

---

### Reto 6: Subir un nivel
**Objetivo**: Ir al directorio padre (un nivel arriba)

**Comando esperado**: `cd ..`

**Explicación**: Los dos puntos `..` representan el directorio padre en la jerarquía.

---

### Reto 7: Ver archivos ocultos
**Objetivo**: Listar todos los archivos incluyendo los ocultos

**Comandos válidos**:
- `ls -a`
- `ls -la`
- `ls -al`

**Explicación**: Los archivos que comienzan con punto `.` están ocultos por defecto. La opción `-a` los muestra.

---

## 💡 Consejos y Trucos

### 1. Autocompletado con Tab
Presiona `Tab` para autocompletar nombres de archivos y directorios:
```bash
cd Doc[Tab]  →  cd Documentos/
```

### 2. Historial de comandos
- Usa las flechas ↑ y ↓ para navegar por comandos anteriores
- `history` muestra todos los comandos ejecutados
- `!123` ejecuta el comando número 123 del historial

### 3. Combinando comandos
Puedes combinar opciones:
```bash
ls -lah  # lista detallada + ocultos + tamaños legibles
```

### 4. Rutas absolutas vs relativas
- **Absoluta**: Comienza desde la raíz `/home/usuario/Documentos`
- **Relativa**: Desde donde estás `Documentos/carpeta`

### 5. Caracteres especiales
- `.` = directorio actual
- `..` = directorio padre
- `~` = directorio personal
- `/` = directorio raíz

---

## 📝 Resumen

En esta lección aprendiste:

✅ Qué es Linux y por qué es importante  
✅ La estructura de directorios de Linux  
✅ `pwd` - ver tu ubicación actual  
✅ `ls` - listar archivos (con opciones -l, -a, -h)  
✅ `cd` - navegar entre directorios  
✅ `clear` - limpiar la terminal  
✅ Conceptos de rutas absolutas y relativas  

---

## 🎓 Próximos Pasos

En la siguiente lección aprenderás:
- Crear y eliminar archivos y directorios
- Copiar y mover archivos
- Ver contenido de archivos
- Comandos de búsqueda básica

---

## 📚 Referencias

- Linux Bible (Christopher Negus) - Capítulos 1-2
- [The Linux Command Line](http://linuxcommand.org/)
- `man` pages de cada comando