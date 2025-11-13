# Plan de Lecciones con Explicaciones - PenguinPath

## Lección 1: Introducción a Linux y Navegación Básica

### Información de la Lección
- **Título**: Introducción a Linux y Navegación Básica
- **Objetivo**: Familiarizarse con la terminal de Linux y aprender a navegar por el sistema de archivos

### Contenido de la Lección

#### Elemento 1: Explicación - Bienvenida a la Terminal
- **Tipo**: `explicacion`
- **Título**: ¡Bienvenido a la Terminal de Linux! 🐧
- **Contenido**:
```html
<h2>¿Qué es la Terminal?</h2>
<p>La terminal, también conocida como línea de comandos o shell, es una interfaz de texto donde puedes comunicarte directamente con el sistema operativo Linux. A diferencia de las interfaces gráficas donde haces clic en iconos, aquí escribes comandos que el sistema ejecuta.</p>

<h3>¿Por qué usar la Terminal?</h3>
<ul>
    <li><strong>Velocidad:</strong> Los comandos son más rápidos que navegar por menús gráficos</li>
    <li><strong>Precisión:</strong> Control exacto sobre lo que quieres hacer</li>
    <li><strong>Automatización:</strong> Puedes crear scripts para tareas repetitivas</li>
    <li><strong>Acceso remoto:</strong> Controla servidores desde cualquier lugar</li>
</ul>

<h3>Estructura de un Comando</h3>
<pre><code>comando [opciones] [argumentos]</code></pre>
<p>Por ejemplo: <code>ls -l /home</code></p>
<ul>
    <li><code>ls</code> es el comando (listar archivos)</li>
    <li><code>-l</code> es una opción (formato largo)</li>
    <li><code>/home</code> es el argumento (qué directorio listar)</li>
</ul>

<p><em>¡Empecemos con tu primer comando!</em></p>
```

#### Elemento 2: Reto - Mostrar el directorio actual
- **Tipo**: `reto`
- **Descripción**: Usa el comando para mostrar en qué directorio te encuentras actualmente. Este comando te ayudará a saber tu ubicación en todo momento.
- **Comandos válidos**: 
  - `pwd` - Muestra la ruta completa del directorio actual (print working directory)
- **Mensaje de retroalimentación**: "¡Excelente! El comando 'pwd' (print working directory) muestra la ruta completa del directorio donde te encuentras. Es útil para orientarte en el sistema de archivos."

#### Elemento 3: Explicación - Sistema de Archivos de Linux
- **Tipo**: `explicacion`
- **Título**: El Sistema de Archivos en Linux
- **Contenido**:
```html
<h2>Estructura de Directorios</h2>
<p>En Linux, todo está organizado en una estructura de árbol que comienza desde la raíz (<code>/</code>). Imagina un árbol invertido:</p>

<pre>
/                    (raíz del sistema)
├── home/           (directorios de usuarios)
│   ├── usuario1/
│   └── usuario2/
├── etc/            (archivos de configuración)
├── var/            (archivos variables, logs)
└── tmp/            (archivos temporales)
</pre>

<h3>Rutas Absolutas vs Relativas</h3>
<ul>
    <li><strong>Ruta absoluta:</strong> Comienza desde la raíz. Ejemplo: <code>/home/usuario/documentos</code></li>
    <li><strong>Ruta relativa:</strong> Desde tu ubicación actual. Ejemplo: <code>documentos</code> o <code>./documentos</code></li>
</ul>

<h3>Símbolos Especiales</h3>
<ul>
    <li><code>.</code> representa el directorio actual</li>
    <li><code>..</code> representa el directorio padre (un nivel arriba)</li>
    <li><code>~</code> representa tu directorio home</li>
</ul>

<p>Ahora que conoces la estructura, ¡veamos qué hay en tu directorio!</p>
```

#### Elemento 4: Reto - Listar archivos y directorios
- **Tipo**: `reto`
- **Descripción**: Muestra todos los archivos y carpetas que hay en tu directorio actual. Esto te permite ver qué contenido está disponible.
- **Comandos válidos**: 
  - `ls` - Lista archivos y directorios del directorio actual
  - `ls -l` - Lista en formato largo con detalles (permisos, propietario, tamaño, fecha)
  - `ls -a` - Lista todos los archivos, incluidos los ocultos (que empiezan con .)
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'ls' lista el contenido del directorio. Puedes usar 'ls -l' para más detalles o 'ls -a' para ver archivos ocultos."

#### Elemento 5: Explicación - Creando tu Primer Directorio
- **Tipo**: `explicacion`
- **Título**: Organizando tu Espacio de Trabajo
- **Contenido**:
```html
<h2>¿Por qué Crear Directorios?</h2>
<p>Los directorios (carpetas) son fundamentales para mantener tus archivos organizados. En Linux, usamos el comando <code>mkdir</code> (make directory) para crear nuevos directorios.</p>

<h3>Uso Básico</h3>
<pre><code>mkdir nombre_directorio</code></pre>

<h3>Opciones Útiles</h3>
<ul>
    <li><code>mkdir -p ruta/completa/anidada</code> - Crea directorios padres si no existen</li>
    <li><code>mkdir dir1 dir2 dir3</code> - Crea múltiples directorios a la vez</li>
</ul>

<p><strong>Buenas prácticas:</strong></p>
<ul>
    <li>Usa nombres descriptivos sin espacios (usa guiones o guiones bajos)</li>
    <li>Evita caracteres especiales como *, ?, /, \</li>
    <li>Distingue mayúsculas de minúsculas (Linux es case-sensitive)</li>
</ul>

<p>¡Hora de crear tu primer directorio de práctica!</p>
```

#### Elemento 6: Reto - Crear un directorio
- **Tipo**: `reto`
- **Descripción**: Crea una carpeta nueva llamada 'practica' usando el comando para crear directorios.
- **Comandos válidos**: 
  - `mkdir practica` - Crea un nuevo directorio llamado 'practica' (make directory)
  - `mkdir ./practica` - Crea el directorio en la ubicación actual (forma explícita)
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'mkdir' (make directory) crea un nuevo directorio. Ahora puedes organizarte mejor creando carpetas."

#### Elemento 7: Reto - Navegar a un directorio
- **Tipo**: `reto`
- **Descripción**: Entra al directorio 'practica' que acabas de crear usando el comando de cambio de directorio.
- **Comandos válidos**: 
  - `cd practica` - Cambia al directorio 'practica' (change directory)
  - `cd ./practica` - Cambia al directorio usando ruta relativa explícita
- **Mensaje de retroalimentación**: "¡Genial! El comando 'cd' (change directory) te permite moverte entre directorios. Ahora estás dentro de 'practica'."

#### Elemento 8: Reto - Regresar al directorio anterior
- **Tipo**: `reto`
- **Descripción**: Regresa al directorio padre (un nivel arriba) usando el símbolo especial para el directorio padre.
- **Comandos válidos**: 
  - `cd ..` - Sube un nivel en la jerarquía de directorios (al directorio padre)
  - `cd ../` - Sube al directorio padre (forma alternativa con barra)
- **Mensaje de retroalimentación**: "¡Correcto! El símbolo '..' representa el directorio padre. Usar 'cd ..' te mueve un nivel arriba en la jerarquía de directorios."

#### Elemento 9: Explicación - Herramientas de Ayuda
- **Tipo**: `explicacion`
- **Título**: Obteniendo Ayuda en Linux
- **Contenido**:
```html
<h2>Nunca Estás Solo en Linux</h2>
<p>Linux incluye excelentes herramientas de ayuda integradas. No necesitas memorizar todo, ¡solo necesitas saber cómo buscar ayuda!</p>

<h3>El Comando 'man' (Manual)</h3>
<pre><code>man comando</code></pre>
<p>Muestra el manual completo de cualquier comando con descripción detallada, opciones y ejemplos.</p>

<h3>La Opción '--help'</h3>
<pre><code>comando --help</code></pre>
<p>Muestra un resumen rápido de las opciones del comando.</p>

<h3>El Comando 'clear'</h3>
<p>Cuando tu terminal esté llena de texto, usa <code>clear</code> para limpiar la pantalla. También puedes usar el atajo <code>Ctrl+L</code>.</p>

<h3>Navegación en el Manual</h3>
<ul>
    <li><strong>Espacio:</strong> Avanzar una página</li>
    <li><strong>b:</strong> Retroceder una página</li>
    <li><strong>/texto:</strong> Buscar "texto"</li>
    <li><strong>q:</strong> Salir del manual</li>
</ul>

<p>¡Practiquemos limpiando la terminal y consultando ayuda!</p>
```

#### Elemento 10: Reto - Limpiar la terminal
- **Tipo**: `reto`
- **Descripción**: La terminal está llena de texto. Usa el comando para limpiar la pantalla y tener una vista más clara.
- **Comandos válidos**: 
  - `clear` - Limpia la pantalla de la terminal (equivalente a Ctrl+L)
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'clear' limpia la terminal, dándote una pantalla limpia para seguir trabajando. También puedes usar Ctrl+L."

#### Elemento 11: Reto - Ver el manual de un comando
- **Tipo**: `reto`
- **Descripción**: Muestra el manual de ayuda del comando 'ls' para aprender más sobre sus opciones disponibles.
- **Comandos válidos**: 
  - `man ls` - Muestra el manual completo del comando ls (presiona 'q' para salir)
  - `ls --help` - Muestra un resumen rápido de las opciones del comando ls
- **Mensaje de retroalimentación**: "¡Excelente! El comando 'man' muestra el manual completo de cualquier comando. Es tu mejor amigo para aprender Linux. Presiona 'q' para salir del manual."

---

## Lección 2: Gestión de Archivos y Directorios

### Información de la Lección
- **Título**: Gestión de Archivos y Directorios
- **Objetivo**: Aprender a crear, mover, copiar y eliminar archivos y directorios

### Contenido de la Lección

#### Elemento 1: Explicación - Trabajando con Archivos
- **Tipo**: `explicacion`
- **Título**: Creación y Manipulación de Archivos 📄
- **Contenido**:
```html
<h2>¿Qué es un Archivo en Linux?</h2>
<p>Todo en Linux es un archivo: documentos de texto, imágenes, programas, incluso los dispositivos de hardware se representan como archivos. Dominar la gestión de archivos es fundamental.</p>

<h3>Comandos Esenciales</h3>
<ul>
    <li><code>touch archivo.txt</code> - Crea un archivo vacío</li>
    <li><code>echo "texto" > archivo.txt</code> - Escribe texto en un archivo</li>
    <li><code>cat archivo.txt</code> - Muestra el contenido de un archivo</li>
    <li><code>cp origen destino</code> - Copia archivos</li>
    <li><code>mv origen destino</code> - Mueve o renombra archivos</li>
    <li><code>rm archivo.txt</code> - Elimina archivos</li>
</ul>

<h3>Redirección de Salida</h3>
<p>Los operadores de redirección controlan dónde va la salida de un comando:</p>
<ul>
    <li><code>></code> - Sobrescribe el archivo con la nueva salida</li>
    <li><code>>></code> - Añade al final del archivo sin borrar contenido</li>
</ul>

<p><strong>¡Importante!</strong> A diferencia de sistemas con papelera de reciclaje, en Linux eliminar es permanente. ¡Ten cuidado con <code>rm</code>!</p>

<p>Empecemos creando nuestro primer archivo.</p>
```

#### Elemento 2: Reto - Crear un archivo vacío
- **Tipo**: `reto`
- **Descripción**: Crea un archivo vacío llamado 'nota.txt' usando el comando touch.
- **Comandos válidos**: 
  - `touch nota.txt` - Crea un archivo vacío o actualiza fecha de modificación
  - `touch ./nota.txt` - Crea el archivo en la ubicación actual (forma explícita)
- **Mensaje de retroalimentación**: "¡Bien hecho! El comando 'touch' crea archivos vacíos o actualiza la fecha de modificación de archivos existentes."

#### Elemento 3: Reto - Escribir en un archivo
- **Tipo**: `reto`
- **Descripción**: Escribe el texto 'Hola Linux' en el archivo 'nota.txt' usando redirección.
- **Comandos válidos**: 
  - `echo "Hola Linux" > nota.txt` - Escribe texto en archivo (sobrescribe contenido)
  - `echo 'Hola Linux' > nota.txt` - Escribe texto usando comillas simples
- **Mensaje de retroalimentación**: "¡Excelente! El operador '>' redirige la salida del comando 'echo' hacia el archivo, sobrescribiendo su contenido anterior."

#### Elemento 4: Reto - Ver el contenido de un archivo
- **Tipo**: `reto`
- **Descripción**: Muestra el contenido del archivo 'nota.txt' en la terminal.
- **Comandos válidos**: 
  - `cat nota.txt` - Muestra el contenido completo del archivo (concatenate)
  - `cat ./nota.txt` - Muestra el contenido usando ruta relativa explícita
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'cat' (concatenate) muestra el contenido de archivos de texto. Es ideal para archivos pequeños."

#### Elemento 5: Explicación - Copiando y Moviendo Archivos
- **Tipo**: `explicacion`
- **Título**: Copiar vs Mover: ¿Cuál es la Diferencia?
- **Contenido**:
```html
<h2>Comando CP (Copy)</h2>
<p>El comando <code>cp</code> crea una <strong>copia exacta</strong> de un archivo, dejando el original intacto.</p>
<pre><code>cp archivo_original.txt archivo_copia.txt</code></pre>

<h3>Opciones Útiles de CP</h3>
<ul>
    <li><code>cp -r directorio1 directorio2</code> - Copia directorios recursivamente</li>
    <li><code>cp -i</code> - Modo interactivo, pregunta antes de sobrescribir</li>
    <li><code>cp -v</code> - Modo verbose, muestra qué se está copiando</li>
</ul>

<h2>Comando MV (Move)</h2>
<p>El comando <code>mv</code> tiene dos usos principales:</p>
<ol>
    <li><strong>Mover archivos:</strong> <code>mv archivo.txt /otra/carpeta/</code></li>
    <li><strong>Renombrar archivos:</strong> <code>mv nombre_viejo.txt nombre_nuevo.txt</code></li>
</ol>

<p>A diferencia de <code>cp</code>, <code>mv</code> no crea una copia, sino que mueve el archivo original.</p>

<h3>¿Cuándo Usar Cada Uno?</h3>
<ul>
    <li><strong>CP:</strong> Cuando necesitas un respaldo o duplicado</li>
    <li><strong>MV:</strong> Cuando quieres reorganizar o cambiar nombres</li>
</ul>

<p>¡Practiquemos copiando y renombrando archivos!</p>
```

#### Elemento 6: Reto - Copiar un archivo
- **Tipo**: `reto`
- **Descripción**: Crea una copia del archivo 'nota.txt' con el nombre 'nota_copia.txt'.
- **Comandos válidos**: 
  - `cp nota.txt nota_copia.txt` - Copia un archivo (copy)
  - `cp ./nota.txt ./nota_copia.txt` - Copia usando rutas relativas explícitas
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'cp' (copy) copia archivos. Ahora tienes dos archivos idénticos con diferentes nombres."

#### Elemento 7: Reto - Renombrar o mover un archivo
- **Tipo**: `reto`
- **Descripción**: Renombra el archivo 'nota_copia.txt' a 'respaldo.txt'.
- **Comandos válidos**: 
  - `mv nota_copia.txt respaldo.txt` - Mueve o renombra archivos (move)
  - `mv ./nota_copia.txt ./respaldo.txt` - Renombra usando rutas explícitas
- **Mensaje de retroalimentación**: "¡Correcto! El comando 'mv' (move) sirve tanto para mover como para renombrar archivos. Es muy versátil."

#### Elemento 8: Explicación - Directorios Anidados
- **Tipo**: `explicacion`
- **Título**: Creando Estructuras de Directorios Complejas
- **Contenido**:
```html
<h2>La Opción -p de mkdir</h2>
<p>A veces necesitas crear una estructura de directorios anidados, como:</p>
<pre>
proyectos/
└── web/
    └── frontend/
        └── componentes/
</pre>

<p>Crear esto directorio por directorio sería tedioso. ¡Aquí es donde brilla la opción <code>-p</code>!</p>

<h3>Uso de mkdir -p</h3>
<pre><code>mkdir -p proyectos/web/frontend/componentes</code></pre>

<p>Este comando:</p>
<ul>
    <li>Crea todos los directorios padres que no existan</li>
    <li>No da error si algún directorio ya existe</li>
    <li>Crea toda la estructura en un solo comando</li>
</ul>

<h3>Ejemplo Práctico</h3>
<pre><code># Crear estructura de proyecto
mkdir -p mi_proyecto/src/components
mkdir -p mi_proyecto/src/utils
mkdir -p mi_proyecto/tests</code></pre>

<p>Esta es una práctica común al inicializar proyectos de programación.</p>

<p>¡Vamos a crear una estructura anidada!</p>
```

#### Elemento 9: Reto - Crear múltiples directorios
- **Tipo**: `reto`
- **Descripción**: Crea un directorio llamado 'proyectos' y dentro de él crea 'proyecto1' usando la opción -p.
- **Comandos válidos**: 
  - `mkdir -p proyectos/proyecto1` - Crea directorios anidados (padres + hijo)
  - `mkdir -p ./proyectos/proyecto1` - Crea estructura de directorios completa
- **Mensaje de retroalimentación**: "¡Excelente! La opción '-p' de mkdir crea directorios anidados en un solo comando, creando directorios padres si no existen."

#### Elemento 10: Explicación - Eliminación Segura
- **Tipo**: `explicacion`
- **Título**: Eliminando Archivos y Directorios con Precaución ⚠️
- **Contenido**:
```html
<h2>El Comando rm (Remove)</h2>
<p><strong>⚠️ ADVERTENCIA:</strong> En Linux no hay papelera de reciclaje en la terminal. Cuando eliminas con <code>rm</code>, es <em>permanente</em>.</p>

<h3>Sintaxis Básica</h3>
<pre><code>rm archivo.txt</code></pre>

<h3>Opciones Importantes</h3>
<ul>
    <li><code>rm -i</code> - Modo interactivo, pregunta antes de eliminar</li>
    <li><code>rm -r</code> - Recursivo, elimina directorios y su contenido</li>
    <li><code>rm -f</code> - Force, no pregunta confirmación (¡peligroso!)</li>
</ul>

<h2>El Comando rmdir</h2>
<p>Para directorios <strong>vacíos</strong>, existe <code>rmdir</code>:</p>
<pre><code>rmdir directorio_vacio</code></pre>

<p>Si el directorio tiene contenido, <code>rmdir</code> dará error. Esto es una <em>característica de seguridad</em>.</p>

<h3>Buenas Prácticas</h3>
<ul>
    <li>Siempre usa <code>ls</code> antes de <code>rm</code> para verificar qué eliminarás</li>
    <li>Usa <code>rm -i</code> cuando elimines múltiples archivos</li>
    <li>Nunca uses <code>rm -rf</code> sin estar 100% seguro</li>
    <li>Considera hacer respaldo antes de eliminar archivos importantes</li>
</ul>

<p><strong>Regla de oro:</strong> Si no estás seguro, ¡no lo elimines!</p>

<p>Practiquemos eliminando con cuidado.</p>
```

#### Elemento 11: Reto - Eliminar un archivo
- **Tipo**: `reto`
- **Descripción**: Elimina el archivo 'respaldo.txt' usando el comando de eliminación. Ten cuidado, esta acción no se puede deshacer fácilmente.
- **Comandos válidos**: 
  - `rm respaldo.txt` - Elimina un archivo (remove - acción permanente)
  - `rm ./respaldo.txt` - Elimina archivo usando ruta relativa explícita
- **Mensaje de retroalimentación**: "¡Bien! El comando 'rm' (remove) elimina archivos. Úsalo con precaución ya que no hay papelera de reciclaje en la terminal."

#### Elemento 12: Reto - Eliminar un directorio vacío
- **Tipo**: `reto`
- **Descripción**: Intenta eliminar el directorio 'proyectos/proyecto1' usando el comando para directorios vacíos.
- **Comandos válidos**: 
  - `rmdir proyectos/proyecto1` - Elimina directorios vacíos (remove directory)
  - `rmdir ./proyectos/proyecto1` - Elimina directorio vacío con ruta explícita
- **Mensaje de retroalimentación**: "¡Correcto! El comando 'rmdir' elimina directorios vacíos. Para directorios con contenido, necesitarías usar 'rm -r'."

---

## Lección 3: Permisos y Propiedad de Archivos

### Información de la Lección
- **Título**: Permisos y Propiedad de Archivos
- **Objetivo**: Comprender y modificar permisos y propietarios de archivos en Linux

### Contenido de la Lección

#### Elemento 1: Explicación - Sistema de Permisos de Linux
- **Tipo**: `explicacion`
- **Título**: Entendiendo los Permisos en Linux 🔐
- **Contenido**:
```html
<h2>¿Por qué Existen los Permisos?</h2>
<p>Linux es un sistema multiusuario. Los permisos controlan <strong>quién puede hacer qué</strong> con cada archivo y directorio, protegiendo la seguridad y privacidad de todos los usuarios.</p>

<h3>Los Tres Tipos de Permisos</h3>
<ul>
    <li><strong>r (read):</strong> Leer el contenido del archivo o listar el directorio</li>
    <li><strong>w (write):</strong> Modificar el archivo o crear/eliminar archivos en el directorio</li>
    <li><strong>x (execute):</strong> Ejecutar el archivo como programa o acceder al directorio</li>
</ul>

<h3>Los Tres Grupos de Usuarios</h3>
<ol>
    <li><strong>Usuario (u):</strong> El propietario del archivo</li>
    <li><strong>Grupo (g):</strong> Usuarios que pertenecen al grupo del archivo</li>
    <li><strong>Otros (o):</strong> Todos los demás usuarios del sistema</li>
</ol>

<h3>Leyendo Permisos</h3>
<p>Cuando usas <code>ls -l</code>, verás algo como:</p>
<pre><code>-rwxr-xr--  1 usuario grupo 1234 Nov 10 10:00 archivo.txt
 ^^^^ ^^^ ^^
 │    │   └── Permisos para otros: r-- (solo lectura)
 │    └────── Permisos para grupo: r-x (lectura y ejecución)
 └─────────── Permisos para usuario: rwx (todos los permisos)</code></pre>

<h3>Permisos Numéricos (Octal)</h3>
<p>Los permisos también se pueden expresar con números:</p>
<ul>
    <li><code>r = 4</code></li>
    <li><code>w = 2</code></li>
    <li><code>x = 1</code></li>
</ul>
<p>Ejemplo: <code>rwx = 4+2+1 = 7</code>, <code>r-x = 4+0+1 = 5</code>, <code>r-- = 4+0+0 = 4</code></p>
<p>Entonces: <code>chmod 754 archivo</code> = <code>rwxr-xr--</code></p>

<p>¡Veamos los permisos en acción!</p>
```

#### Elemento 2: Reto - Ver permisos de archivos
- **Tipo**: `reto`
- **Descripción**: Lista los archivos del directorio actual con formato largo para ver sus permisos, propietario y grupo.
- **Comandos válidos**: 
  - `ls -l` - Lista en formato largo (permisos, propietario, tamaño, fecha)
  - `ls -la` - Lista formato largo incluyendo archivos ocultos
  - `ll` - Alias de 'ls -l' (si está configurado en el sistema)
- **Mensaje de retroalimentación**: "¡Excelente! La opción '-l' muestra información detallada incluyendo permisos (rwx), propietario, grupo, tamaño y fecha de modificación."

#### Elemento 3: Reto - Crear un script ejecutable
- **Tipo**: `reto`
- **Descripción**: Crea un archivo llamado 'script.sh' con el comando touch.
- **Comandos válidos**: 
  - `touch script.sh` - Crea un archivo vacío (extensión .sh = shell script)
  - `touch ./script.sh` - Crea el archivo en el directorio actual
- **Mensaje de retroalimentación**: "¡Bien! Ahora tienes un archivo que convertiremos en un script ejecutable."

#### Elemento 4: Explicación - El Comando chmod
- **Tipo**: `explicacion`
- **Título**: Modificando Permisos con chmod
- **Contenido**:
```html
<h2>chmod: Change Mode</h2>
<p>El comando <code>chmod</code> (change mode) modifica los permisos de archivos y directorios.</p>

<h3>Modo Simbólico</h3>
<p>Usa letras para modificar permisos específicos:</p>
<pre><code>chmod u+x archivo.sh    # Añade ejecución al usuario
chmod g-w archivo.txt   # Quita escritura al grupo
chmod o+r documento.pdf # Añade lectura a otros
chmod a+x script.sh     # Añade ejecución a todos (all)</code></pre>

<h3>Modo Numérico</h3>
<p>Establece permisos completos con números de tres dígitos:</p>
<pre><code>chmod 755 script.sh     # rwxr-xr-x (común para ejecutables)
chmod 644 archivo.txt   # rw-r--r-- (común para archivos de texto)
chmod 600 privado.txt   # rw------- (solo el propietario)
chmod 777 compartido    # rwxrwxrwx (todos los permisos, ¡poco seguro!)</code></pre>

<h3>Casos de Uso Comunes</h3>
<ul>
    <li><strong>Scripts ejecutables:</strong> <code>chmod +x script.sh</code></li>
    <li><strong>Archivos privados:</strong> <code>chmod 600 secreto.txt</code></li>
    <li><strong>Directorios compartidos:</strong> <code>chmod 755 carpeta/</code></li>
    <li><strong>Archivos de solo lectura:</strong> <code>chmod 444 importante.txt</code></li>
</ul>

<p><strong>Consejo:</strong> Evita usar <code>777</code> a menos que sea absolutamente necesario. Es un riesgo de seguridad.</p>

<p>¡Hagamos nuestro archivo ejecutable!</p>
```

#### Elemento 5: Reto - Dar permisos de ejecución
- **Tipo**: `reto`
- **Descripción**: Agrega permisos de ejecución al archivo 'script.sh' para poder ejecutarlo como un programa.
- **Comandos válidos**: 
  - `chmod +x script.sh` - Añade permiso de ejecución a todos (change mode)
  - `chmod u+x script.sh` - Añade permiso de ejecución solo al usuario
  - `chmod 755 script.sh` - Establece permisos rwxr-xr-x (formato numérico)
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'chmod' (change mode) modifica permisos. '+x' añade permiso de ejecución. Ahora puedes ejecutar el script."

#### Elemento 6: Explicación - Usuarios y Grupos
- **Tipo**: `explicacion`
- **Título**: Identidad en Linux: Usuarios y Grupos
- **Contenido**:
```html
<h2>Sistema de Usuarios</h2>
<p>En Linux, cada proceso y archivo pertenece a un usuario y un grupo. Esta organización permite control de acceso granular.</p>

<h3>Comandos de Identidad</h3>
<ul>
    <li><code>whoami</code> - Muestra tu nombre de usuario actual</li>
    <li><code>id</code> - Muestra tu UID (ID de usuario) y GID (ID de grupo)</li>
    <li><code>groups</code> - Lista todos los grupos a los que perteneces</li>
</ul>

<h3>¿Qué son los Grupos?</h3>
<p>Los grupos permiten que múltiples usuarios compartan acceso a archivos y recursos. Por ejemplo:</p>
<ul>
    <li>Grupo <code>developers</code> puede tener acceso a código fuente</li>
    <li>Grupo <code>students</code> puede acceder a materiales de clase</li>
    <li>Grupo <code>sudo</code> puede ejecutar comandos administrativos</li>
</ul>

<h3>Ejemplo de Salida de 'id'</h3>
<pre><code>uid=1000(usuario) gid=1000(usuario) groups=1000(usuario),27(sudo),44(video)</code></pre>
<p>Esto indica que el usuario tiene ID 1000 y pertenece a los grupos: usuario, sudo y video.</p>

<h3>Cambiar Propietario (Avanzado)</h3>
<p>Los comandos <code>chown</code> (change owner) y <code>chgrp</code> (change group) modifican propietarios, pero generalmente requieren privilegios de superusuario.</p>

<p>¡Descubramos tu identidad en el sistema!</p>
```

#### Elemento 7: Reto - Ver información de usuario
- **Tipo**: `reto`
- **Descripción**: Muestra tu nombre de usuario actual en el sistema.
- **Comandos válidos**: 
  - `whoami` - Muestra tu nombre de usuario actual
  - `id -un` - Muestra el nombre de usuario (user name) usando el comando id
- **Mensaje de retroalimentación**: "¡Correcto! El comando 'whoami' te dice qué usuario eres actualmente. Útil cuando trabajas con múltiples usuarios."

#### Elemento 8: Reto - Ver grupos del usuario
- **Tipo**: `reto`
- **Descripción**: Muestra todos los grupos a los que pertenece tu usuario actual.
- **Comandos válidos**: 
  - `groups` - Lista todos los grupos a los que perteneces
  - `id` - Muestra información completa (UID, GID y grupos)
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'groups' lista todos los grupos de tu usuario. Los grupos determinan qué recursos puedes acceder."

#### Elemento 9: Explicación - Permisos Numéricos en Detalle
- **Tipo**: `explicacion`
- **Título**: Dominando los Permisos Numéricos
- **Contenido**:
```html
<h2>El Sistema Octal de Permisos</h2>
<p>Los permisos numéricos son más rápidos de escribir una vez que entiendes el sistema.</p>

<h3>Tabla de Conversión</h3>
<table border="1" style="border-collapse: collapse; width: 100%; color: white;">
    <tr style="background: rgba(255, 193, 7, 0.2);">
        <th>Binario</th>
        <th>Octal</th>
        <th>Permisos</th>
        <th>Significado</th>
    </tr>
    <tr><td>000</td><td>0</td><td>---</td><td>Sin permisos</td></tr>
    <tr><td>001</td><td>1</td><td>--x</td><td>Solo ejecución</td></tr>
    <tr><td>010</td><td>2</td><td>-w-</td><td>Solo escritura</td></tr>
    <tr><td>011</td><td>3</td><td>-wx</td><td>Escritura y ejecución</td></tr>
    <tr><td>100</td><td>4</td><td>r--</td><td>Solo lectura</td></tr>
    <tr><td>101</td><td>5</td><td>r-x</td><td>Lectura y ejecución</td></tr>
    <tr><td>110</td><td>6</td><td>rw-</td><td>Lectura y escritura</td></tr>
    <tr><td>111</td><td>7</td><td>rwx</td><td>Todos los permisos</td></tr>
</table>

<h3>Ejemplos Prácticos</h3>
<pre><code>chmod 755 script.sh
# 7 (rwx) = Usuario: leer, escribir, ejecutar
# 5 (r-x) = Grupo: leer, ejecutar
# 5 (r-x) = Otros: leer, ejecutar

chmod 644 documento.txt
# 6 (rw-) = Usuario: leer, escribir
# 4 (r--) = Grupo: solo leer
# 4 (r--) = Otros: solo leer

chmod 600 privado.txt
# 6 (rw-) = Usuario: leer, escribir
# 0 (---) = Grupo: sin permisos
# 0 (---) = Otros: sin permisos</code></pre>

<h3>Permisos Recomendados</h3>
<ul>
    <li><strong>Archivos de texto/código:</strong> 644 (rw-r--r--)</li>
    <li><strong>Scripts ejecutables:</strong> 755 (rwxr-xr-x)</li>
    <li><strong>Directorios:</strong> 755 (rwxr-xr-x)</li>
    <li><strong>Archivos privados:</strong> 600 (rw-------)</li>
</ul>

<p>¡Practiquemos cambiando permisos con números!</p>
```

#### Elemento 10: Reto - Cambiar permisos numéricos
- **Tipo**: `reto`
- **Descripción**: Cambia los permisos de 'nota.txt' a solo lectura y escritura para el propietario (600).
- **Comandos válidos**: 
  - `chmod 600 nota.txt` - Establece permisos rw------- (solo propietario)
  - `chmod 600 ./nota.txt` - Establece permisos 600 con ruta explícita
- **Mensaje de retroalimentación**: "¡Excelente! Los permisos numéricos: 6=rw- (lectura+escritura), 0=--- (sin permisos). El formato es: propietario-grupo-otros."

#### Elemento 11: Reto - Ver detalles con stat
- **Tipo**: `reto`
- **Descripción**: Usa el comando 'stat' para ver información detallada del archivo 'script.sh', incluyendo permisos en diferentes formatos.
- **Comandos válidos**: 
  - `stat script.sh` - Muestra información detallada del archivo (tamaño, permisos, fechas)
  - `stat ./script.sh` - Muestra estadísticas completas con ruta explícita
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'stat' muestra información completa: permisos (octal y simbólico), tamaño, bloques, inodo y fechas de acceso/modificación."

---

## Lección 4: Búsqueda y Filtrado de Archivos

### Información de la Lección
- **Título**: Búsqueda y Filtrado de Archivos
- **Objetivo**: Aprender a buscar archivos, buscar dentro de archivos y usar tuberías para combinar comandos

### Contenido de la Lección

#### Elemento 1: Explicación - El Poder de find y grep
- **Tipo**: `explicacion`
- **Título**: Buscando como un Profesional 🔍
- **Contenido**:
```html
<h2>¿Por qué Buscar en la Terminal?</h2>
<p>En sistemas con miles de archivos, las herramientas de búsqueda de Linux son increíblemente potentes y rápidas. Te permiten encontrar archivos por nombre, tipo, tamaño, fecha y contenido.</p>

<h3>El Comando find</h3>
<p>Busca archivos y directorios en el sistema de archivos basándose en criterios específicos.</p>
<pre><code>find [directorio] [criterios]</code></pre>

<h3>Criterios Comunes de find</h3>
<ul>
    <li><code>-name "patrón"</code> - Busca por nombre de archivo</li>
    <li><code>-type f</code> - Solo archivos regulares</li>
    <li><code>-type d</code> - Solo directorios</li>
    <li><code>-size +10M</code> - Archivos mayores a 10MB</li>
    <li><code>-mtime -7</code> - Modificados en los últimos 7 días</li>
</ul>

<h3>El Comando grep</h3>
<p>Busca patrones de texto <strong>dentro</strong> de archivos.</p>
<pre><code>grep "patrón" archivo(s)</code></pre>

<h3>Opciones Útiles de grep</h3>
<ul>
    <li><code>-r</code> o <code>-R</code> - Búsqueda recursiva en directorios</li>
    <li><code>-i</code> - Ignora mayúsculas/minúsculas</li>
    <li><code>-n</code> - Muestra números de línea</li>
    <li><code>-v</code> - Invierte la búsqueda (líneas que NO coinciden)</li>
</ul>

<h3>Diferencia Clave</h3>
<p><strong>find:</strong> Busca <em>archivos</em> por sus propiedades<br>
<strong>grep:</strong> Busca <em>texto</em> dentro de archivos</p>

<p>¡Empecemos a buscar!</p>
```

#### Elemento 2: Reto - Buscar archivos por nombre
- **Tipo**: `reto`
- **Descripción**: Usa el comando 'find' para buscar todos los archivos que terminen en '.txt' en el directorio actual y sus subdirectorios.
- **Comandos válidos**: 
  - `find . -name "*.txt"` - Busca archivos por patrón de nombre (* = comodín)
  - `find . -name '*.txt'` - Busca archivos .txt (con comillas simples)
  - `find -name "*.txt"` - Busca desde directorio actual (. implícito)
- **Mensaje de retroalimentación**: "¡Excelente! El comando 'find' es muy poderoso para buscar archivos. El punto '.' indica el directorio actual, y '-name' busca por nombre de archivo."

#### Elemento 3: Reto - Buscar archivos por tipo
- **Tipo**: `reto`
- **Descripción**: Busca solo directorios en el directorio actual usando find con la opción de tipo.
- **Comandos válidos**: 
  - `find . -type d` - Busca solo directorios (d = directory)
  - `find -type d` - Busca directorios desde ubicación actual
- **Mensaje de retroalimentación**: "¡Perfecto! La opción '-type d' filtra solo directorios. También puedes usar '-type f' para buscar solo archivos regulares."

#### Elemento 4: Explicación - Búsqueda de Contenido con grep
- **Tipo**: `explicacion`
- **Título**: Encontrando Texto con grep
- **Contenido**:
```html
<h2>grep: Global Regular Expression Print</h2>
<p>El comando <code>grep</code> es una de las herramientas más poderosas de Linux para buscar texto.</p>

<h3>Sintaxis Básica</h3>
<pre><code>grep "texto_a_buscar" archivo.txt
grep "texto" archivo1.txt archivo2.txt
grep "texto" *.txt</code></pre>

<h3>Búsqueda Recursiva</h3>
<p>Para buscar en todos los archivos de un directorio y subdirectorios:</p>
<pre><code>grep -r "texto" directorio/</code></pre>

<h3>Casos de Uso Comunes</h3>
<pre><code># Buscar "error" en logs
grep "error" /var/log/app.log

# Buscar ignorando mayúsculas
grep -i "linux" documento.txt

# Mostrar líneas con números
grep -n "función" codigo.js

# Buscar en todos los archivos Python
grep "import" *.py</code></pre>

<h3>Expresiones Regulares</h3>
<p>grep soporta patrones avanzados:</p>
<ul>
    <li><code>.</code> - Cualquier carácter</li>
    <li><code>*</code> - Cero o más del anterior</li>
    <li><code>^</code> - Inicio de línea</li>
    <li><code>$</code> - Final de línea</li>
    <li><code>[abc]</code> - Cualquiera de a, b, o c</li>
</ul>

<h3>Combinando find y grep</h3>
<pre><code># Buscar "TODO" en todos los archivos .js
find . -name "*.js" -exec grep "TODO" {} \;</code></pre>

<p>¡Practiquemos buscando texto!</p>
```

#### Elemento 5: Reto - Buscar texto dentro de archivos
- **Tipo**: `reto`
- **Descripción**: Busca la palabra 'Linux' dentro de todos los archivos .txt del directorio actual usando grep.
- **Comandos válidos**: 
  - `grep "Linux" *.txt` - Busca texto en archivos (* = todos los .txt)
  - `grep 'Linux' *.txt` - Busca patrón usando comillas simples
  - `grep Linux *.txt` - Busca palabra sin comillas (funciona si no hay espacios)
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'grep' busca patrones de texto dentro de archivos. Es esencial para encontrar contenido específico."

#### Elemento 6: Reto - Buscar de forma recursiva
- **Tipo**: `reto`
- **Descripción**: Busca la palabra 'Hola' en todos los archivos del directorio actual y subdirectorios usando grep con la opción recursiva.
- **Comandos válidos**: 
  - `grep -r "Hola" .` - Busca recursivamente en todos los archivos
  - `grep -r 'Hola' .` - Búsqueda recursiva con comillas simples
  - `grep -R "Hola" .` - Búsqueda recursiva (R mayúscula, sigue links simbólicos)
- **Mensaje de retroalimentación**: "¡Correcto! La opción '-r' o '-R' hace que grep busque recursivamente en todos los subdirectorios."

#### Elemento 7: Explicación - Tuberías y Procesamiento de Texto
- **Tipo**: `explicacion`
- **Título**: El Poder de las Tuberías (Pipes) |
- **Contenido**:
```html
<h2>Filosofía Unix: Hacer Una Cosa Bien</h2>
<p>Linux sigue la filosofía de tener muchas herramientas pequeñas que hacen una cosa bien. Las <strong>tuberías</strong> (pipes) conectan estas herramientas para crear flujos de trabajo poderosos.</p>

<h3>El Operador | (Pipe)</h3>
<p>El símbolo <code>|</code> toma la salida de un comando y la usa como entrada del siguiente:</p>
<pre><code>comando1 | comando2 | comando3</code></pre>

<h3>Comandos de Procesamiento de Texto</h3>
<ul>
    <li><code>wc</code> - Cuenta líneas, palabras y caracteres</li>
    <li><code>sort</code> - Ordena líneas alfabética o numéricamente</li>
    <li><code>uniq</code> - Elimina líneas duplicadas consecutivas</li>
    <li><code>head</code> - Muestra las primeras N líneas</li>
    <li><code>tail</code> - Muestra las últimas N líneas</li>
    <li><code>cut</code> - Extrae columnas de texto</li>
    <li><code>tr</code> - Traduce o elimina caracteres</li>
</ul>

<h3>Ejemplos Prácticos</h3>
<pre><code># Contar archivos en directorio
ls | wc -l

# Ver los 5 archivos más grandes
ls -lS | head -6

# Encontrar y contar archivos .txt
find . -name "*.txt" | wc -l

# Usuarios únicos en un log
cat access.log | cut -d' ' -f1 | sort | uniq

# Líneas que contienen "error", ordenadas
grep "error" app.log | sort</code></pre>

<h3>Ventajas de las Tuberías</h3>
<ul>
    <li>Procesan datos eficientemente sin archivos temporales</li>
    <li>Combinan comandos simples para tareas complejas</li>
    <li>Funcionan con flujos de datos de cualquier tamaño</li>
</ul>

<p><strong>Tip Pro:</strong> Construye tus tuberías paso a paso, probando cada comando antes de añadir el siguiente.</p>

<p>¡Combinemos comandos con tuberías!</p>
```

#### Elemento 8: Reto - Contar líneas de un archivo
- **Tipo**: `reto`
- **Descripción**: Usa el comando 'wc' para contar cuántas líneas tiene el archivo 'nota.txt'.
- **Comandos válidos**: 
  - `wc -l nota.txt` - Cuenta número de líneas (word count -lines)
  - `wc -l ./nota.txt` - Cuenta líneas con ruta explícita
- **Mensaje de retroalimentación**: "¡Bien hecho! El comando 'wc' (word count) cuenta líneas (-l), palabras (-w) o caracteres (-c) en archivos."

#### Elemento 9: Reto - Usar tuberías para combinar comandos
- **Tipo**: `reto`
- **Descripción**: Lista todos los archivos del directorio actual y cuenta cuántas líneas devuelve usando el operador pipe '|'.
- **Comandos válidos**: 
  - `ls | wc -l` - Lista archivos y cuenta cuántos hay (pipe/tubería)
  - `ls -1 | wc -l` - Lista uno por línea y cuenta (más preciso)
- **Mensaje de retroalimentación**: "¡Excelente! El operador '|' (pipe) conecta la salida de un comando con la entrada de otro. Es una de las características más poderosas de Linux."

#### Elemento 10: Reto - Ordenar resultados
- **Tipo**: `reto`
- **Descripción**: Lista los archivos del directorio actual y ordénalos alfabéticamente usando 'sort'.
- **Comandos válidos**: 
  - `ls | sort` - Lista archivos y los ordena alfabéticamente
  - `ls -1 | sort` - Lista uno por línea y ordena
- **Mensaje de retroalimentación**: "¡Perfecto! El comando 'sort' ordena líneas de texto. Puedes usar '-r' para orden inverso o '-n' para orden numérico."

#### Elemento 11: Reto - Filtrar y mostrar las primeras líneas
- **Tipo**: `reto`
- **Descripción**: Muestra solo las primeras 5 líneas del resultado de listar archivos usando el comando 'head'.
- **Comandos válidos**: 
  - `ls | head -5` - Muestra solo las primeras 5 líneas
  - `ls | head -n 5` - Muestra primeras 5 líneas (formato explícito)
  - `ls -1 | head -5` - Lista uno por línea, muestra primeras 5
- **Mensaje de retroalimentación**: "¡Muy bien! El comando 'head' muestra las primeras líneas de un archivo o salida. Para ver las últimas líneas, usa 'tail'."

#### Elemento 12: Explicación - Búsquedas Avanzadas
- **Tipo**: `explicacion`
- **Título**: Técnicas Avanzadas de Búsqueda
- **Contenido**:
```html
<h2>Búsquedas por Fecha y Tamaño</h2>
<p>El comando <code>find</code> puede buscar archivos basándose en muchos más criterios que solo el nombre.</p>

<h3>Búsqueda por Tiempo de Modificación</h3>
<pre><code># Archivos modificados en las últimas 24 horas
find . -mtime -1

# Archivos modificados hace más de 30 días
find . -mtime +30

# Archivos modificados exactamente hace 7 días
find . -mtime 7</code></pre>

<h3>Búsqueda por Tamaño</h3>
<pre><code># Archivos mayores a 100MB
find . -size +100M

# Archivos menores a 1KB
find . -size -1k

# Archivos vacíos
find . -empty</code></pre>

<h3>Búsqueda por Permisos</h3>
<pre><code># Archivos ejecutables
find . -perm /u+x

# Archivos con permisos 644
find . -perm 644</code></pre>

<h3>Combinando Criterios</h3>
<p>Usa operadores lógicos para búsquedas complejas:</p>
<pre><code># Archivos .txt mayores a 1MB modificados hoy
find . -name "*.txt" -size +1M -mtime -1

# Archivos .log O .txt
find . \( -name "*.log" -o -name "*.txt" \)

# Archivos .sh que NO estén en carpeta tests
find . -name "*.sh" ! -path "*/tests/*"</code></pre>

<h3>Ejecutar Acciones sobre Resultados</h3>
<pre><code># Eliminar archivos .tmp
find . -name "*.tmp" -delete

# Cambiar permisos de todos los .sh
find . -name "*.sh" -exec chmod +x {} \;

# Copiar todos los .pdf a un directorio
find . -name "*.pdf" -exec cp {} /destino/ \;</code></pre>

<p><strong>Precaución:</strong> Ten mucho cuidado al usar <code>-delete</code> o <code>-exec rm</code>. Verifica los resultados con un simple <code>find</code> primero.</p>

<p>¡Última práctica con búsquedas avanzadas!</p>
```

#### Elemento 13: Reto - Buscar archivos modificados recientemente
- **Tipo**: `reto`
- **Descripción**: Busca archivos que se hayan modificado en las últimas 24 horas (1 día) usando find.
- **Comandos válidos**: 
  - `find . -mtime -1` - Busca archivos modificados en últimas 24 horas
  - `find -mtime -1` - Busca modificados recientemente (. implícito)
- **Mensaje de retroalimentación**: "¡Excelente! La opción '-mtime -1' encuentra archivos modificados en el último día. Es útil para encontrar cambios recientes en tu sistema."

---

## Resumen para Implementación

### Estadísticas por Lección

**Lección 1:** 11 elementos (4 explicaciones + 7 retos)
- Explicaciones: Bienvenida, Sistema de Archivos, Primer Directorio, Herramientas de Ayuda
- Retos: pwd, ls, mkdir, cd, cd .., clear, man

**Lección 2:** 12 elementos (4 explicaciones + 8 retos)
- Explicaciones: Archivos, Copiar vs Mover, Directorios Anidados, Eliminación Segura
- Retos: touch, echo >, cat, cp, mv, mkdir -p, rm, rmdir

**Lección 3:** 11 elementos (4 explicaciones + 7 retos)
- Explicaciones: Sistema de Permisos, chmod, Usuarios y Grupos, Permisos Numéricos
- Retos: ls -l, touch script, chmod +x, whoami, groups, chmod 600, stat

**Lección 4:** 13 elementos (4 explicaciones + 9 retos)
- Explicaciones: find y grep, grep Avanzado, Tuberías, Búsquedas Avanzadas
- Retos: find nombre, find tipo, grep, grep -r, wc, pipes, sort, head, find -mtime

**Total:** 47 elementos (16 explicaciones + 31 retos)

### Notas de Implementación

1. **Campo `tipo` en DB:**
   - `"explicacion"` para contenido educativo
   - `"reto"` para desafíos interactivos

2. **Campo `contenido` en DB:**
   - Para tipo `"explicacion"`: HTML formateado con la explicación completa
   - Para tipo `"reto"`: NULL o vacío

3. **Campo `comandos`:**
   - Solo necesario para tipo `"reto"`
   - Para tipo `"explicacion"`: array vacío

4. **Progreso:**
   - Cada elemento (explicación o reto) cuenta igual
   - Lección 1: ~9% por elemento
   - Lección 2: ~8.3% por elemento
   - Lección 3: ~9% por elemento
   - Lección 4: ~7.7% por elemento
