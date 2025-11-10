# Plan de las 3 Primeras Lecciones - PenguinPath

## Lección 1: Introducción a Linux y Navegación Básica

### Información de la Lección
- **Título**: Introducción a Linux y Navegación Básica
- **Objetivo**: Familiarizarse con la terminal de Linux y aprender a navegar por el sistema de archivos

### Retos

#### Reto 1: Mostrar el directorio actual
- **Descripción**: Usa el comando para mostrar en qué directorio te encuentras actualmente. Este comando te ayudará a saber tu ubicación en todo momento.
- **Comandos válidos**: 
  - `pwd`
- **Mensaje de retroalimentación**: "¡Excelente! El comando 'pwd' (print working directory) muestra la ruta completa del directorio donde te encuentras. Es útil para orientarte en el sistema de archivos."

#### Reto 2: Listar archivos y directorios
- **Descripción**: Muestra todos los archivos y carpetas que hay en tu directorio actual. Esto te permite ver qué contenido está disponible.
- **Comandos válidos**: 
  - `ls`
  - `ls -l`
  - `ls -a`
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'ls' lista el contenido del directorio. Puedes usar 'ls -l' para más detalles o 'ls -a' para ver archivos ocultos."

#### Reto 3: Crear un directorio
- **Descripción**: Crea una carpeta nueva llamada 'practica' usando el comando para crear directorios.
- **Comandos válidos**: 
  - `mkdir practica`
  - `mkdir ./practica`
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'mkdir' (make directory) crea un nuevo directorio. Ahora puedes organizarte mejor creando carpetas."

#### Reto 4: Navegar a un directorio
- **Descripción**: Entra al directorio 'practica' que acabas de crear usando el comando de cambio de directorio.
- **Comandos válidos**: 
  - `cd practica`
  - `cd ./practica`
- **Mensaje de retroalimentación**: "¡Genial! El comando 'cd' (change directory) te permite moverte entre directorios. Ahora estás dentro de 'practica'."

#### Reto 5: Regresar al directorio anterior
- **Descripción**: Regresa al directorio padre (un nivel arriba) usando el símbolo especial para el directorio padre.
- **Comandos válidos**: 
  - `cd ..`
  - `cd ../`
- **Mensaje de retroalimentación**: "¡Correcto! El símbolo '..' representa el directorio padre. Usar 'cd ..' te mueve un nivel arriba en la jerarquía de directorios."

#### Reto 6: Limpiar la terminal
- **Descripción**: La terminal está llena de texto. Usa el comando para limpiar la pantalla y tener una vista más clara.
- **Comandos válidos**: 
  - `clear`
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'clear' limpia la terminal, dándote una pantalla limpia para seguir trabajando. También puedes usar Ctrl+L."

#### Reto 7: Ver el manual de un comando
- **Descripción**: Muestra el manual de ayuda del comando 'ls' para aprender más sobre sus opciones disponibles.
- **Comandos válidos**: 
  - `man ls`
  - `ls --help`
- **Mensaje de retroalimentación**: "¡Excelente! El comando 'man' muestra el manual completo de cualquier comando. Es tu mejor amigo para aprender Linux. Presiona 'q' para salir del manual."

---

## Lección 2: Gestión de Archivos y Directorios

### Información de la Lección
- **Título**: Gestión de Archivos y Directorios
- **Objetivo**: Aprender a crear, mover, copiar y eliminar archivos y directorios

### Retos

#### Reto 1: Crear un archivo vacío
- **Descripción**: Crea un archivo vacío llamado 'nota.txt' usando el comando touch.
- **Comandos válidos**: 
  - `touch nota.txt`
  - `touch ./nota.txt`
- **Mensaje de retroalimentación**: "¡Bien hecho! El comando 'touch' crea archivos vacíos o actualiza la fecha de modificación de archivos existentes."

#### Reto 2: Escribir en un archivo
- **Descripción**: Escribe el texto 'Hola Linux' en el archivo 'nota.txt' usando redirección.
- **Comandos válidos**: 
  - `echo "Hola Linux" > nota.txt`
  - `echo 'Hola Linux' > nota.txt`
- **Mensaje de retroalimentación**: "¡Excelente! El operador '>' redirige la salida del comando 'echo' hacia el archivo, sobrescribiendo su contenido anterior."

#### Reto 3: Ver el contenido de un archivo
- **Descripción**: Muestra el contenido del archivo 'nota.txt' en la terminal.
- **Comandos válidos**: 
  - `cat nota.txt`
  - `cat ./nota.txt`
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'cat' (concatenate) muestra el contenido de archivos de texto. Es ideal para archivos pequeños."

#### Reto 4: Copiar un archivo
- **Descripción**: Crea una copia del archivo 'nota.txt' con el nombre 'nota_copia.txt'.
- **Comandos válidos**: 
  - `cp nota.txt nota_copia.txt`
  - `cp ./nota.txt ./nota_copia.txt`
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'cp' (copy) copia archivos. Ahora tienes dos archivos idénticos con diferentes nombres."

#### Reto 5: Renombrar o mover un archivo
- **Descripción**: Renombra el archivo 'nota_copia.txt' a 'respaldo.txt'.
- **Comandos válidos**: 
  - `mv nota_copia.txt respaldo.txt`
  - `mv ./nota_copia.txt ./respaldo.txt`
- **Mensaje de retroalimentación**: "¡Correcto! El comando 'mv' (move) sirve tanto para mover como para renombrar archivos. Es muy versátil."

#### Reto 6: Crear múltiples directorios
- **Descripción**: Crea un directorio llamado 'proyectos' y dentro de él crea 'proyecto1' usando la opción -p.
- **Comandos válidos**: 
  - `mkdir -p proyectos/proyecto1`
  - `mkdir -p ./proyectos/proyecto1`
- **Mensaje de retroalimentación**: "¡Excelente! La opción '-p' de mkdir crea directorios anidados en un solo comando, creando directorios padres si no existen."

#### Reto 7: Eliminar un archivo
- **Descripción**: Elimina el archivo 'respaldo.txt' usando el comando de eliminación. Ten cuidado, esta acción no se puede deshacer fácilmente.
- **Comandos válidos**: 
  - `rm respaldo.txt`
  - `rm ./respaldo.txt`
- **Mensaje de retroalimentación**: "¡Bien! El comando 'rm' (remove) elimina archivos. Úsalo con precaución ya que no hay papelera de reciclaje en la terminal."

#### Reto 8: Eliminar un directorio vacío
- **Descripción**: Intenta eliminar el directorio 'proyectos/proyecto1' usando el comando para directorios vacíos.
- **Comandos válidos**: 
  - `rmdir proyectos/proyecto1`
  - `rmdir ./proyectos/proyecto1`
- **Mensaje de retroalimentación**: "¡Correcto! El comando 'rmdir' elimina directorios vacíos. Para directorios con contenido, necesitarías usar 'rm -r'."

---

## Lección 3: Permisos y Propiedad de Archivos

### Información de la Lección
- **Título**: Permisos y Propiedad de Archivos
- **Objetivo**: Comprender y modificar permisos y propietarios de archivos en Linux

### Retos

#### Reto 1: Ver permisos de archivos
- **Descripción**: Lista los archivos del directorio actual con formato largo para ver sus permisos, propietario y grupo.
- **Comandos válidos**: 
  - `ls -l`
  - `ls -la`
  - `ll`
- **Mensaje de retroalimentación**: "¡Excelente! La opción '-l' muestra información detallada incluyendo permisos (rwx), propietario, grupo, tamaño y fecha de modificación."

#### Reto 2: Crear un script ejecutable
- **Descripción**: Crea un archivo llamado 'script.sh' con el comando touch.
- **Comandos válidos**: 
  - `touch script.sh`
  - `touch ./script.sh`
- **Mensaje de retroalimentación**: "¡Bien! Ahora tienes un archivo que convertiremos en un script ejecutable."

#### Reto 3: Dar permisos de ejecución
- **Descripción**: Agrega permisos de ejecución al archivo 'script.sh' para poder ejecutarlo como un programa.
- **Comandos válidos**: 
  - `chmod +x script.sh`
  - `chmod u+x script.sh`
  - `chmod 755 script.sh`
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'chmod' (change mode) modifica permisos. '+x' añade permiso de ejecución. Ahora puedes ejecutar el script."

#### Reto 4: Ver información de usuario
- **Descripción**: Muestra tu nombre de usuario actual en el sistema.
- **Comandos válidos**: 
  - `whoami`
  - `id -un`
- **Mensaje de retroalimentación**: "¡Correcto! El comando 'whoami' te dice qué usuario eres actualmente. Útil cuando trabajas con múltiples usuarios."

#### Reto 5: Ver grupos del usuario
- **Descripción**: Muestra todos los grupos a los que pertenece tu usuario actual.
- **Comandos válidos**: 
  - `groups`
  - `id`
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'groups' lista todos los grupos de tu usuario. Los grupos determinan qué recursos puedes acceder."

#### Reto 6: Cambiar permisos numéricos
- **Descripción**: Cambia los permisos de 'nota.txt' a solo lectura y escritura para el propietario (600).
- **Comandos válidos**: 
  - `chmod 600 nota.txt`
  - `chmod 600 ./nota.txt`
- **Mensaje de retroalimentación**: "¡Excelente! Los permisos numéricos: 6=rw- (lectura+escritura), 0=--- (sin permisos). El formato es: propietario-grupo-otros."

#### Reto 7: Ver detalles con stat
- **Descripción**: Usa el comando 'stat' para ver información detallada del archivo 'script.sh', incluyendo permisos en diferentes formatos.
- **Comandos válidos**: 
  - `stat script.sh`
  - `stat ./script.sh`
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'stat' muestra información completa: permisos (octal y simbólico), tamaño, bloques, inodo y fechas de acceso/modificación."

---

## Lección 4: Búsqueda y Filtrado de Archivos

### Información de la Lección
- **Título**: Búsqueda y Filtrado de Archivos
- **Objetivo**: Aprender a buscar archivos, buscar dentro de archivos y usar tuberías para combinar comandos

### Retos

#### Reto 1: Buscar archivos por nombre
- **Descripción**: Usa el comando 'find' para buscar todos los archivos que terminen en '.txt' en el directorio actual y sus subdirectorios.
- **Comandos válidos**: 
  - `find . -name "*.txt"`
  - `find . -name '*.txt'`
  - `find -name "*.txt"`
- **Mensaje de retroalimentación**: "¡Excelente! El comando 'find' es muy poderoso para buscar archivos. El punto '.' indica el directorio actual, y '-name' busca por nombre de archivo."

#### Reto 2: Buscar archivos por tipo
- **Descripción**: Busca solo directorios en el directorio actual usando find con la opción de tipo.
- **Comandos válidos**: 
  - `find . -type d`
  - `find -type d`
- **Mensaje de retroalimentación**: "¡Perfecto! La opción '-type d' filtra solo directorios. También puedes usar '-type f' para buscar solo archivos regulares."

#### Reto 3: Buscar texto dentro de archivos
- **Descripción**: Busca la palabra 'Linux' dentro de todos los archivos .txt del directorio actual usando grep.
- **Comandos válidos**: 
  - `grep "Linux" *.txt`
  - `grep 'Linux' *.txt`
  - `grep Linux *.txt`
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'grep' busca patrones de texto dentro de archivos. Es esencial para encontrar contenido específico."

#### Reto 4: Buscar de forma recursiva
- **Descripción**: Busca la palabra 'Hola' en todos los archivos del directorio actual y subdirectorios usando grep con la opción recursiva.
- **Comandos válidos**: 
  - `grep -r "Hola" .`
  - `grep -r 'Hola' .`
  - `grep -R "Hola" .`
- **Mensaje de retroalimentación**: "¡Correcto! La opción '-r' o '-R' hace que grep busque recursivamente en todos los subdirectorios."

#### Reto 5: Contar líneas de un archivo
- **Descripción**: Usa el comando 'wc' para contar cuántas líneas tiene el archivo 'nota.txt'.
- **Comandos válidos**: 
  - `wc -l nota.txt`
  - `wc -l ./nota.txt`
- **Mensaje de retroalimentación**: "¡Bien hecho! El comando 'wc' (word count) cuenta líneas (-l), palabras (-w) o caracteres (-c) en archivos."

#### Reto 6: Usar tuberías para combinar comandos
- **Descripción**: Lista todos los archivos del directorio actual y cuenta cuántas líneas devuelve usando el operador pipe '|'.
- **Comandos válidos**: 
  - `ls | wc -l`
  - `ls -1 | wc -l`
- **Mensaje de retroalimentación**: "¡Excelente! El operador '|' (pipe) conecta la salida de un comando con la entrada de otro. Es una de las características más poderosas de Linux."

#### Reto 7: Ordenar resultados
- **Descripción**: Lista los archivos del directorio actual y ordénalos alfabéticamente usando 'sort'.
- **Comandos válidos**: 
  - `ls | sort`
  - `ls -1 | sort`
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'sort' ordena líneas de texto. Puedes usar '-r' para orden inverso o '-n' para orden numérico."

#### Reto 8: Filtrar y mostrar las primeras líneas
- **Descripción**: Muestra solo las primeras 5 líneas del resultado de listar archivos usando el comando 'head'.
- **Comandos válidos**: 
  - `ls | head -5`
  - `ls | head -n 5`
  - `ls -1 | head -5`
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'head' muestra las primeras líneas de un archivo o salida. Para ver las últimas líneas, usa 'tail'."

#### Reto 9: Buscar archivos modificados recientemente
- **Descripción**: Busca archivos que se hayan modificado en las últimas 24 horas (1 día) usando find.
- **Comandos válidos**: 
  - `find . -mtime -1`
  - `find -mtime -1`
- **Mensaje de retroalimentación**: "¡Excelente! La opción '-mtime -1' encuentra archivos modificados en el último día. Es útil para encontrar cambios recientes en tu sistema."

---

## Notas para la Implementación en Base de Datos

### Estructura recomendada para insertar:

```sql
-- Lección 1
INSERT INTO "Lecciones" ("Titulo") VALUES ('Introducción a Linux y Navegación Básica') RETURNING "id_Leccion";

-- Retos de la Lección 1
INSERT INTO "Retos" ("descripcion", "Retroalimentacion", "Lecciones_id_Leccion") VALUES 
('Usa el comando para mostrar en qué directorio te encuentras actualmente...', '¡Excelente! El comando...', 1),
-- ... más retos

-- Comandos para cada reto
INSERT INTO "Comandos" ("comando", "Retos_id_Reto") VALUES ('pwd', 1);
```

### Resumen de Progresión:
- **Lección 1**: 7 retos - Navegación básica (14% por reto)
- **Lección 2**: 8 retos - Gestión de archivos (12.5% por reto)
- **Lección 3**: 7 retos - Permisos (14% por reto)
- **Lección 4**: 9 retos - Búsqueda y filtrado (11% por reto)

Total: 31 retos en las primeras 4 lecciones
