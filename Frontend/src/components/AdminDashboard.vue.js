import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import LessonService from '../services/LessonService';
import Modales from './Modales.vue';
const router = useRouter();
const activeTab = ref('users');
const searchTerm = ref('');
// Control de modales con Modales.vue
const modalVisible = ref(false);
const modalType = ref('usuario');
const modalTitle = ref('');
const modalData = ref({});
let currentContext = 'usuarios';
let currentItemId = null;
const user = ref({
    username: '',
    correo: '',
    racha: 0,
    experiencia: 0,
    avatar: ''
});
const usuarios = ref([]);
const isLoadingUsers = ref(false);
const lecciones = ref([]);
const isLoadingLessons = ref(false);
const showAddLesson = ref(false);
const newLesson = ref({
    title: '',
    description: '',
    challenges: [{ title: '', command: '', feedback: '' }]
});
const filteredUsuarios = computed(() => {
    return usuarios.value.filter(u => u.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (u.correo && u.correo.toLowerCase().includes(searchTerm.value.toLowerCase())));
});
const fetchUsers = async () => {
    isLoadingUsers.value = true;
    try {
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok)
            throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        usuarios.value = data.map((u) => ({
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
        }));
    }
    catch (error) {
        console.error('Error fetching users:', error);
        usuarios.value = [];
    }
    finally {
        isLoadingUsers.value = false;
    }
};
const fetchLessons = async () => {
    isLoadingLessons.value = true;
    try {
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/lessons', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok)
            throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        console.log('Lecciones recibidas de la API:', data);
        lecciones.value = data.map((leccion) => ({
            id: leccion.id_Leccion,
            titulo: leccion.Titulo,
            descripcion: 'Descripción de ' + leccion.Titulo
        }));
        console.log('Lecciones mapeadas:', lecciones.value);
    }
    catch (error) {
        console.error('Error fetching lessons:', error);
        lecciones.value = [];
    }
    finally {
        isLoadingLessons.value = false;
    }
};
onMounted(async () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
        user.value.username = parsed.username;
        user.value.correo = parsed.correo;
        user.value.racha = parsed.racha || 0;
        user.value.experiencia = parsed.experiencia || 0;
        user.value.avatar = parsed.avatar;
    }
    await fetchUsers();
    await fetchLessons();
});
const getDefaultAvatar = (username) => {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
    const colorIndex = username.length % colors.length;
    return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`;
};
const logout = () => {
    AuthService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
};
// Funciones para abrir modales con Modales.vue
const openAddUser = () => {
    modalTitle.value = 'Agregar Usuario';
    modalType.value = 'usuario';
    modalData.value = { nombre: '', correo: '', rol: 'usuario', estado: 'activo' };
    currentContext = 'usuarios';
    currentItemId = null;
    modalVisible.value = true;
};
const editUser = (id) => {
    const usuario = usuarios.value.find(u => u.id === id);
    if (usuario) {
        modalTitle.value = 'Editar Usuario';
        modalType.value = 'usuario';
        modalData.value = {
            nombre: usuario.nombre,
            correo: usuario.email,
            rol: usuario.rol.toLowerCase(),
            estado: usuario.estado.toLowerCase()
        };
        currentContext = 'usuarios';
        currentItemId = id;
        modalVisible.value = true;
    }
};
const openAddLesson = () => {
    modalTitle.value = 'Agregar Lección';
    modalType.value = 'leccion';
    modalData.value = { titulo: '', descripcion: '', comandos: '', retroalimentacion: '' };
    currentContext = 'lecciones';
    currentItemId = null;
    modalVisible.value = true;
};
const editLesson = (id) => {
    const leccion = lecciones.value.find(l => l.id === id);
    if (leccion) {
        modalTitle.value = 'Editar Lección';
        modalType.value = 'leccion';
        modalData.value = {
            titulo: leccion.titulo,
            descripcion: leccion.descripcion,
            comandos: '',
            retroalimentacion: ''
        };
        currentContext = 'lecciones';
        currentItemId = id;
        modalVisible.value = true;
    }
};
const confirmDeleteUser = (id) => {
    const usuario = usuarios.value.find(u => u.id === id);
    if (usuario) {
        modalTitle.value = 'Confirmar Eliminación';
        modalType.value = 'eliminar';
        modalData.value = { nombre: usuario.nombre };
        currentContext = 'usuarios';
        currentItemId = id;
        modalVisible.value = true;
    }
};
const confirmDeleteLesson = (id) => {
    const leccion = lecciones.value.find(l => l.id === id);
    if (leccion) {
        modalTitle.value = 'Confirmar Eliminación';
        modalType.value = 'eliminar';
        modalData.value = { titulo: leccion.titulo };
        currentContext = 'lecciones';
        currentItemId = id;
        modalVisible.value = true;
    }
};
const cerrarModal = () => {
    modalVisible.value = false;
    currentItemId = null;
};
const guardarCambios = async (data) => {
    try {
        if (currentContext === 'usuarios') {
            const url = currentItemId
                ? `https://sistema-de-aprendizaje-linux-production.up.railway.app/users/${currentItemId}`
                : 'https://sistema-de-aprendizaje-linux-production.up.railway.app/users';
            const method = currentItemId ? 'PATCH' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: data.nombre,
                    email: data.correo,
                    rol: data.rol,
                    activo: data.estado === 'activo'
                })
            });
            if (!response.ok)
                throw new Error('Error al guardar usuario');
            await fetchUsers();
            alert(currentItemId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
        }
        else {
            const url = currentItemId
                ? `https://sistema-de-aprendizaje-linux-production.up.railway.app/lessons/${currentItemId}`
                : 'https://sistema-de-aprendizaje-linux-production.up.railway.app/lessons';
            const method = currentItemId ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Titulo: data.titulo,
                    Descripcion: data.descripcion
                })
            });
            if (!response.ok)
                throw new Error('Error al guardar lección');
            await fetchLessons();
            alert(currentItemId ? 'Lección actualizada correctamente' : 'Lección creada correctamente');
        }
        cerrarModal();
    }
    catch (err) {
        console.error('Error guardando datos:', err);
        alert(`Error al guardar: ${err.message}`);
    }
};
const confirmarEliminacion = async () => {
    try {
        const endpoint = currentContext === 'usuarios'
            ? `https://sistema-de-aprendizaje-linux-production.up.railway.app/users/${currentItemId}`
            : `https://sistema-de-aprendizaje-linux-production.up.railway.app/lessons/${currentItemId}`;
        const response = await fetch(endpoint, {
            method: 'DELETE'
        });
        if (!response.ok)
            throw new Error('Error al eliminar');
        if (currentContext === 'usuarios')
            await fetchUsers();
        else
            await fetchLessons();
        alert('Eliminado correctamente');
        cerrarModal();
    }
    catch (err) {
        console.error('Error eliminando:', err);
        alert(`Error al eliminar: ${err.message}`);
    }
};
// Funciones para el modal de agregar lección con challenges (mantener original)
const addChallenge = () => {
    newLesson.value.challenges.push({ title: '', command: '', feedback: '' });
};
const addCommand = (challengeIndex) => {
    const ch = newLesson.value.challenges[challengeIndex];
    if (!ch.commands)
        ch.commands = [];
    ch.commands.push({ comando: '' });
};
const removeCommand = (challengeIndex, cmdIndex) => {
    const ch = newLesson.value.challenges[challengeIndex];
    if (!ch || !ch.commands)
        return;
    ch.commands.splice(cmdIndex, 1);
};
const removeChallenge = (index) => {
    newLesson.value.challenges.splice(index, 1);
};
const isSaving = ref(false);
const saveError = ref('');
const saveSuccess = ref('');
const toRequestPayload = () => {
    return {
        titulo: newLesson.value.title,
        retos: newLesson.value.challenges.map((c) => ({
            descripcion: c.title,
            Retroalimentacion: c.feedback || null,
            comandos: (c.commands || (c.command ? [{ comando: c.command }] : [])).map((cmd) => ({ comando: cmd.comando ?? cmd.command }))
        }))
    };
};
const saveLesson = async () => {
    saveError.value = '';
    saveSuccess.value = '';
    if (!newLesson.value.title || newLesson.value.challenges.length === 0) {
        saveError.value = 'El título y al menos un reto son obligatorios.';
        return;
    }
    isSaving.value = true;
    try {
        const payload = toRequestPayload();
        await LessonService.create(payload);
        saveSuccess.value = 'Lección creada correctamente.';
        await fetchLessons();
        newLesson.value = { title: '', description: '', challenges: [{ title: '', command: '', feedback: '' }] };
        showAddLesson.value = false;
    }
    catch (err) {
        console.error('Error creating lesson:', err);
        saveError.value = err.message || 'Error al crear la lección.';
    }
    finally {
        isSaving.value = false;
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['users-table']} */ ;
/** @type {__VLS_StyleScopedClasses['users-table']} */ ;
/** @type {__VLS_StyleScopedClasses['users-table']} */ ;
/** @type {__VLS_StyleScopedClasses['users-table']} */ ;
/** @type {__VLS_StyleScopedClasses['users-table']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-card']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-content']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete-lesson']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-close']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "admin" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "admin-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "brand" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    alt: "Penguin",
    ...{ class: "logo-penguin" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "user-info" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "perfil" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.user.avatar),
    alt: (__VLS_ctx.user.username),
    ...{ class: "user-avatar-header" },
});
// @ts-ignore
[user, user,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.user.username);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.aside, __VLS_elements.aside)({
    ...{ class: "sidebar" },
});
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'users';
            // @ts-ignore
            [activeTab,];
        } },
    ...{ class: ({ active: __VLS_ctx.activeTab === 'users' }) },
    ...{ class: "nav-btn" },
});
// @ts-ignore
[activeTab,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
});
__VLS_asFunctionalElement(__VLS_elements.circle)({
    cx: "9",
    cy: "7",
    r: "4",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'lessons';
            // @ts-ignore
            [activeTab,];
        } },
    ...{ class: ({ active: __VLS_ctx.activeTab === 'lessons' }) },
    ...{ class: "nav-btn" },
});
// @ts-ignore
[activeTab,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "sidebar-footer" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.logout) },
    ...{ class: "nav-btn config-btn" },
});
// @ts-ignore
[logout,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
});
__VLS_asFunctionalElement(__VLS_elements.polyline)({
    points: "16 17 21 12 16 7",
});
__VLS_asFunctionalElement(__VLS_elements.line)({
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "content" },
});
if (__VLS_ctx.activeTab === 'users') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
        ...{ class: "users-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "section-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.openAddUser) },
        ...{ class: "btn-add" },
    });
    // @ts-ignore
    [openAddUser,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "search-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
        ...{ class: "search-icon" },
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_elements.circle)({
        cx: "11",
        cy: "11",
        r: "8",
    });
    __VLS_asFunctionalElement(__VLS_elements.path)({
        d: "m21 21-4.35-4.35",
    });
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "text",
        value: (__VLS_ctx.searchTerm),
        placeholder: "Buscar usuarios por nombre, correo...",
        ...{ class: "search-input" },
    });
    // @ts-ignore
    [searchTerm,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "table-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
        ...{ class: "users-table" },
    });
    __VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
    for (const [usuario] of __VLS_getVForSourceType((__VLS_ctx.filteredUsuarios))) {
        // @ts-ignore
        [filteredUsuarios,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
            key: (usuario.id),
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "nombre-col" },
        });
        (usuario.nombre);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "email-col" },
        });
        (usuario.email);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (usuario.rol);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: (['badge', usuario.estado === 'Activo' ? 'badge-active' : 'badge-inactive']) },
        });
        (usuario.estado);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            ...{ class: "actions-col" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'users'))
                        return;
                    __VLS_ctx.editUser(usuario.id);
                    // @ts-ignore
                    [editUser,];
                } },
            ...{ class: "btn-action btn-edit" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.activeTab === 'users'))
                        return;
                    __VLS_ctx.confirmDeleteUser(usuario.id);
                    // @ts-ignore
                    [confirmDeleteUser,];
                } },
            ...{ class: "btn-action btn-delete" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({
        ...{ class: "lessons-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "section-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.activeTab === 'users'))
                    return;
                __VLS_ctx.showAddLesson = true;
                // @ts-ignore
                [showAddLesson,];
            } },
        ...{ class: "btn-add" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "lessons-list" },
    });
    for (const [leccion] of __VLS_getVForSourceType((__VLS_ctx.lecciones))) {
        // @ts-ignore
        [lecciones,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (leccion.id),
            ...{ class: "lesson-card" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "lesson-content" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        (leccion.titulo);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (leccion.descripcion);
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.activeTab === 'users'))
                        return;
                    __VLS_ctx.editLesson(leccion.id);
                    // @ts-ignore
                    [editLesson,];
                } },
            ...{ class: "btn-action btn-edit" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.activeTab === 'users'))
                        return;
                    __VLS_ctx.confirmDeleteLesson(leccion.id);
                    // @ts-ignore
                    [confirmDeleteLesson,];
                } },
            ...{ class: "btn-delete-lesson" },
        });
    }
}
if (__VLS_ctx.showAddLesson) {
    // @ts-ignore
    [showAddLesson,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showAddLesson))
                    return;
                __VLS_ctx.showAddLesson = false;
                // @ts-ignore
                [showAddLesson,];
            } },
        ...{ class: "modal-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: () => { } },
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showAddLesson))
                    return;
                __VLS_ctx.showAddLesson = false;
                // @ts-ignore
                [showAddLesson,];
            } },
        ...{ class: "btn-close" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "text",
        value: (__VLS_ctx.newLesson.title),
        placeholder: "Dominando lineas de comando.",
        ...{ class: "form-input" },
    });
    // @ts-ignore
    [newLesson,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        value: (__VLS_ctx.newLesson.description),
        placeholder: "Un pequeño resumen de que cubre la lección.",
        rows: "4",
        ...{ class: "form-textarea" },
    });
    // @ts-ignore
    [newLesson,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "challenges-header" },
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.addChallenge) },
        ...{ class: "btn-add-challenge btn-add" },
    });
    // @ts-ignore
    [addChallenge,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "challenges-list" },
    });
    for (const [challenge, index] of __VLS_getVForSourceType((__VLS_ctx.newLesson.challenges))) {
        // @ts-ignore
        [newLesson,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            key: (index),
            ...{ class: "challenge-item" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (challenge.title),
            placeholder: "Crea una carpeta",
            ...{ class: "challenge-input form-input" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (challenge.command),
            placeholder: "mkdir my_folder",
            ...{ class: "challenge-input form-input mono" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
            value: (challenge.feedback),
            placeholder: "Mensaje de retroalimentación.",
            ...{ class: "form-textarea" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showAddLesson))
                        return;
                    __VLS_ctx.addCommand(index);
                    // @ts-ignore
                    [addCommand,];
                } },
            ...{ class: "btn-add" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showAddLesson))
                        return;
                    __VLS_ctx.removeChallenge(index);
                    // @ts-ignore
                    [removeChallenge,];
                } },
            ...{ class: "btn-delete" },
        });
        if (challenge.commands && challenge.commands.length) {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ style: {} },
            });
            for (const [cmd, ci] of __VLS_getVForSourceType((challenge.commands))) {
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (ci),
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_elements.input)({
                    placeholder: "Comando",
                    ...{ class: "form-input" },
                });
                (cmd.comando);
                __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.showAddLesson))
                                return;
                            if (!(challenge.commands && challenge.commands.length))
                                return;
                            __VLS_ctx.removeCommand(index, ci);
                            // @ts-ignore
                            [removeCommand,];
                        } },
                    ...{ class: "btn-delete" },
                });
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ style: {} },
    });
    if (__VLS_ctx.saveError) {
        // @ts-ignore
        [saveError,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ style: {} },
        });
        (__VLS_ctx.saveError);
        // @ts-ignore
        [saveError,];
    }
    if (__VLS_ctx.saveSuccess) {
        // @ts-ignore
        [saveSuccess,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ style: {} },
        });
        (__VLS_ctx.saveSuccess);
        // @ts-ignore
        [saveSuccess,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showAddLesson))
                    return;
                __VLS_ctx.showAddLesson = false;
                // @ts-ignore
                [showAddLesson,];
            } },
        ...{ class: "btn-cancel" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.saveLesson) },
        ...{ class: "btn-save" },
        disabled: (__VLS_ctx.isSaving),
    });
    // @ts-ignore
    [saveLesson, isSaving,];
    (__VLS_ctx.isSaving ? 'Saving...' : 'Save Lesson');
    // @ts-ignore
    [isSaving,];
}
/** @type {[typeof Modales, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Modales, new Modales({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    ...{ 'onConfirmDelete': {} },
    visible: (__VLS_ctx.modalVisible),
    type: (__VLS_ctx.modalType),
    title: (__VLS_ctx.modalTitle),
    data: (__VLS_ctx.modalData),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onClose': {} },
    ...{ 'onSave': {} },
    ...{ 'onConfirmDelete': {} },
    visible: (__VLS_ctx.modalVisible),
    type: (__VLS_ctx.modalType),
    title: (__VLS_ctx.modalTitle),
    data: (__VLS_ctx.modalData),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
const __VLS_5 = ({ close: {} },
    { onClose: (__VLS_ctx.cerrarModal) });
const __VLS_6 = ({ save: {} },
    { onSave: (__VLS_ctx.guardarCambios) });
const __VLS_7 = ({ confirmDelete: {} },
    { onConfirmDelete: (__VLS_ctx.confirmarEliminacion) });
// @ts-ignore
[modalVisible, modalType, modalTitle, modalData, cerrarModal, guardarCambios, confirmarEliminacion,];
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['admin']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-penguin']} */ ;
/** @type {__VLS_StyleScopedClasses['user-info']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar-header']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['config-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['users-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['search-container']} */ ;
/** @type {__VLS_StyleScopedClasses['search-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['users-table']} */ ;
/** @type {__VLS_StyleScopedClasses['nombre-col']} */ ;
/** @type {__VLS_StyleScopedClasses['email-col']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['actions-col']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['lessons-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['lessons-list']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-card']} */ ;
/** @type {__VLS_StyleScopedClasses['lesson-content']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete-lesson']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-close']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['challenges-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add-challenge']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['challenges-list']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-item']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mono']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
