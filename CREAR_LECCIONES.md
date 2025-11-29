# 📚 Comandos para Crear las 6 Lecciones de PenguinPath

## 🎯 Instrucciones
1. Inicia sesión en https://penguinpath.online
2. Abre la consola del navegador (F12)
3. Copia y pega el siguiente código completo
4. Presiona Enter y espera a que se creen todas las lecciones

---

## 🚀 Código Completo para Crear Todas las Lecciones

```javascript
// Script completo para crear las 6 lecciones de PenguinPath
const crearTodasLasLecciones = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No hay token. Por favor inicia sesión primero.');
    return;
  }

  const lecciones = [
    // LECCIÓN 1: Introducción a la Terminal Linux
    {
      titulo: "Introducción a la Terminal Linux",
      experiencia: 100,
      retos: [
        {
          tipo: "explicacion",
          descripcion: "Bienvenido a la Terminal de Linux",
          contenido: "La terminal de Linux es una interfaz de línea de comandos que te permite interactuar con el sistema operativo mediante texto. Es una herramienta poderosa que te da control total sobre tu sistema."
        },
        {
          tipo: "reto",
          descripcion: "Muestra el directorio actual con pwd",
          Retroalimentacion: "¡Excelente! El comando pwd (print working directory) muestra la ruta completa del directorio en el que te encuentras actualmente.",
          comandos: [
            {
              comando: "pwd",
              descripcion: "Muestra la ruta del directorio actual"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Lista los archivos del directorio actual",
          Retroalimentacion: "¡Muy bien! El comando ls lista todos los archivos y directorios en tu ubicación actual.",
          comandos: [
            {
              comando: "ls",
              descripcion: "Lista archivos y directorios"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Cambia al directorio home con cd",
          Retroalimentacion: "¡Perfecto! El comando cd (change directory) te permite moverte entre directorios. El símbolo ~ representa tu directorio home.",
          comandos: [
            {
              comando: "cd ~",
              descripcion: "Cambia al directorio home"
            },
            {
              comando: "cd",
              descripcion: "También lleva al directorio home"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Opciones Avanzadas de ls",
          contenido: "El comando ls tiene muchas opciones útiles. Con -l obtienes una lista detallada, -a muestra archivos ocultos, y -h hace que los tamaños sean más legibles para humanos."
        },
        {
          tipo: "reto",
          descripcion: "Lista archivos incluyendo los ocultos",
          Retroalimentacion: "¡Genial! Con ls -a puedes ver archivos ocultos que comienzan con punto (.) como .bashrc o .config",
          comandos: [
            {
              comando: "ls -a",
              descripcion: "Lista todos los archivos incluyendo ocultos"
            }
          ]
        }
      ]
    },

    // LECCIÓN 2: Navegación y Gestión de Archivos
    {
      titulo: "Navegación y Gestión de Archivos",
      experiencia: 120,
      retos: [
        {
          tipo: "explicacion",
          descripcion: "Gestión del Sistema de Archivos",
          contenido: "Linux organiza todo en una estructura de directorios jerárquica que comienza en la raíz (/). Aprenderás a crear, mover, copiar y eliminar archivos y directorios de manera eficiente."
        },
        {
          tipo: "reto",
          descripcion: "Crea un nuevo directorio llamado 'proyectos'",
          Retroalimentacion: "¡Excelente! mkdir (make directory) crea nuevos directorios. Puedes crear múltiples niveles con mkdir -p ruta/completa/directorio",
          comandos: [
            {
              comando: "mkdir proyectos",
              descripcion: "Crea un directorio llamado proyectos"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Crea un archivo vacío llamado 'notas.txt'",
          Retroalimentacion: "¡Bien hecho! touch crea archivos vacíos o actualiza la fecha de modificación de archivos existentes.",
          comandos: [
            {
              comando: "touch notas.txt",
              descripcion: "Crea un archivo vacío"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Copia el archivo notas.txt a notas_backup.txt",
          Retroalimentacion: "¡Perfecto! cp (copy) duplica archivos. Para directorios usa cp -r para copiar recursivamente.",
          comandos: [
            {
              comando: "cp notas.txt notas_backup.txt",
              descripcion: "Copia un archivo"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Mueve notas_backup.txt al directorio proyectos",
          Retroalimentacion: "¡Genial! mv (move) mueve archivos o directorios. También se usa para renombrar: mv antiguo.txt nuevo.txt",
          comandos: [
            {
              comando: "mv notas_backup.txt proyectos/",
              descripcion: "Mueve un archivo a otro directorio"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Eliminación Segura de Archivos",
          contenido: "rm elimina archivos permanentemente. Usa -i para confirmación interactiva, -r para directorios y ten mucho cuidado con rm -rf que elimina recursivamente sin preguntar."
        },
        {
          tipo: "reto",
          descripcion: "Elimina el archivo notas.txt",
          Retroalimentacion: "¡Correcto! rm elimina archivos. Recuerda que en Linux no hay papelera de reciclaje por defecto, los archivos se eliminan permanentemente.",
          comandos: [
            {
              comando: "rm notas.txt",
              descripcion: "Elimina un archivo"
            }
          ]
        }
      ]
    },

    // LECCIÓN 3: Permisos y Usuarios
    {
      titulo: "Permisos y Usuarios en Linux",
      experiencia: 150,
      retos: [
        {
          tipo: "explicacion",
          descripcion: "Sistema de Permisos de Linux",
          contenido: "Linux usa un sistema de permisos basado en tres grupos: propietario (u), grupo (g) y otros (o). Cada uno puede tener permisos de lectura (r), escritura (w) y ejecución (x). Esto proporciona un control granular sobre quién puede hacer qué con cada archivo."
        },
        {
          tipo: "reto",
          descripcion: "Muestra los permisos detallados de los archivos",
          Retroalimentacion: "¡Perfecto! ls -l muestra permisos en formato rwxrwxrwx, donde los primeros 3 son del propietario, los siguientes 3 del grupo y los últimos 3 de otros usuarios.",
          comandos: [
            {
              comando: "ls -l",
              descripcion: "Lista con permisos detallados"
            },
            {
              comando: "ls -la",
              descripcion: "Lista con permisos incluyendo ocultos"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Crea un archivo script.sh y hazlo ejecutable",
          Retroalimentacion: "¡Excelente! chmod +x añade permisos de ejecución. También puedes usar notación octal como chmod 755 para rwxr-xr-x",
          comandos: [
            {
              comando: "touch script.sh && chmod +x script.sh",
              descripcion: "Crea archivo y lo hace ejecutable"
            },
            {
              comando: "touch script.sh; chmod +x script.sh",
              descripcion: "Versión alternativa con punto y coma"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Notación Octal de Permisos",
          contenido: "Los permisos también se pueden expresar en números: r=4, w=2, x=1. Así, rwx=7, rw-=6, r-x=5. Por ejemplo, chmod 755 archivo.sh significa rwxr-xr-x (propietario todo, grupo y otros lectura/ejecución)."
        },
        {
          tipo: "reto",
          descripcion: "Cambia permisos de un archivo a solo lectura para todos",
          Retroalimentacion: "¡Muy bien! chmod 444 establece permisos r--r--r--, haciéndolo solo lectura para todos. Útil para proteger archivos importantes.",
          comandos: [
            {
              comando: "touch readonly.txt && chmod 444 readonly.txt",
              descripcion: "Crea archivo de solo lectura"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Muestra tu nombre de usuario actual",
          Retroalimentacion: "¡Correcto! whoami muestra tu nombre de usuario actual. Es útil cuando trabajas con múltiples usuarios o sudo.",
          comandos: [
            {
              comando: "whoami",
              descripcion: "Muestra el usuario actual"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Cambio de Propietario",
          contenido: "chown cambia el propietario de archivos (requiere sudo). chgrp cambia el grupo. Sintaxis: sudo chown usuario:grupo archivo. Es fundamental para gestión multiusuario."
        }
      ]
    },

    // LECCIÓN 4: Búsqueda y Filtrado
    {
      titulo: "Búsqueda y Filtrado de Información",
      experiencia: 140,
      retos: [
        {
          tipo: "explicacion",
          descripcion: "Herramientas de Búsqueda en Linux",
          contenido: "Linux ofrece potentes herramientas para buscar archivos (find, locate) y contenido (grep). Estas herramientas son esenciales para navegar sistemas grandes y encontrar información específica rápidamente."
        },
        {
          tipo: "reto",
          descripcion: "Busca todos los archivos .txt en el directorio actual",
          Retroalimentacion: "¡Excelente! find con -name busca por nombre de archivo. Usa -iname para búsqueda insensible a mayúsculas. El punto (.) indica directorio actual.",
          comandos: [
            {
              comando: "find . -name '*.txt'",
              descripcion: "Busca archivos .txt recursivamente"
            },
            {
              comando: "find . -name *.txt",
              descripcion: "Versión sin comillas (funciona en algunos casos)"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Lista archivos ordenados por fecha de modificación",
          Retroalimentacion: "¡Perfecto! ls -lt ordena por tiempo de modificación (más recientes primero). Añade -r para orden inverso.",
          comandos: [
            {
              comando: "ls -lt",
              descripcion: "Lista ordenada por fecha (más reciente primero)"
            },
            {
              comando: "ls -ltr",
              descripcion: "Orden inverso (más antiguo primero)"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "El Poder de grep",
          contenido: "grep busca patrones de texto en archivos. Es extremadamente versátil: usa -i para ignorar mayúsculas, -r para buscar recursivamente, -n para mostrar números de línea, y -v para invertir la búsqueda."
        },
        {
          tipo: "reto",
          descripcion: "Busca la palabra 'error' en todos los archivos .log",
          Retroalimentacion: "¡Muy bien! grep con -r busca recursivamente. Perfecto para encontrar mensajes de error en logs. Combina con -i para ignorar mayúsculas/minúsculas.",
          comandos: [
            {
              comando: "grep -r 'error' *.log",
              descripcion: "Busca 'error' en archivos .log"
            },
            {
              comando: "grep -ri 'error' *.log",
              descripcion: "Búsqueda insensible a mayúsculas"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Cuenta cuántas líneas tiene un archivo",
          Retroalimentacion: "¡Genial! wc -l cuenta líneas. wc sin opciones muestra líneas, palabras y bytes. Úsalo con cat archivo | wc -l o directamente wc -l archivo.",
          comandos: [
            {
              comando: "wc -l /etc/hosts",
              descripcion: "Cuenta líneas de un archivo"
            },
            {
              comando: "cat /etc/hosts | wc -l",
              descripcion: "Versión alternativa con pipe"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Pipes y Redirección",
          contenido: "El pipe (|) conecta la salida de un comando con la entrada de otro. La redirección (>, >>) guarda salida en archivos. Estas herramientas permiten crear flujos de procesamiento de datos complejos."
        },
        {
          tipo: "reto",
          descripcion: "Lista archivos y guarda el resultado en listado.txt",
          Retroalimentacion: "¡Perfecto! > redirige la salida a un archivo (sobrescribe). Usa >> para añadir al final sin borrar el contenido existente.",
          comandos: [
            {
              comando: "ls -la > listado.txt",
              descripcion: "Guarda listado en archivo"
            },
            {
              comando: "ls -la >> listado.txt",
              descripcion: "Añade al final del archivo"
            }
          ]
        }
      ]
    },

    // LECCIÓN 5: Administración de Procesos y Servicios
    {
      titulo: "Administración de Procesos y Servicios",
      experiencia: 160,
      retos: [
        {
          tipo: "explicacion",
          descripcion: "Gestión de Procesos en Linux",
          contenido: "Un proceso es un programa en ejecución. Linux permite ver, controlar y gestionar procesos en tiempo real. Cada proceso tiene un PID (Process ID) único y puede estar en diferentes estados: ejecutándose, durmiendo, detenido o zombie."
        },
        {
          tipo: "reto",
          descripcion: "Muestra todos los procesos en ejecución",
          Retroalimentacion: "¡Excelente! ps aux muestra todos los procesos con detalles. 'a' = todos los usuarios, 'u' = formato orientado a usuario, 'x' = incluye procesos sin terminal.",
          comandos: [
            {
              comando: "ps aux",
              descripcion: "Lista todos los procesos del sistema"
            },
            {
              comando: "ps -ef",
              descripcion: "Versión alternativa con formato diferente"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Muestra procesos en tiempo real con top",
          Retroalimentacion: "¡Perfecto! top muestra procesos actualizándose en tiempo real. Presiona 'q' para salir, 'k' para matar procesos, 'M' para ordenar por memoria.",
          comandos: [
            {
              comando: "top",
              descripcion: "Monitor de procesos en tiempo real"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Señales de Procesos",
          contenido: "kill envía señales a procesos. Las más comunes: SIGTERM (15, terminación amable), SIGKILL (9, forzar terminación), SIGSTOP (19, pausar). Sintaxis: kill -SEÑAL PID"
        },
        {
          tipo: "reto",
          descripcion: "Busca procesos que contengan 'bash' en su nombre",
          Retroalimentacion: "¡Muy bien! pgrep busca procesos por nombre. Añade -l para ver el nombre completo, -u usuario para filtrar por usuario.",
          comandos: [
            {
              comando: "pgrep bash",
              descripcion: "Busca PIDs de procesos bash"
            },
            {
              comando: "pgrep -l bash",
              descripcion: "Muestra PID y nombre"
            },
            {
              comando: "ps aux | grep bash",
              descripcion: "Versión alternativa con grep"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Systemd y Servicios",
          contenido: "systemd es el sistema de init moderno en Linux. Gestiona servicios (daemons) que se ejecutan en segundo plano. Los servicios más comunes: ssh, nginx, apache, mysql, postgresql."
        },
        {
          tipo: "reto",
          descripcion: "Verifica el estado de un servicio con systemctl",
          Retroalimentacion: "¡Genial! systemctl status muestra el estado de servicios. Otros comandos útiles: start, stop, restart, enable (autoarranque), disable.",
          comandos: [
            {
              comando: "systemctl status ssh",
              descripcion: "Verifica estado del servicio SSH"
            },
            {
              comando: "systemctl status sshd",
              descripcion: "Nombre alternativo en algunas distribuciones"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Lista todos los servicios activos",
          Retroalimentacion: "¡Perfecto! systemctl list-units --type=service muestra todos los servicios y su estado. Añade --state=active para solo los activos.",
          comandos: [
            {
              comando: "systemctl list-units --type=service",
              descripcion: "Lista todos los servicios"
            },
            {
              comando: "systemctl list-units --type=service --state=active",
              descripcion: "Solo servicios activos"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Uso de Recursos del Sistema",
          contenido: "Es crucial monitorear el uso de CPU, memoria y disco para mantener el sistema saludable. Herramientas como free, df y du te ayudan a identificar problemas antes de que se vuelvan críticos."
        },
        {
          tipo: "reto",
          descripcion: "Muestra el uso de memoria del sistema",
          Retroalimentacion: "¡Excelente! free -h muestra memoria RAM y swap en formato legible. La memoria 'available' es la que realmente está disponible para aplicaciones.",
          comandos: [
            {
              comando: "free -h",
              descripcion: "Muestra uso de memoria en formato humano"
            },
            {
              comando: "free -m",
              descripcion: "Muestra en megabytes"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Verifica el espacio en disco",
          Retroalimentacion: "¡Muy bien! df -h muestra espacio usado y disponible en cada partición. Útil para prevenir problemas de espacio en disco.",
          comandos: [
            {
              comando: "df -h",
              descripcion: "Muestra espacio en disco en formato humano"
            },
            {
              comando: "df -h /",
              descripcion: "Solo para la partición raíz"
            }
          ]
        }
      ]
    },

    // LECCIÓN 6: Monitoreo del Sistema y Rendimiento
    {
      titulo: "Monitoreo del Sistema y Rendimiento",
      experiencia: 150,
      retos: [
        {
          tipo: "explicacion",
          descripcion: "Introducción al Monitoreo del Sistema",
          contenido: "El monitoreo del sistema es fundamental para mantener un servidor Linux funcionando de manera óptima. Aprenderás a usar herramientas como htop, iostat, vmstat y sar para analizar el rendimiento del sistema."
        },
        {
          tipo: "reto",
          descripcion: "Ver procesos en tiempo real con htop",
          Retroalimentacion: "¡Excelente! htop es una herramienta interactiva que muestra procesos, uso de CPU y memoria en tiempo real con una interfaz más amigable que top.",
          comandos: [
            {
              comando: "htop",
              descripcion: "Muestra procesos activos con interfaz interactiva"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Obtener estadísticas de CPU con vmstat",
          Retroalimentacion: "¡Bien hecho! vmstat muestra estadísticas de memoria virtual y CPU. Los números indican intervalo y repeticiones (1 segundo, 5 veces).",
          comandos: [
            {
              comando: "vmstat 1 5",
              descripcion: "Muestra estadísticas cada segundo por 5 veces"
            },
            {
              comando: "vmstat",
              descripcion: "Muestra estadísticas una sola vez"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Analizar estadísticas de disco con iostat",
          Retroalimentacion: "¡Perfecto! iostat muestra estadísticas de E/S de disco. La opción -x proporciona información extendida sobre cada dispositivo.",
          comandos: [
            {
              comando: "iostat -x 1 3",
              descripcion: "Estadísticas extendidas de I/O cada segundo"
            },
            {
              comando: "iostat",
              descripcion: "Estadísticas básicas de I/O"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Análisis de Memoria del Sistema",
          contenido: "La gestión de memoria es crucial para el rendimiento. Aprende a interpretar el uso de RAM, swap y cache del sistema para identificar cuellos de botella y problemas de rendimiento."
        },
        {
          tipo: "reto",
          descripcion: "Mostrar información detallada de memoria",
          Retroalimentacion: "¡Excelente! El comando free muestra memoria disponible y /proc/meminfo proporciona información detallada del kernel sobre el uso de memoria.",
          comandos: [
            {
              comando: "free -h",
              descripcion: "Muestra uso de memoria en formato legible"
            },
            {
              comando: "cat /proc/meminfo | head -10",
              descripcion: "Información detallada de memoria del kernel"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Identificar procesos que más memoria consumen",
          Retroalimentacion: "¡Muy bien! Este comando ordena los procesos por uso de memoria, útil para identificar aplicaciones que consumen muchos recursos.",
          comandos: [
            {
              comando: "ps aux --sort=-%mem | head -10",
              descripcion: "Top 10 procesos por uso de memoria"
            },
            {
              comando: "ps aux --sort=-%mem",
              descripcion: "Todos los procesos ordenados por memoria"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Monitoreo de Red",
          contenido: "El tráfico de red puede ser un indicador importante del rendimiento del sistema. Aprende a monitorear conexiones activas, puertos en escucha y estadísticas de interfaces de red."
        },
        {
          tipo: "reto",
          descripcion: "Mostrar conexiones y puertos de red activos",
          Retroalimentacion: "¡Perfecto! ss es la herramienta moderna para mostrar sockets de red, reemplazando netstat. -t=TCP, -u=UDP, -l=listening, -n=numérico.",
          comandos: [
            {
              comando: "ss -tuln",
              descripcion: "Muestra sockets TCP y UDP en escucha"
            },
            {
              comando: "ss -a",
              descripcion: "Muestra todos los sockets"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Ver estadísticas de tráfico por interfaz de red",
          Retroalimentacion: "¡Bien hecho! /proc/net/dev muestra estadísticas de bytes transmitidos y recibidos por cada interfaz de red.",
          comandos: [
            {
              comando: "cat /proc/net/dev",
              descripcion: "Estadísticas de tráfico por interfaz"
            },
            {
              comando: "ip -s link",
              descripcion: "Estadísticas de interfaces con ip"
            }
          ]
        },
        {
          tipo: "explicacion",
          descripcion: "Análisis de Logs del Sistema",
          contenido: "Los logs del sistema son esenciales para el diagnóstico de problemas. journalctl es la herramienta principal para consultar logs en sistemas con systemd, permitiendo filtrar por tiempo, prioridad y servicio."
        },
        {
          tipo: "reto",
          descripcion: "Seguir logs del sistema en tiempo real",
          Retroalimentacion: "¡Excelente! journalctl -f es similar a 'tail -f' pero para logs de systemd, muy útil para monitoreo en tiempo real de eventos del sistema.",
          comandos: [
            {
              comando: "journalctl -f",
              descripcion: "Sigue logs del sistema en tiempo real"
            },
            {
              comando: "journalctl --follow",
              descripcion: "Versión larga del comando anterior"
            }
          ]
        },
        {
          tipo: "reto",
          descripcion: "Buscar errores recientes en el sistema",
          Retroalimentacion: "¡Muy bien! Este comando filtra solo errores de la última hora, útil para diagnóstico rápido de problemas recientes en el sistema.",
          comandos: [
            {
              comando: "journalctl -p err --since '1 hour ago'",
              descripcion: "Errores de la última hora"
            },
            {
              comando: "journalctl -p err --since today",
              descripcion: "Errores del día actual"
            }
          ]
        }
      ]
    }
  ];

  // Función para esperar entre peticiones
  const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  console.log('🚀 Iniciando creación de lecciones...\n');

  for (let i = 0; i < lecciones.length; i++) {
    const leccion = lecciones[i];
    console.log(`📝 Creando Lección ${i + 1}: ${leccion.titulo}...`);

    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leccion)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Lección ${i + 1} creada exitosamente!`);
        console.log(`   - ID: ${result.id_Leccion}`);
        console.log(`   - Título: ${result.Titulo}`);
        console.log(`   - Retos: ${result.retos.length}\n`);
      } else {
        const errorText = await response.text();
        console.error(`❌ Error al crear Lección ${i + 1}:`, response.status);
        console.error(`   Detalles:`, errorText, '\n');
      }
    } catch (error) {
      console.error(`❌ Error de red al crear Lección ${i + 1}:`, error, '\n');
    }

    // Esperar 1 segundo entre cada lección para no saturar el servidor
    if (i < lecciones.length - 1) {
      await esperar(1000);
    }
  }

  console.log('🎉 ¡Proceso completado! Verifica las lecciones creadas.');
};

// Ejecutar la función
crearTodasLasLecciones();
```

---

## 📋 Notas Importantes

1. **Requisitos previos:**
   - Debes estar autenticado en la aplicación
   - Debes tener permisos de administrador
   - El backend debe estar en ejecución

2. **Tiempo estimado:** ~6 segundos (1 segundo por lección)

3. **Qué hace el script:**
   - Crea las 6 lecciones automáticamente
   - Cada lección incluye teoría, retos y comandos
   - Muestra el progreso en la consola
   - Maneja errores de forma elegante

4. **Si algo falla:**
   - Verifica que estés autenticado
   - Revisa la consola del navegador para ver errores específicos
   - Puedes ejecutar el script nuevamente (no creará duplicados si la lección ya existe)

---

## 🎯 Contenido de las Lecciones

1. **Lección 1:** Introducción a la Terminal (pwd, ls, cd)
2. **Lección 2:** Gestión de Archivos (mkdir, touch, cp, mv, rm)
3. **Lección 3:** Permisos y Usuarios (chmod, chown, whoami)
4. **Lección 4:** Búsqueda y Filtrado (find, grep, wc, redirección)
5. **Lección 5:** Procesos y Servicios (ps, top, systemctl, free, df)
6. **Lección 6:** Monitoreo del Sistema (htop, vmstat, iostat, journalctl)

---

## 🔄 Para recrear las lecciones

Si necesitas recrear las lecciones:

1. Elimina las lecciones existentes desde la base de datos
2. Ejecuta el script nuevamente
3. Verifica que todas se crearon correctamente en la interfaz

---

**¡Disfruta enseñando Linux con PenguinPath! 🐧✨**
