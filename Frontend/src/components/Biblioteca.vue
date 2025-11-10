<script>
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'

export default {
    name: 'Biblioteca',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter()

        const goInicio = () => router.push('/dashboard')
        const goBiblioteca = () => router.push('/biblioteca')
        const goRanking = () => router.push('/ranking')
        const goConfig = () => router.push('/configuracion')

        return {
            goInicio,
            goBiblioteca,
            goRanking,
            goConfig
        }
    },
    data() {
        return {
            descripciones: {
                ls: "Muestra el contenido de un directorio.",
                pwd: "Muestra el directorio actual del archivo.",
                cd: "Cambia el directorio de trabajo.",
                echo: "Muestra un mensaje o valor de variable.",
                clear: "Limpia la pantalla del terminal.",
                touch: "Crea un archivo vacío.",
                mkdir: "Crea un nuevo directorio.",
                rm: "Elimina archivos.",
                rmdir: "Elimina directorios vacíos.",
                cp: "Copia archivos o directorios.",
                mv: "Mueve o renombra archivos o directorios.",
                cat: "Muestra el contenido de un archivo.",
                nano: "Editor de texto en línea de comandos.",
                grep: "Busca texto dentro de archivos.",
                sudo: "Ejecuta comandos con privilegios de superusuario.",
                chmod: "Cambia los permisos de archivos o directorios."
            }
        }
    },
    methods: {
        toggleDescripcion(comando, event) {
            const row = event.target.closest('tr');
            const table = event.target.closest('table');

            // Si ya existe una descripción justo después, la eliminamos (cerrar)
            if (row.nextElementSibling && row.nextElementSibling.classList.contains('descripcion')) {
                row.nextElementSibling.remove();
                return;
            }

            // Remover cualquier otra descripción abierta
            table.querySelectorAll('.descripcion').forEach(r => r.remove());

            // Crear nueva descripción
            const descRow = document.createElement('tr');
            descRow.className = 'descripcion';
            const descCell = document.createElement('td');
            descCell.colSpan = 1; // Una sola columna ahora
            descCell.textContent = this.descripciones[comando] || 'Descripción no disponible.';
            descRow.appendChild(descCell);
            row.insertAdjacentElement('afterend', descRow);
        }
    }
}
</script>

<template>
    <div class="biblioteca">
        <Header />

        <div class="modulos">
            <div class="tablas-container">
                <div class="comandos-basicos">
                    <table>
                        <thead>
                            <tr>
                                <th class="titulo">Comandos básicos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td @click="toggleDescripcion('ls', $event)">→ ls</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('pwd', $event)">→ pwd</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('cd', $event)">→ cd</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('echo', $event)">→ echo</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('clear', $event)">→ clear</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('cat', $event)">→ cat</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('nano', $event)">→ nano</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('grep', $event)">→ grep</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('sudo', $event)">→ sudo</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('chmod', $event)">→ chmod</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="archivos-y-directorios">
                    <table>
                        <thead>
                            <tr>
                                <th class="titulo">Archivos y directorios</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td @click="toggleDescripcion('touch', $event)">→ touch</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('mkdir', $event)">→ mkdir</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('rm', $event)">→ rm</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('rmdir', $event)">→ rmdir</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('cp', $event)">→ cp</td>
                            </tr>
                            <tr>
                                <td @click="toggleDescripcion('mv', $event)">→ mv</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bloqueados">
                <div class="permisos">Permisos
                    <span class="permiso">Aún no disponible</span>
                </div>
                <div class="procesos">Procesos y señales
                    <span class="proceso">Aún no disponible</span>
                </div>
            </div>
        </div>
        <Footer :goInicio="() => $router.push('/dashboard')" :goBiblioteca="() => $router.push('/biblioteca')"
            :goRanking="() => $router.push('/ranking')" :goConfig="() => $router.push('/configuracion')" />
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.biblioteca {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}


.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: bold;
}

.logo img {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.brand {
    font-size: 22px;
    font-weight: bold;
    color: white;
}

.modulos {
    padding: 18px 10px 120px;
}

.tablas-container {
    display: flex;
    gap: 200px;
    justify-content: center;
    align-items: flex-start;
    margin: 20px auto;
    max-width: 1200px;
}

.comandos-basicos,
.archivos-y-directorios {
    flex: 1;
    min-width: 300px;
    background: rgba(19, 4, 59, 0.1);
    border-radius: 16px;
    padding: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

table {
    width: 100%;
    margin: 0;
    border-collapse: separate;
    border-spacing: 3px;
    /* background: transparent; */
    border-radius: 12px;
    /* overflow: hidden; */
}

th {
    font-size: 18px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    padding: 15px;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
}

td {
    padding: 14px 20px;
    color: #fff;
    font-weight: 500;
    font-size: 14px;
    background: rgba(139, 156, 241, 0.85);
    transition: all 0.2s ease;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}



td:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(2px);
    box-shadow: inset 4px 0 0 rgba(255, 255, 255, 0.6);
}

tbody tr:nth-child(even) td {
    background: rgba(139, 156, 241, 0.6);
}

tbody tr:nth-child(odd) td {
    background: rgba(139, 156, 241, 0.8);
}

tr.descripcion {
    display: table-row !important;
    gap: 0 !important;
    margin-bottom: 8px;
}

tr.descripcion td {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
    color: white;
    font-style: italic;
    font-weight: normal;
    padding: 15px;
    border-left: 4px solid #2E7D32;
    border-radius: 8px;
    margin-top: 4px;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.bloqueados {
    display: flex;
    justify-content: space-around;
    margin: 40px auto;
    width: 63%;
    gap: 250px;
}

.permisos,
.procesos {
    flex: 1;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.permisos::after,
.procesos::after {
    content: "🔒";
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 18px;
}

.permiso,
.proceso {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.8);
}

.footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(15px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    position: fixed;
    bottom: 0;
    width: 100%;
}

.footer button {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    gap: 6px;
}

.footer button img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.footer .barra-inicio button img {
    width: 45px;
    height: 45px;
    object-fit: contain;
}

@media (max-width: 768px) {
    .biblioteca {
        font-size: 14px;
    }

    .header {
        padding: 12px 15px;
        min-height: 60px;
    }

    .logo img {
        width: 30px;
        height: 30px;
    }

    .brand {
        font-size: 18px;
    }

    .modulos {
        padding: 15px 5px 120px;
    }

    .tablas-container {
        flex-direction: column;
        gap: 15px;
        margin: 15px auto;
        max-width: 95%;
        padding: 15px 10px;
    }

    .comandos-basicos,
    .archivos-y-directorios {
        min-width: auto;
        width: 100%;
    }

    table {
        font-size: 13px;
    }

    th {
        font-size: 16px;
        padding: 12px;
    }

    td {
        padding: 10px 15px;
        font-size: 13px;
    }

    tr.descripcion td {
        padding: 12px;
        font-size: 12px;
    }

    .bloqueados {
        flex-direction: column;
        width: 95%;
        gap: 15px;
        margin: 15px auto;
    }

    .permisos,
    .procesos {
        padding: 15px;
        font-size: 14px;
    }

    .footer {
        padding: 10px 15px;
    }

    .footer button {
        font-size: 11px;
        gap: 4px;
    }

    .footer button img {
        width: 24px;
        height: 24px;
    }

    .footer .barra-inicio button img {
        width: 32px;
        height: 32px;
    }
}
</style>