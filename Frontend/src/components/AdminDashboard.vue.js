import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import LessonService from '../services/LessonService';
import UserService from '../services/UserService';
import Modales from './Modales.vue';
const router = useRouter();
const activeTab = ref('users');
const searchTerm = ref('');
const selectedPage = ref('');
const navigateToPage = () => {
    if (!selectedPage.value)
        return;
    if (selectedPage.value === 'admin') {
        router.push({ name: 'AdminDashboard' });
    }
    else if (selectedPage.value === 'dashboard') {
        router.push({ name: 'Dashboard' });
    }
    selectedPage.value = '';
};
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
    experiencia: 100,
    challenges: [{
            tipo: 'reto',
            description: '',
            contenido: '',
            feedback: '',
            commands: [{ comando: '', descripcion: '' }]
        }]
});
const filteredUsuarios = computed(() => {
    return usuarios.value.filter(u => u.username.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (u.correo && u.correo.toLowerCase().includes(searchTerm.value.toLowerCase())));
});
const fetchUsers = async () => {
    isLoadingUsers.value = true;
    try {
        const data = await UserService.getAll();
        const usersData = Array.isArray(data) ? data : [];
        usuarios.value = usersData.map((u) => ({
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
        alert(error.message || 'Error al cargar usuarios');
        usuarios.value = [];
    }
    finally {
        isLoadingUsers.value = false;
    }
};
const fetchLessons = async () => {
    isLoadingLessons.value = true;
    try {
        const data = await LessonService.getAll();
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
        alert(error.message || 'Error al cargar lecciones');
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
const editLesson = async (id) => {
    try {
        // Obtener los detalles completos de la lección
        const leccion = await LessonService.getById(id);
        console.log('Lección cargada para editar:', leccion);
        // Mapear los datos al formato del formulario (incluye descripcion de comandos)
        newLesson.value = {
            title: leccion.Titulo,
            experiencia: leccion.experiencia || 100,
            challenges: leccion.retos.map((reto) => ({
                tipo: reto.tipo || 'reto',
                description: reto.descripcion,
                contenido: reto.contenido || '',
                feedback: reto.Retroalimentacion || '',
                commands: reto.comandos.map((cmd) => ({
                    comando: cmd.comando,
                    descripcion: cmd.descripcion || ''
                }))
            }))
        };
        currentItemId = id;
        showAddLesson.value = true;
    }
    catch (err) {
        console.error('Error cargando lección:', err);
        alert(err.message || 'Error al cargar la lección para editar');
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
            const userData = {
                username: data.nombre,
                email: data.correo,
                rol: data.rol,
                activo: data.estado === 'activo'
            };
            if (currentItemId) {
                await UserService.update(currentItemId, userData);
                alert('Usuario actualizado correctamente');
            }
            else {
                await UserService.create(userData);
                alert('Usuario creado correctamente');
            }
            await fetchUsers();
        }
        else {
            const lessonData = {
                Titulo: data.titulo,
                Descripcion: data.descripcion
            };
            if (currentItemId) {
                await LessonService.update(currentItemId, lessonData);
                alert('Lección actualizada correctamente');
            }
            else {
                await LessonService.create(lessonData);
                alert('Lección creada correctamente');
            }
            await fetchLessons();
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
        if (currentContext === 'usuarios') {
            await UserService.delete(currentItemId);
            await fetchUsers();
        }
        else {
            await LessonService.delete(currentItemId);
            await fetchLessons();
        }
        alert('Eliminado correctamente');
        cerrarModal();
    }
    catch (err) {
        console.error('Error eliminando:', err);
        alert(`Error al eliminar: ${err.message}`);
    }
};
// Funciones para el modal de agregar lección con challenges
const addChallenge = () => {
    newLesson.value.challenges.push({
        tipo: 'reto',
        description: '',
        contenido: '',
        feedback: '',
        commands: [{ comando: '', descripcion: '' }]
    });
};
const addCommand = (challengeIndex) => {
    const ch = newLesson.value.challenges[challengeIndex];
    if (!ch.commands)
        ch.commands = [];
    ch.commands.push({ comando: '', descripcion: '' });
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
            tipo: c.tipo || 'reto',
            descripcion: c.description,
            contenido: c.contenido || null,
            Retroalimentacion: c.feedback || null,
            comandos: c.tipo === 'explicacion' ? [] : c.commands.map((cmd) => ({
                comando: cmd.comando,
                descripcion: cmd.descripcion?.trim() || undefined
            }))
        }))
    };
};
const saveLesson = async () => {
    saveError.value = '';
    saveSuccess.value = '';
    // Validación
    if (!newLesson.value.title || newLesson.value.challenges.length === 0) {
        saveError.value = 'El título y al menos un reto/explicación son obligatorios.';
        return;
    }
    // Validaciones de longitud (alineadas con la base de datos)
    // - Lecciones.Titulo: VARCHAR(150)
    // - Retos.descripcion: VARCHAR(500)
    // - Comandos.comando: VARCHAR(100)
    // - Comandos.descripcion: VARCHAR(200)
    if (newLesson.value.title.length > 150) {
        saveError.value = 'El título no puede superar 150 caracteres.';
        return;
    }
    // Validar que cada reto tenga al menos un comando (solo si es tipo "reto")
    for (const challenge of newLesson.value.challenges) {
        if (!challenge.description) {
            saveError.value = 'Todos los elementos deben tener una descripción/título.';
            return;
        }
        if (challenge.description.length > 500) {
            saveError.value = 'La descripción/título de cada elemento no puede superar 500 caracteres.';
            return;
        }
        if (challenge.tipo === 'reto' && (!challenge.commands || challenge.commands.length === 0 || !challenge.commands[0].comando)) {
            saveError.value = 'Cada reto debe tener al menos un comando válido.';
            return;
        }
        if (challenge.tipo === 'reto' && challenge.commands) {
            for (const cmd of challenge.commands) {
                if (!cmd || typeof cmd.comando !== 'string')
                    continue;
                if (cmd.comando.length > 100) {
                    saveError.value = 'Cada comando no puede superar 100 caracteres.';
                    return;
                }
                if (cmd.descripcion && cmd.descripcion.length > 200) {
                    saveError.value = 'La descripción de cada comando no puede superar 200 caracteres.';
                    return;
                }
            }
        }
        if (challenge.tipo === 'explicacion' && !challenge.contenido) {
            saveError.value = 'Cada explicación debe tener contenido.';
            return;
        }
    }
    isSaving.value = true;
    try {
        const payload = toRequestPayload();
        console.log('Enviando payload:', JSON.stringify(payload, null, 2));
        if (currentItemId) {
            // Editar lección existente
            await LessonService.update(currentItemId, payload);
            saveSuccess.value = 'Lección actualizada correctamente.';
        }
        else {
            // Crear nueva lección
            await LessonService.create(payload);
            saveSuccess.value = 'Lección creada correctamente.';
        }
        await fetchLessons();
        // Reset form
        newLesson.value = {
            title: '',
            experiencia: 100,
            challenges: [{
                    description: '',
                    feedback: '',
                    commands: [{ comando: '', descripcion: '' }]
                }]
        };
        currentItemId = null;
        showAddLesson.value = false;
    }
    catch (err) {
        console.error('Error saving lesson:', err);
        saveError.value = err.message || 'Error al guardar la lección.';
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
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
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
/** @type {__VLS_StyleScopedClasses['mono']} */ ;
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "nav-selector" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "pagina",
    ...{ class: "nav-label" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    ...{ onChange: (__VLS_ctx.navigateToPage) },
    id: "pagina",
    value: (__VLS_ctx.selectedPage),
    ...{ class: "nav-select" },
});
// @ts-ignore
[navigateToPage, selectedPage,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "admin",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "dashboard",
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
                __VLS_ctx.currentItemId = null;
                // @ts-ignore
                [showAddLesson, currentItemId,];
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
    (__VLS_ctx.currentItemId ? 'Editar Lección' : 'Agregar Lección');
    // @ts-ignore
    [currentItemId,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showAddLesson))
                    return;
                __VLS_ctx.showAddLesson = false;
                __VLS_ctx.currentItemId = null;
                // @ts-ignore
                [showAddLesson, currentItemId,];
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
        placeholder: "Ej: Comandos básicos de listado",
        ...{ class: "form-input" },
    });
    // @ts-ignore
    [newLesson,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "form-group" },
    });
    __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "number",
        min: "1",
        placeholder: "100",
        ...{ class: "form-input" },
    });
    (__VLS_ctx.newLesson.experiencia);
    // @ts-ignore
    [newLesson,];
    __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
        ...{ style: {} },
    });
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
        ...{ class: "btn-add" },
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
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            ...{ style: {} },
        });
        (index + 1);
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.showAddLesson))
                        return;
                    __VLS_ctx.removeChallenge(index);
                    // @ts-ignore
                    [removeChallenge,];
                } },
            ...{ class: "btn-delete" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            value: (challenge.tipo),
            ...{ class: "form-input" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "explicacion",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "reto",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
            ...{ style: {} },
        });
        (challenge.tipo === 'explicacion' ? 'Título de la Explicación' : 'Descripción del Reto');
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (challenge.description),
            placeholder: (challenge.tipo === 'explicacion' ? 'Ej: ¿Qué es la terminal de Linux?' : 'Ej: Lista todos los archivos del directorio actual'),
            ...{ class: "form-input" },
        });
        if (challenge.tipo === 'explicacion') {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "form-group" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
                value: (challenge.contenido),
                placeholder: "Puedes usar HTML o Markdown. Ej: <h2>La Terminal</h2><p>Es una interfaz...</p>",
                rows: "6",
                ...{ class: "form-textarea" },
            });
            __VLS_asFunctionalElement(__VLS_elements.small, __VLS_elements.small)({
                ...{ style: {} },
            });
        }
        if (challenge.tipo === 'reto') {
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "form-group" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
                value: (challenge.feedback),
                placeholder: "Ej: ¡Excelente! Has usado el comando correcto",
                rows: "2",
                ...{ class: "form-textarea" },
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ class: "form-group" },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.showAddLesson))
                            return;
                        if (!(challenge.tipo === 'reto'))
                            return;
                        __VLS_ctx.addCommand(index);
                        // @ts-ignore
                        [addCommand,];
                    } },
                ...{ class: "btn-add" },
                ...{ style: {} },
            });
            for (const [cmd, ci] of __VLS_getVForSourceType((challenge.commands))) {
                __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
                    key: (ci),
                    ...{ style: {} },
                });
                __VLS_asFunctionalElement(__VLS_elements.input)({
                    placeholder: "Ej: ls -la",
                    ...{ class: "form-input mono" },
                    ...{ style: {} },
                });
                (cmd.comando);
                __VLS_asFunctionalElement(__VLS_elements.input)({
                    placeholder: "Descripción del comando (opcional)",
                    ...{ class: "form-input" },
                    ...{ style: {} },
                });
                (cmd.descripcion);
                if (challenge.commands.length > 1) {
                    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
                        ...{ onClick: (...[$event]) => {
                                if (!(__VLS_ctx.showAddLesson))
                                    return;
                                if (!(challenge.tipo === 'reto'))
                                    return;
                                if (!(challenge.commands.length > 1))
                                    return;
                                __VLS_ctx.removeCommand(index, ci);
                                // @ts-ignore
                                [removeCommand,];
                            } },
                        ...{ class: "btn-delete" },
                        ...{ style: {} },
                    });
                }
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
                __VLS_ctx.currentItemId = null;
                // @ts-ignore
                [showAddLesson, currentItemId,];
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
    (__VLS_ctx.isSaving ? 'Guardando...' : 'Guardar Lección');
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
/** @type {__VLS_StyleScopedClasses['nav-selector']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-label']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-select']} */ ;
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
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['challenges-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['challenges-list']} */ ;
/** @type {__VLS_StyleScopedClasses['challenge-item']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['mono']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
