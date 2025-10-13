<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Modales from './Modales.vue'
import AuthService from '../services/AuthService'

// Estado principal
const usuarios = ref<any[]>([])
const lecciones = ref<any[]>([])

// Control de modal
const modalVisible = ref(false)
const modalType = ref<'usuario' | 'leccion' | 'eliminar'>('usuario')
const modalTitle = ref('')
const modalData = ref<any>({})
let currentContext: 'usuarios' | 'lecciones' = 'usuarios'

// 🔹 Cargar datos desde el backend
onMounted(async () => {
    await cargarUsuarios()
    await cargarLecciones()
})

const cargarUsuarios = async () => {
    try {
        const token = AuthService.getToken()
        const res = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users', {
            headers: { Authorization: `Bearer ${token}` },
        })
        usuarios.value = await res.json()
    } catch (err) {
        console.error('Error cargando usuarios:', err)
    }
}

const cargarLecciones = async () => {
    try {
        const token = AuthService.getToken()
        const res = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/lecciones', {
            headers: { Authorization: `Bearer ${token}` },
        })
        lecciones.value = await res.json()
    } catch (err) {
        console.error('Error cargando lecciones:', err)
    }
}

// 🔹 Funciones para abrir modales
const abrirAgregarUsuario = () => {
    modalTitle.value = 'Agregar Usuario'
    modalType.value = 'usuario'
    modalData.value = { nombre: '', correo: '', rol: 'usuario', estado: 'activo' }
    currentContext = 'usuarios'
    modalVisible.value = true
}

const abrirEditarUsuario = (usuario: any) => {
    modalTitle.value = 'Editar Usuario'
    modalType.value = 'usuario'
    modalData.value = { ...usuario }
    currentContext = 'usuarios'
    modalVisible.value = true
}

const abrirAgregarLeccion = () => {
    modalTitle.value = 'Agregar Lección'
    modalType.value = 'leccion'
    modalData.value = { titulo: '', descripcion: '', comandos: '', retroalimentacion: '' }
    currentContext = 'lecciones'
    modalVisible.value = true
}

const abrirEditarLeccion = (leccion: any) => {
    modalTitle.value = 'Editar Lección'
    modalType.value = 'leccion'
    modalData.value = { ...leccion }
    currentContext = 'lecciones'
    modalVisible.value = true
}

const abrirConfirmarEliminacion = (item: any, context: 'usuarios' | 'lecciones') => {
    modalTitle.value = 'Confirmar Eliminación'
    modalType.value = 'eliminar'
    modalData.value = { ...item }
    currentContext = context
    modalVisible.value = true
}

// 🔹 Acciones del modal
const cerrarModal = () => (modalVisible.value = false)

const guardarCambios = async (data: any) => {
    try {
        const token = AuthService.getToken()
        const endpoint =
            currentContext === 'usuarios'
                ? 'https://sistema-de-aprendizaje-linux-production.up.railway.app/users'
                : 'https://sistema-de-aprendizaje-linux-production.up.railway.app/lecciones'

        const method = data.id ? 'PUT' : 'POST'
        const url = data.id ? `${endpoint}/${data.id}` : endpoint

        const res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) throw new Error('Error al guardar')

        if (currentContext === 'usuarios') await cargarUsuarios()
        else await cargarLecciones()

        cerrarModal()
    } catch (err) {
        console.error('Error guardando datos:', err)
    }
}

const confirmarEliminacion = async () => {
    try {
        const token = AuthService.getToken()
        const endpoint =
            currentContext === 'usuarios'
                ? 'https://sistema-de-aprendizaje-linux-production.up.railway.app/users'
                : 'https://sistema-de-aprendizaje-linux-production.up.railway.app/lecciones'

        const res = await fetch(`${endpoint}/${modalData.value.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error('Error al eliminar')

        if (currentContext === 'usuarios') await cargarUsuarios()
        else await cargarLecciones()

        cerrarModal()
    } catch (err) {
        console.error('Error eliminando elemento:', err)
    }
}
</script>

<template>
    <div class="admin-dashboard">
        <h1 class="title">Panel de Administración</h1>

        <div class="buttons">
            <button @click="abrirAgregarUsuario">Agregar Usuario</button>
            <button @click="abrirAgregarLeccion">Agregar Lección</button>
        </div>

        <!-- Tabla de usuarios -->
        <div class="tabla">
            <h3>Usuarios</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in usuarios" :key="usuario.id">
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.correo }}</td>
                        <td>{{ usuario.rol }}</td>
                        <td>{{ usuario.estado }}</td>
                        <td>
                            <button @click="abrirEditarUsuario(usuario)">Editar</button>
                            <button @click="abrirConfirmarEliminacion(usuario, 'usuarios')">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Tabla de lecciones -->
        <div class="tabla">
            <h3>Lecciones</h3>
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Comandos</th>
                        <th>Retroalimentación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="leccion in lecciones" :key="leccion.id">
                        <td>{{ leccion.titulo }}</td>
                        <td>{{ leccion.descripcion }}</td>
                        <td>{{ leccion.comandos }}</td>
                        <td>{{ leccion.retroalimentacion }}</td>
                        <td>
                            <button @click="abrirEditarLeccion(leccion)">Editar</button>
                            <button @click="abrirConfirmarEliminacion(leccion, 'lecciones')">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <Modales :visible="modalVisible" :type="modalType" :title="modalTitle" :data="modalData" @close="cerrarModal"
            @save="guardarCambios" @confirmDelete="confirmarEliminacion" />
    </div>
</template>

<style scoped>
.admin-dashboard {
    padding: 40px;
    color: #333;
}

.title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

button {
    background: linear-gradient(135deg, #ef9c6c 0%, #c57da1 50%, #956eaa 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    cursor: pointer;
}

button:hover {
    transform: scale(1.05);
}

.tabla {
    margin-top: 2rem;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

th {
    background: #f4f4f4;
}
</style>