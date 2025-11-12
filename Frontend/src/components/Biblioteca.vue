<script>
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { API_URL } from '../config/api'

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
            isLoading: false,
            error: '',
            commands: [],
            openCommandId: null,
        }
    },
    mounted() {
        this.fetchCommands()
    },
    methods: {
        async fetchCommands() {
            this.isLoading = true
            this.error = ''
            try {
                const res = await fetch(`${API_URL}/commands`, {
                    headers: { 'Content-Type': 'application/json' }
                })
                if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
                const data = await res.json()
                // Mapear resultados del backend al formato usado en la UI
                this.commands = (Array.isArray(data) ? data : []).map((d, i) => ({
                    id: d.id ?? d.id_Comando ?? `${d.comando}-${i}`,
                    comando: d.comando,
                    descripcion: d.descripcion || ''
                })).sort((a, b) => a.comando.localeCompare(b.comando))
            } catch (err) {
                console.error('Error cargando comandos:', err)
                this.error = 'No se pudieron cargar los comandos.'
                this.commands = []
            } finally {
                this.isLoading = false
            }
        },
        toggleDescripcion(cmd) {
            this.openCommandId = this.openCommandId === cmd.id ? null : cmd.id
        },
        
    }
}
</script>

<template>
    <div class="biblioteca">
        <Header />

        <div class="modulos">
            <div class="tablas-container">
                <div class="comandos-basicos" style="flex: 1 1 100%; max-width: 700px;">
                    <table>
                        <thead>
                            <tr>
                                <th class="titulo">Biblioteca de comandos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="isLoading || error">
                                <td>
                                    <span v-if="isLoading">Cargando comandos...</span>
                                    <span v-else>{{ error }}</span>
                                </td>
                            </tr>
                            <template v-for="cmd in commands" :key="cmd.id">
                                <tr>
                                    <td @click="toggleDescripcion(cmd)">→ {{ cmd.comando }}</td>
                                </tr>
                                <tr v-if="openCommandId === cmd.id" class="descripcion">
                                    <td>
                                        <div class="desc-wrapper">
                                            <div class="desc-header">
                                                <strong class="cmd-label">{{ cmd.comando }}</strong>
                                            </div>
                                            <p class="desc-text" v-if="cmd.descripcion && cmd.descripcion.trim()">{{ cmd.descripcion }}</p>
                                            <p class="desc-text muted" v-else>Descripción no disponible.</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <tr v-if="!isLoading && commands.length === 0 && !error">
                                <td>No hay comandos disponibles.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Se removieron las tarjetas de lecciones por defecto (Permisos / Procesos y señales) -->
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
    position: relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%) !important;
    color: #f7f9ff;
    padding: 0;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255,255,255,0.04);
    animation: fadeInDesc 180ms ease-out;
}

/* Se retiró el emoji del indicador informativo */

tr.descripcion td::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    border-radius: 12px 0 0 12px;
    background: linear-gradient(180deg, #7c3aed 0%, #60a5fa 100%);
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.45);
}

@keyframes fadeInDesc {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.desc-wrapper {
    position: relative;
    padding: 16px 16px 16px 52px;
}

.desc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
}

.cmd-label {
    color: #eaf0ff;
    font-weight: 700;
    letter-spacing: 0.2px;
}

.desc-actions {
    display: flex;
    gap: 8px;
}

.desc-btn {
    background: rgba(255,255,255,0.12);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.desc-btn:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.35);
}

.desc-btn.close {
    padding: 4px 10px;
    font-size: 16px;
    line-height: 1;
}

.desc-text {
    color: #f3f6ff;
    line-height: 1.55;
}

.desc-text.muted {
    color: rgba(255,255,255,0.75);
}

/* Se elimina el estilo de las tarjetas de lecciones por defecto */

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
        padding: 8px 10px;
        font-size: 12px;
    }

    .desc-wrapper {
        padding: 10px 12px 10px 32px;
    }

    .desc-header {
        gap: 8px;
        margin-bottom: 6px;
    }

    .cmd-label {
        font-size: 13px;
    }

    .desc-text {
        font-size: 12px;
        line-height: 1.45;
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