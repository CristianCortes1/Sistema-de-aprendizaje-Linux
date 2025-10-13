<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '../services/AuthService'

const router = useRouter()

const activeTab = ref<'users' | 'lessons'>('users')
const searchTerm = ref('')

const user = ref({
    username: '',
    correo: '',
    racha: 0,
    experiencia: 0,
    avatar: ''
})

// Usuarios desde el backend
const usuarios = ref<any[]>([])
const isLoadingUsers = ref(false)

const lecciones = ref([
    { id: 1, titulo: 'Introduction to Linux', descripcion: 'Learn the basics of Linux operating system.' },
    { id: 2, titulo: 'File Management', descripcion: 'Master file manipulation in Linux.' },
    { id: 3, titulo: 'User Management', descripcion: 'Manage users and permissions effectively.' },
    { id: 4, titulo: 'System Administration', descripcion: 'Administer your Linux system like a pro.' },
    { id: 5, titulo: 'Networking in Linux', descripcion: 'Configure and troubleshoot network settings.' },
])

const showAddLesson = ref(false)
const showAddUser = ref(false)

const newLesson = ref({
    title: '',
    description: '',
    challenges: [{ title: '', command: '', feedback: '' }]
})

const newUser = ref({
    name: '',
    email: '',
    role: 'User'
})

const filteredUsuarios = computed(() => {
    return usuarios.value.filter(u =>
        u.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (u.correo && u.correo.toLowerCase().includes(searchTerm.value.toLowerCase()))
    )
})

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
})

const fetchUsers = async () => {
    isLoadingUsers.value = true
    try {
        const token = AuthService.getToken()
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)

        const data = await response.json()
        console.log('Datos recibidos de la API:', data) // Para debug
        
        usuarios.value = data.map((u: any) => ({
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
        
        console.log('Usuarios mapeados:', usuarios.value) // Para debug
    } catch (error) {
        console.error('Error fetching users:', error)
        usuarios.value = [] // Vacío si hay error
    } finally {
        isLoadingUsers.value = false
    }
}

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

const addChallenge = () => {
    newLesson.value.challenges.push({ title: '', command: '', feedback: '' })
}

const deleteLesson = (id: number) => {
    const index = lecciones.value.findIndex(l => l.id === id)
    if (index > -1) {
        lecciones.value.splice(index, 1)
    }
}

const deleteUser = async (id: number) => {
    const index = usuarios.value.findIndex(u => u.id === id)
    if (index > -1) {
        usuarios.value.splice(index, 1)
    }
}

const editUser = (id: number) => {
    console.log('Editar usuario:', id)
}

const saveUser = () => {
    console.log('Guardando usuario:', newUser.value)
    showAddUser.value = false
    newUser.value = { name: '', email: '', role: 'User' }
}

const saveLesson = () => {
    console.log('Guardando lección:', newLesson.value)
    showAddLesson.value = false
    newLesson.value = { title: '', description: '', challenges: [{ title: '', command: '', feedback: '' }] }
}
</script>

<template>
    <div class="admin">
        <!-- Header -->
        <header class="admin-header">
            <div class="brand">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Penguin" class="logo-penguin" />
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
            <nav>
                <button 
                    :class="{ active: activeTab === 'users' }" 
                    @click="activeTab = 'users'"
                    class="nav-btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>Usuarios</span>
                </button>
                <button 
                    :class="{ active: activeTab === 'lessons' }" 
                    @click="activeTab = 'lessons'"
                    class="nav-btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <span>Lecciones</span>
                </button>
            </nav>

            <div class="sidebar-footer">
                <button class="nav-btn config-btn" @click="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
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
                    <button class="btn-add" @click="showAddUser = true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Agregar usuario
                    </button>
                </div>

                <div class="search-container">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input 
                        type="text" 
                        v-model="searchTerm"
                        placeholder="Buscar usuarios por nombre, correo..."
                        class="search-input"
                    />
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
                                    <span :class="['badge', usuario.estado === 'Activo' ? 'badge-active' : 'badge-inactive']">
                                        {{ usuario.estado }}
                                    </span>
                                </td>
                                <td class="actions-col">
                                    <button class="btn-action btn-edit">Editar</button>
                                    <button class="btn-action btn-delete">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Lessons Tab -->
            <section v-else class="lessons-section">
                <div class="section-header">
                    <h2>Manage Lessons</h2>
                    <button class="btn-add" @click="showAddLesson = true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add New Lesson
                    </button>
                </div>

                <div class="lessons-list">
                    <div v-for="leccion in lecciones" :key="leccion.id" class="lesson-card">
                        <div class="lesson-content">
                            <h3>{{ leccion.titulo }}</h3>
                            <p>{{ leccion.descripcion }}</p>
                        </div>
                        <button class="btn-delete-lesson" @click="deleteLesson(leccion.id)">Delete</button>
                    </div>
                </div>
            </section>
        </main>

        <!-- Modal para agregar usuario -->
        <div v-if="showAddUser" class="modal-overlay" @click="showAddUser = false">
            <div class="modal-content modal-user" @click.stop>
                <div class="modal-header">
                    <h3>Add New User</h3>
                    <button class="btn-close" @click="showAddUser = false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Name</label>
                            <input 
                                type="text" 
                                v-model="newUser.name"
                                placeholder="Enter user name"
                                class="form-input"
                            />
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                v-model="newUser.email"
                                placeholder="Enter user email"
                                class="form-input"
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Role</label>
                        <select v-model="newUser.role" class="form-select">
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="Estudiante">Estudiante</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="showAddUser = false">Cancel</button>
                    <button class="btn-save" @click="saveUser">Add User</button>
                </div>
            </div>
        </div>

        <!-- Modal para agregar lección -->
        <div v-if="showAddLesson" class="modal-overlay" @click="showAddLesson = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Add New Lesson</h3>
                    <button class="btn-close" @click="showAddLesson = false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Lesson Title</label>
                        <input 
                            type="text" 
                            v-model="newLesson.title"
                            placeholder="e.g., Mastering the Command Line"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label>Lesson Description</label>
                        <textarea 
                            v-model="newLesson.description"
                            placeholder="A short summary of what the lesson covers."
                            rows="4"
                            class="form-textarea"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <div class="challenges-header">
                            <label>Challenges</label>
                            <button class="btn-add-challenge" @click="addChallenge">Add Challenge</button>
                        </div>

                        <div class="challenges-list">
                            <div v-for="(challenge, index) in newLesson.challenges" :key="index" class="challenge-item">
                                <input 
                                    type="text" 
                                    v-model="challenge.title"
                                    placeholder="e.g., Create a Directory"
                                    class="challenge-input"
                                />
                                <input 
                                    type="text" 
                                    v-model="challenge.command"
                                    placeholder="e.g., mkdir my_folder"
                                    class="challenge-input mono"
                                />
                                <input 
                                    type="text" 
                                    v-model="challenge.feedback"
                                    placeholder="e.g., Great! You've created a new directory."
                                    class="challenge-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="showAddLesson = false">Cancel</button>
                    <button class="btn-save" @click="saveLesson">Save Lesson</button>
                </div>
            </div>
        </div>
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
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
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
}

.modal-user {
    max-width: 550px;
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

</style>