import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import Header from './Header.vue';
import Footer from './Footer.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
    name: 'Configuracion',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        const selectedAvatar = ref('');
        const newUsername = ref('');
        const passwordData = ref({
            current: '',
            new: '',
            confirm: ''
        });
        // Opciones de avatares
        const avatarOptions = ref([
            'https://ui-avatars.com/api/?name=Avatar1&background=FF6B6B&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar2&background=4ECDC4&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar3&background=45B7D1&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar4&background=FFA07A&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar5&background=98D8C8&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar6&background=F7DC6F&color=fff&size=128&bold=true'
        ]);
        onMounted(() => {
            document.title = 'Configuración - Sistema de Aprendizaje Linux';
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localUser.value = {
                    username: parsed.username || '',
                    correo: parsed.correo || '',
                    racha: parsed.racha || 0,
                    experiencia: parsed.experiencia || 0,
                    avatar: parsed.avatar || ''
                };
                selectedAvatar.value = parsed.avatar || '';
                newUsername.value = parsed.username || '';
            }
        });
        const displayUser = computed(() => {
            return localUser.value;
        });
        const getDefaultAvatar = (username) => {
            const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
            const colorIndex = username.length % colors.length;
            return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`;
        };
        const updateUsername = async () => {
            if (!newUsername.value.trim()) {
                alert('Por favor ingresa un nombre de usuario');
                return;
            }
            try {
                const token = AuthService.getToken();
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/update', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: newUsername.value })
                });
                if (response.ok) {
                    const updatedUser = { ...localUser.value, username: newUsername.value };
                    localUser.value = updatedUser;
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    alert('Nombre de usuario actualizado correctamente');
                }
                else {
                    alert('Error al actualizar el nombre de usuario');
                }
            }
            catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar el nombre de usuario');
            }
        };
        const updatePassword = async () => {
            if (!passwordData.value.current || !passwordData.value.new || !passwordData.value.confirm) {
                alert('Por favor completa todos los campos');
                return;
            }
            if (passwordData.value.new !== passwordData.value.confirm) {
                alert('Las contraseñas no coinciden');
                return;
            }
            try {
                const token = AuthService.getToken();
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/change-password', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentPassword: passwordData.value.current,
                        newPassword: passwordData.value.new
                    })
                });
                if (response.ok) {
                    alert('Contraseña actualizada correctamente');
                    passwordData.value = { current: '', new: '', confirm: '' };
                }
                else {
                    alert('Error al actualizar la contraseña. Verifica tu contraseña actual.');
                }
            }
            catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar la contraseña');
            }
        };
        const handleLogout = () => {
            AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/');
        };
        return {
            displayUser,
            selectedAvatar,
            newUsername,
            passwordData,
            avatarOptions,
            getDefaultAvatar,
            updateUsername,
            updatePassword,
            handleLogout
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Configuracion',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        const selectedAvatar = ref('');
        const newUsername = ref('');
        const passwordData = ref({
            current: '',
            new: '',
            confirm: ''
        });
        // Opciones de avatares
        const avatarOptions = ref([
            'https://ui-avatars.com/api/?name=Avatar1&background=FF6B6B&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar2&background=4ECDC4&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar3&background=45B7D1&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar4&background=FFA07A&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar5&background=98D8C8&color=fff&size=128&bold=true',
            'https://ui-avatars.com/api/?name=Avatar6&background=F7DC6F&color=fff&size=128&bold=true'
        ]);
        onMounted(() => {
            document.title = 'Configuración - Sistema de Aprendizaje Linux';
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localUser.value = {
                    username: parsed.username || '',
                    correo: parsed.correo || '',
                    racha: parsed.racha || 0,
                    experiencia: parsed.experiencia || 0,
                    avatar: parsed.avatar || ''
                };
                selectedAvatar.value = parsed.avatar || '';
                newUsername.value = parsed.username || '';
            }
        });
        const displayUser = computed(() => {
            return localUser.value;
        });
        const getDefaultAvatar = (username) => {
            const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
            const colorIndex = username.length % colors.length;
            return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`;
        };
        const updateUsername = async () => {
            if (!newUsername.value.trim()) {
                alert('Por favor ingresa un nombre de usuario');
                return;
            }
            try {
                const token = AuthService.getToken();
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/update', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: newUsername.value })
                });
                if (response.ok) {
                    const updatedUser = { ...localUser.value, username: newUsername.value };
                    localUser.value = updatedUser;
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    alert('Nombre de usuario actualizado correctamente');
                }
                else {
                    alert('Error al actualizar el nombre de usuario');
                }
            }
            catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar el nombre de usuario');
            }
        };
        const updatePassword = async () => {
            if (!passwordData.value.current || !passwordData.value.new || !passwordData.value.confirm) {
                alert('Por favor completa todos los campos');
                return;
            }
            if (passwordData.value.new !== passwordData.value.confirm) {
                alert('Las contraseñas no coinciden');
                return;
            }
            try {
                const token = AuthService.getToken();
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/change-password', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentPassword: passwordData.value.current,
                        newPassword: passwordData.value.new
                    })
                });
                if (response.ok) {
                    alert('Contraseña actualizada correctamente');
                    passwordData.value = { current: '', new: '', confirm: '' };
                }
                else {
                    alert('Error al actualizar la contraseña. Verifica tu contraseña actual.');
                }
            }
            catch (error) {
                console.error('Error:', error);
                alert('Error al actualizar la contraseña');
            }
        };
        const handleLogout = () => {
            AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/');
        };
        return {
            displayUser,
            selectedAvatar,
            newUsername,
            passwordData,
            avatarOptions,
            getDefaultAvatar,
            updateUsername,
            updatePassword,
            handleLogout
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = {
    Header,
    Footer
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['current-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-option']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-option']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-option']} */ ;
/** @type {__VLS_StyleScopedClasses['text-input']} */ ;
/** @type {__VLS_StyleScopedClasses['text-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-grid']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page" },
});
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    user: (__VLS_ctx.displayUser),
    logout: (__VLS_ctx.handleLogout),
}));
const __VLS_2 = __VLS_1({
    user: (__VLS_ctx.displayUser),
    logout: (__VLS_ctx.handleLogout),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[displayUser, handleLogout,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "section" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-grid" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-value" },
});
(__VLS_ctx.displayUser.racha);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-value" },
});
(__VLS_ctx.displayUser.experiencia);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-value" },
});
(__VLS_ctx.displayUser.username);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-item" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "info-value" },
});
(__VLS_ctx.displayUser.correo);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "avatar-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "current-avatar" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.displayUser.avatar || __VLS_ctx.getDefaultAvatar(__VLS_ctx.displayUser.username)),
    alt: "Avatar actual",
});
// @ts-ignore
[displayUser, displayUser, getDefaultAvatar,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "avatar-info" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "avatar-label" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "avatar-sublabel" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "section" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "avatar-grid" },
});
for (const [avatar, index] of __VLS_getVForSourceType((__VLS_ctx.avatarOptions))) {
    // @ts-ignore
    [avatarOptions,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.selectedAvatar = avatar;
                // @ts-ignore
                [selectedAvatar,];
            } },
        key: (index),
        ...{ class: (['avatar-option', { 'selected': __VLS_ctx.selectedAvatar === avatar }]) },
    });
    // @ts-ignore
    [selectedAvatar,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (avatar),
        alt: (`Avatar ${index + 1}`),
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "section" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.newUsername),
    placeholder: "Nuevo nombre de usuario",
    ...{ class: "text-input" },
});
// @ts-ignore
[newUsername,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.updateUsername) },
    ...{ class: "btn-primary" },
});
// @ts-ignore
[updateUsername,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "section" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    placeholder: "Contraseña actual",
    ...{ class: "text-input" },
});
(__VLS_ctx.passwordData.current);
// @ts-ignore
[passwordData,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    placeholder: "Nueva contraseña",
    ...{ class: "text-input" },
});
(__VLS_ctx.passwordData.new);
// @ts-ignore
[passwordData,];
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    placeholder: "Confirmar nueva contraseña",
    ...{ class: "text-input" },
});
(__VLS_ctx.passwordData.confirm);
// @ts-ignore
[passwordData,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.updatePassword) },
    ...{ class: "btn-primary" },
});
// @ts-ignore
[updatePassword,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "section" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "section-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleLogout) },
    ...{ class: "btn-danger" },
});
// @ts-ignore
[handleLogout,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "footer-info" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "footer-links" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "#",
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "#",
});
const __VLS_5 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    goInicio: (() => __VLS_ctx.$router.push('/dashboard')),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}));
const __VLS_7 = __VLS_6({
    goInicio: (() => __VLS_ctx.$router.push('/dashboard')),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[$router, $router, $router, $router,];
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-section']} */ ;
/** @type {__VLS_StyleScopedClasses['current-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-info']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-label']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-sublabel']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-option']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['text-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['text-input']} */ ;
/** @type {__VLS_StyleScopedClasses['text-input']} */ ;
/** @type {__VLS_StyleScopedClasses['text-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['section-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-info']} */ ;
/** @type {__VLS_StyleScopedClasses['footer-links']} */ ;
export default {};
