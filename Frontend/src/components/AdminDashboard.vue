<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'
import LessonService from '../services/LessonService'
import UserService from '../services/UserService'
import Modales from './Modales.vue'

const router = useRouter()

const activeTab = ref<'users' | 'lessons'>('users')
const searchTerm = ref('')
const selectedPage = ref('')

const navigateToPage = () => {
    if (!selectedPage.value) return
    if (selectedPage.value === 'admin') {
        router.push({ name: 'AdminDashboard' })
    } else if (selectedPage.value === 'dashboard') {
        router.push({ name: 'Dashboard' })
    }
    selectedPage.value = ''
}

// Control de modales con Modales.vue
const modalVisible = ref(false)
const modalType = ref<'usuario' | 'leccion' | 'eliminar'>('usuario')
const modalTitle = ref('')
const modalData = ref<any>({})
let currentContext: 'usuarios' | 'lecciones' = 'usuarios'
let currentItemId: number | null = null

const user = ref({
    username: '',
    correo: '',
    racha: 0,
    experiencia: 0,
    avatar: ''
})

const usuarios = ref<any[]>([])
const isLoadingUsers = ref(false)
const lecciones = ref<any[]>([])
const isLoadingLessons = ref(false)

const showAddLesson = ref(false)
const newLesson = ref<any>({
    title: '',
    experiencia: 100,
    challenges: [{
        tipo: 'reto',
        description: '',
        contenido: '',
        feedback: '',
        commands: [{ comando: '', descripcion: '' }]
    }]
})

const filteredUsuarios = computed(() => {
    return usuarios.value.filter(u =>
        u.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (u.correo && u.correo.toLowerCase().includes(searchTerm.value.toLowerCase()))
    )
})

const fetchUsers = async () => {
    isLoadingUsers.value = true
    try {
        const data: any = await UserService.getAll()
        const usersData = Array.isArray(data) ? data : []
        usuarios.value = usersData.map((u: any) => ({
            id: u.id_Usuario,
            nombre: u.username,
            username: u.username,
            email: u.correo,
            correo: u.correo,
            rol: u.rol === 'usuario' ? 'Estudiante' : (u.rol === 'admin' ? 'Administrador' : u.rol),
            experiencia: u.experiencia || 0,
            racha: u.racha || 0,
            avatar: u.avatar || getDefaultAvatar(u.username),
            estado: u.activo ? 'Activo' : 'Inactivo'
        }))
    } catch (error: any) {
        console.error('Error fetching users:', error)
        alert(error.message || 'Error al cargar usuarios')
        usuarios.value = []
    } finally {
        isLoadingUsers.value = false
    }
}

const fetchLessons = async () => {
    isLoadingLessons.value = true
    try {
        const data: any = await LessonService.getAll()
        console.log('Lecciones recibidas de la API:', data)

        lecciones.value = data.map((leccion: any) => ({
            id: leccion.id_Leccion,
            titulo: leccion.Titulo,
            descripcion: 'Descripción de ' + leccion.Titulo
        }))

        console.log('Lecciones mapeadas:', lecciones.value)
    } catch (error: any) {
        console.error('Error fetching lessons:', error)
        alert(error.message || 'Error al cargar lecciones')
        lecciones.value = []
    } finally {
        isLoadingLessons.value = false
    }
}

onMounted(async () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        const parsed = JSON.parse(storedUser)
        user.value.username = parsed.username
        user.value.correo = parsed.correo
        user.value.racha = parsed.racha || 0
        user.value.experiencia = parsed.experiencia || 0
        user.value.avatar = parsed.avatar
    }

    await fetchUsers()
    await fetchLessons()
})

const getDefaultAvatar = (username: string) => {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE']
    const colorIndex = username.length % colors.length
    return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`
}

const logout = () => {
    AuthService.logout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
}

// Funciones para abrir modales con Modales.vue
const openAddUser = () => {
    modalTitle.value = 'Agregar Usuario'
    modalType.value = 'usuario'
    modalData.value = { nombre: '', correo: '', rol: 'usuario', estado: 'activo' }
    currentContext = 'usuarios'
    currentItemId = null
    modalVisible.value = true
}

const editUser = (id: number) => {
    const usuario = usuarios.value.find(u => u.id === id)
    if (usuario) {
        modalTitle.value = 'Editar Usuario'
        modalType.value = 'usuario'
        modalData.value = {
            nombre: usuario.nombre,
            correo: usuario.email,
            rol: usuario.rol.toLowerCase(),
            estado: usuario.estado.toLowerCase()
        }
        currentContext = 'usuarios'
        currentItemId = id
        modalVisible.value = true
    }
}

const openAddLesson = () => {
    modalTitle.value = 'Agregar Lección'
    modalType.value = 'leccion'
    modalData.value = { titulo: '', descripcion: '', comandos: '', retroalimentacion: '' }
    currentContext = 'lecciones'
    currentItemId = null
    modalVisible.value = true
}

const editLesson = async (id: number) => {
    try {
        // Obtener los detalles completos de la lección
        const leccion: any = await LessonService.getById(id)
        console.log('Lección cargada para editar:', leccion)

        // Mapear los datos al formato del formulario (incluye descripcion de comandos)
        newLesson.value = {
            title: leccion.Titulo,
            experiencia: leccion.experiencia || 100,
            challenges: leccion.retos.map((reto: any) => ({
                tipo: reto.tipo || 'reto',
                description: reto.descripcion,
                contenido: reto.contenido || '',
                feedback: reto.Retroalimentacion || '',
                commands: reto.comandos.map((cmd: any) => ({
                    comando: cmd.comando,
                    descripcion: cmd.descripcion || ''
                }))
            }))
        }

        currentItemId = id
        showAddLesson.value = true
    } catch (err: any) {
        console.error('Error cargando lección:', err)
        alert(err.message || 'Error al cargar la lección para editar')
    }
}

const confirmDeleteUser = (id: number) => {
    const usuario = usuarios.value.find(u => u.id === id)
    if (usuario) {
        modalTitle.value = 'Confirmar Eliminación'
        modalType.value = 'eliminar'
        modalData.value = { nombre: usuario.nombre }
        currentContext = 'usuarios'
        currentItemId = id
        modalVisible.value = true
    }
}

const confirmDeleteLesson = (id: number) => {
    const leccion = lecciones.value.find(l => l.id === id)
    if (leccion) {
        modalTitle.value = 'Confirmar Eliminación'
        modalType.value = 'eliminar'
        modalData.value = { titulo: leccion.titulo }
        currentContext = 'lecciones'
        currentItemId = id
        modalVisible.value = true
    }
}

const cerrarModal = () => {
    modalVisible.value = false
    currentItemId = null
}

const guardarCambios = async (data: any) => {
    try {
        if (currentContext === 'usuarios') {
            const userData = {
                username: data.nombre,
                email: data.correo,
                rol: data.rol,
                activo: data.estado === 'activo'
            }

            if (currentItemId) {
                await UserService.update(currentItemId, userData)
                alert('Usuario actualizado correctamente')
            } else {
                await UserService.create(userData)
                alert('Usuario creado correctamente')
            }

            await fetchUsers()
        } else {
            const lessonData = {
                Titulo: data.titulo,
                Descripcion: data.descripcion
            }

            if (currentItemId) {
                await LessonService.update(currentItemId, lessonData)
                alert('Lección actualizada correctamente')
            } else {
                await LessonService.create(lessonData)
                alert('Lección creada correctamente')
            }

            await fetchLessons()
        }

        cerrarModal()
    } catch (err: any) {
        console.error('Error guardando datos:', err)
        alert(`Error al guardar: ${err.message}`)
    }
}

const confirmarEliminacion = async () => {
    try {
        if (currentContext === 'usuarios') {
            await UserService.delete(currentItemId!)
            await fetchUsers()
        } else {
            await LessonService.delete(currentItemId!)
            await fetchLessons()
        }

        alert('Eliminado correctamente')
        cerrarModal()
    } catch (err: any) {
        console.error('Error eliminando:', err)
        alert(`Error al eliminar: ${err.message}`)
    }
}

// Funciones para el modal de agregar lección con challenges
const addChallenge = () => {
    newLesson.value.challenges.push({
        tipo: 'reto',
        description: '',
        contenido: '',
        feedback: '',
        commands: [{ comando: '', descripcion: '' }]
    })
}

const addCommand = (challengeIndex: number) => {
    const ch = newLesson.value.challenges[challengeIndex]
    if (!ch.commands) ch.commands = []
    ch.commands.push({ comando: '', descripcion: '' })
}

const removeCommand = (challengeIndex: number, cmdIndex: number) => {
    const ch = newLesson.value.challenges[challengeIndex]
    if (!ch || !ch.commands) return
    ch.commands.splice(cmdIndex, 1)
}

const removeChallenge = (index: number) => {
    newLesson.value.challenges.splice(index, 1)
}

const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

const toRequestPayload = () => {
    return {
        titulo: newLesson.value.title,
        retos: newLesson.value.challenges.map((c: any) => ({
            tipo: c.tipo || 'reto',
            descripcion: c.description,
            contenido: c.contenido || null,
            Retroalimentacion: c.feedback || null,
            comandos: c.tipo === 'explicacion' ? [] : c.commands.map((cmd: any) => ({
                comando: cmd.comando,
                descripcion: cmd.descripcion?.trim() || undefined
            }))
        }))
    }
}

const saveLesson = async () => {
    saveError.value = ''
    saveSuccess.value = ''

    // Validación
    if (!newLesson.value.title || newLesson.value.challenges.length === 0) {
        saveError.value = 'El título y al menos un reto/explicación son obligatorios.'
        return
    }

    // Validaciones de longitud (alineadas con la base de datos)
    // - Lecciones.Titulo: VARCHAR(150)
    // - Retos.descripcion: VARCHAR(500)
    // - Comandos.comando: VARCHAR(100)
    // - Comandos.descripcion: VARCHAR(200)
    if (newLesson.value.title.length > 150) {
        saveError.value = 'El título no puede superar 150 caracteres.'
        return
    }

    // Validar que cada reto tenga al menos un comando (solo si es tipo "reto")
    for (const challenge of newLesson.value.challenges) {
        if (!challenge.description) {
            saveError.value = 'Todos los elementos deben tener una descripción/título.'
            return
        }
        if (challenge.description.length > 500) {
            saveError.value = 'La descripción/título de cada elemento no puede superar 500 caracteres.'
            return
        }
        if (challenge.tipo === 'reto' && (!challenge.commands || challenge.commands.length === 0 || !challenge.commands[0].comando)) {
            saveError.value = 'Cada reto debe tener al menos un comando válido.'
            return
        }
        if (challenge.tipo === 'reto' && challenge.commands) {
            for (const cmd of challenge.commands) {
                if (!cmd || typeof cmd.comando !== 'string') continue
                if (cmd.comando.length > 100) {
                    saveError.value = 'Cada comando no puede superar 100 caracteres.'
                    return
                }
                if (cmd.descripcion && cmd.descripcion.length > 200) {
                    saveError.value = 'La descripción de cada comando no puede superar 200 caracteres.'
                    return
                }
            }
        }
        if (challenge.tipo === 'explicacion' && !challenge.contenido) {
            saveError.value = 'Cada explicación debe tener contenido.'
            return
        }
    }

    isSaving.value = true
    try {
        const payload = toRequestPayload()
        console.log('Enviando payload:', JSON.stringify(payload, null, 2))

        if (currentItemId) {
            // Editar lección existente
            await LessonService.update(currentItemId, payload)
            saveSuccess.value = 'Lección actualizada correctamente.'
        } else {
            // Crear nueva lección
            await LessonService.create(payload)
            saveSuccess.value = 'Lección creada correctamente.'
        }

        await fetchLessons()

        // Reset form
        newLesson.value = {
            title: '',
            experiencia: 100,
            challenges: [{
                description: '',
                feedback: '',
                commands: [{ comando: '', descripcion: '' }]
            }]
        }
        currentItemId = null
        showAddLesson.value = false
    } catch (err: any) {
        console.error('Error saving lesson:', err)
        saveError.value = err.message || 'Error al guardar la lección.'
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <div class="admin">
        <!-- Header -->
        <header class="admin-header">
            <div class="brand">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin"
                    class="logo-penguin" />
                <h1>Penguin Path</h1>
            </div>
            <div class="user-info">
                <div class="perfil">
                    <img :src="user.avatar" :alt="user.username" class="user-avatar-header" />
                    <span>{{ user.username }}</span>
                </div>
            </div>
        </header>

        <aside class="sidebar">
            <div class="nav-selector">
                <label for="pagina" class="nav-label">Ir a:</label>
                <select id="pagina" v-model="selectedPage" @change="navigateToPage" class="nav-select">
                    <option value="">Selecciona una opción</option>
                    <option value="admin">Dashboard Admin</option>
                    <option value="dashboard">Dashboard Usuario</option>
                </select>
            </div>

            <nav>
                <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'" class="nav-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>Usuarios</span>
                </button>
                <button :class="{ active: activeTab === 'lessons' }" @click="activeTab = 'lessons'" class="nav-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <span>Lecciones</span>
                </button>
            </nav>




            <div class="sidebar-footer">
                <button class="nav-btn config-btn" @click="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>

        <!-- Content -->
        <main class="content">
            <!-- Users Tab -->
            <section v-if="activeTab === 'users'" class="users-section">
                <div class="section-header">
                    <h2>Usuarios</h2>
                    <button class="btn-add" @click="openAddUser">Agregar usuario</button>
                </div>

                <div class="search-container">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" v-model="searchTerm" placeholder="Buscar usuarios por nombre, correo..."
                        class="search-input" />
                </div>

                <div class="table-container">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>CORREO ELECTRÓNICO</th>
                                <th>ROL</th>
                                <th>ESTADO</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="usuario in filteredUsuarios" :key="usuario.id">
                                <td class="nombre-col">{{ usuario.nombre }}</td>
                                <td class="email-col">{{ usuario.email }}</td>
                                <td>{{ usuario.rol }}</td>
                                <td>
                                    <span
                                        :class="['badge', usuario.estado === 'Activo' ? 'badge-active' : 'badge-inactive']">{{
                                            usuario.estado }}</span>
                                </td>
                                <td class="actions-col">
                                    <button class="btn-action btn-edit" @click="editUser(usuario.id)">Editar</button>
                                    <button class="btn-action btn-delete"
                                        @click="confirmDeleteUser(usuario.id)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Lessons Tab -->
            <section v-else class="lessons-section">
                <div class="section-header">
                    <h2>Lecciones</h2>
                    <button class="btn-add" @click="showAddLesson = true">Agregar Lección</button>
                </div>

                <div class="lessons-list">
                    <div v-for="leccion in lecciones" :key="leccion.id" class="lesson-card">
                        <div class="lesson-content">
                            <h3>{{ leccion.titulo }}</h3>
                            <p>{{ leccion.descripcion }}</p>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-action btn-edit" @click="editLesson(leccion.id)"
                                style="padding: 6px 16px; border-radius: 6px;">Editar</button>
                            <button class="btn-delete-lesson" @click="confirmDeleteLesson(leccion.id)">Borrar</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Modal: Add Lesson con Challenges (mantener original) -->
        <div v-if="showAddLesson" class="modal-overlay" @click="showAddLesson = false; currentItemId = null">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>{{ currentItemId ? 'Editar Lección' : 'Agregar Lección' }}</h3>
                    <button class="btn-close" @click="showAddLesson = false; currentItemId = null">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Título de la Lección</label>
                        <input type="text" v-model="newLesson.title" placeholder="Ej: Comandos básicos de listado"
                            class="form-input" />
                    </div>

                    <div class="form-group">
                        <label>Puntos de Experiencia (XP)</label>
                        <input type="number" v-model.number="newLesson.experiencia" min="1" placeholder="100"
                            class="form-input" />
                        <small style="color: rgba(255, 255, 255, 0.6); margin-top: 4px; display: block;">XP que ganará
                            el usuario al completar esta lección</small>
                    </div>

                    <div class="form-group">
                        <div class="challenges-header"
                            style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                            <label style="color:white; margin:0;">Contenido de la Lección</label>
                            <button class="btn-add" @click="addChallenge">+ Añadir Elemento</button>
                        </div>

                        <div class="challenges-list">
                            <div v-for="(challenge, index) in newLesson.challenges" :key="index" class="challenge-item"
                                style="background: rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 10px; margin-bottom: 12px;">
                                <div
                                    style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                    <label style="color:white; font-weight:600; margin:0;">Elemento {{ index + 1
                                        }}</label>
                                    <button class="btn-delete" @click.prevent="removeChallenge(index)"
                                        style="padding: 4px 12px; font-size: 12px;">Eliminar</button>
                                </div>

                                <!-- Selector de tipo -->
                                <div class="form-group" style="margin-bottom:12px;">
                                    <label style="font-size:13px;">Tipo de Contenido</label>
                                    <select v-model="challenge.tipo" class="form-input"
                                        style="background: rgba(0,0,0,0.2); color: white;">
                                        <option value="explicacion">📚 Explicación (Solo lectura)</option>
                                        <option value="reto">🎯 Reto (Terminal interactiva)</option>
                                    </select>
                                </div>

                                <div class="form-group" style="margin-bottom:12px;">
                                    <label style="font-size:13px;">{{ challenge.tipo === 'explicacion' ? 'Título de la Explicación' : 'Descripción del Reto' }}</label>
                                    <input type="text" v-model="challenge.description"
                                        :placeholder="challenge.tipo === 'explicacion' ? 'Ej: ¿Qué es la terminal de Linux?' : 'Ej: Lista todos los archivos del directorio actual'"
                                        class="form-input" />
                                </div>

                                <!-- Contenido extenso para explicaciones -->
                                <div v-if="challenge.tipo === 'explicacion'" class="form-group"
                                    style="margin-bottom:12px;">
                                    <label style="font-size:13px;">Contenido de la Explicación</label>
                                    <textarea v-model="challenge.contenido"
                                        placeholder="Puedes usar HTML o Markdown. Ej: <h2>La Terminal</h2><p>Es una interfaz...</p>"
                                        rows="6" class="form-textarea"></textarea>
                                    <small style="color: rgba(255,255,255,0.6); font-size:11px;">Soporta HTML básico:
                                        h1-h6, p, strong, em, ul, ol, li, code, pre</small>
                                </div>

                                <!-- Campos solo para retos -->
                                <template v-if="challenge.tipo === 'reto'">
                                    <div class="form-group" style="margin-bottom:12px;">
                                        <label style="font-size:13px;">Retroalimentación (opcional)</label>
                                        <textarea v-model="challenge.feedback"
                                            placeholder="Ej: ¡Excelente! Has usado el comando correcto" rows="2"
                                            class="form-textarea"></textarea>
                                    </div>

                                    <div class="form-group" style="margin-bottom:0;">
                                        <div
                                            style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                            <label style="font-size:13px; margin:0;">Comandos Válidos</label>
                                            <button class="btn-add" @click.prevent="addCommand(index)"
                                                style="padding: 4px 10px; font-size: 12px;">+ Comando</button>
                                        </div>

                                        <div v-for="(cmd, ci) in challenge.commands" :key="ci"
                                            style="display:flex; gap:8px; align-items:center; margin-bottom:8px; flex-wrap:wrap;">
                                            <input v-model="cmd.comando" placeholder="Ej: ls -la"
                                                class="form-input mono" style="flex:1; min-width:160px;" />
                                            <input v-model="cmd.descripcion" placeholder="Descripción del comando (opcional)"
                                                class="form-input" style="flex:1; min-width:220px;" />
                                            <button v-if="challenge.commands.length > 1" class="btn-delete"
                                                @click.prevent="removeCommand(index, ci)"
                                                style="padding: 8px 12px; font-size: 12px;">×</button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:20px;">
                        <div v-if="saveError"
                            style="color: #ffbdbd; margin-bottom:12px; padding:12px; background: rgba(239, 68, 68, 0.2); border-radius:8px; border: 1px solid rgba(239, 68, 68, 0.4);">
                            {{ saveError }}
                        </div>
                        <div v-if="saveSuccess"
                            style="color: #bdf5bd; margin-bottom:12px; padding:12px; background: rgba(34, 197, 94, 0.2); border-radius:8px; border: 1px solid rgba(34, 197, 94, 0.4);">
                            {{ saveSuccess }}
                        </div>
                        <div style="display:flex; gap:12px; justify-content:flex-end;">
                            <button class="btn-cancel"
                                @click="showAddLesson = false; currentItemId = null">Cancelar</button>
                            <button class="btn-save" @click="saveLesson" :disabled="isSaving">
                                {{ isSaving ? 'Guardando...' : 'Guardar Lección' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Componente Modales para usuarios y editar lecciones -->
        <Modales :visible="modalVisible" :type="modalType" :title="modalTitle" :data="modalData" @close="cerrarModal"
            @save="guardarCambios" @confirmDelete="confirmarEliminacion" />
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.admin {
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: 70px 1fr;
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.admin-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-penguin {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.brand h1 {
    color: white;
    font-size: 20px;
    font-weight: 600;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 26px;
}

.perfil {
    display: flex;
    align-items: center;
    gap: 10px;
}

.user-avatar-header {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 2px;
}

.perfil span {
    color: white;
    font-weight: 500;
}

.sidebar {
    grid-row: 2;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.sidebar nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.nav-btn.active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
}

.nav-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-label {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.nav-select {
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.nav-select:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
}

.nav-select:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
}

.nav-select option {
    background: #956eaa;
    color: white;
    padding: 10px;
}

.sidebar-footer {
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.content {
    padding: 24px;
    overflow: auto;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-header h2 {
    color: white;
    font-size: 28px;
    font-weight: 600;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-add:hover {
    background: rgba(255, 255, 255, 0.35);
}

.search-container {
    position: relative;
    margin-bottom: 24px;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
}

.search-input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    color: white;
    font-size: 15px;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
}

.table-container {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    overflow: hidden;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table thead {
    background: rgba(255, 255, 255, 0.1);
}

.users-table th {
    padding: 16px 20px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.users-table tbody tr {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    transition: background 0.2s;
}

.users-table tbody tr:hover {
    background: rgba(255, 255, 255, 0.08);
}

.users-table td {
    padding: 16px 20px;
    color: white;
}

.nome-col {
    font-weight: 500;
}

.email-col {
    color: rgba(255, 255, 255, 0.9);
}

.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
}

.badge-active {
    background: rgba(34, 197, 94, 0.2);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.4);
}

.badge-inactive {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
}

.actions-col {
    display: flex;
    gap: 8px;
}

.btn-action {
    padding: 6px 14px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-edit {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.4);
}

.btn-edit:hover {
    background: rgba(59, 130, 246, 0.3);
}

.btn-delete {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
}

.btn-delete:hover {
    background: rgba(239, 68, 68, 0.3);
}

.lessons-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.lesson-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    transition: all 0.3s;
}

.lesson-card:hover {
    border-color: rgba(255, 255, 255, 0.4);
}

.lesson-content h3 {
    color: white;
    font-size: 18px;
    margin-bottom: 8px;
}

.lesson-content p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
}

.btn-delete-lesson {
    padding: 6px 16px;
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-delete-lesson:hover {
    background: rgba(239, 68, 68, 0.3);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-content {
    background: linear-gradient(135deg, rgba(239, 156, 108, 0.95) 0%, rgba(197, 125, 161, 0.95) 50%, rgba(149, 110, 170, 0.95) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    width: 90%;
    max-width: 700px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease;
    overflow-y: auto;
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, rgba(239, 156, 108, 0.95) 0%, rgba(197, 125, 161, 0.95) 50%, rgba(149, 110, 170, 0.95) 100%);
    z-index: 10;
}

.modal-header h3 {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.btn-close {
    background: none;
    border: none;
    color: white;
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s;
}

.btn-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: white;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.3s;
}

.form-input::placeholder,
.form-textarea::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.25);
}

.form-select {
    cursor: pointer;
}

.form-select option {
    background: #6b4c8a;
    color: white;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.mono {
    font-family: 'Courier New', Consolas, monospace;
    font-size: 13px;
    letter-spacing: 0.5px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    position: sticky;
    bottom: 0;
    background: linear-gradient(135deg, rgba(239, 156, 108, 0.95) 0%, rgba(197, 125, 161, 0.95) 50%, rgba(149, 110, 170, 0.95) 100%);
}

.btn-cancel,
.btn-save {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.2);
}

.btn-save {
    background: rgba(34, 197, 94, 0.3);
    color: white;
    border: 1px solid rgba(34, 197, 94, 0.5);
}

.btn-save:hover {
    background: rgba(34, 197, 94, 0.4);
}

.btn-save:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.challenge-input {
    flex: 1;
}

.mono {
    font-family: 'Courier New', monospace;
}
</style>