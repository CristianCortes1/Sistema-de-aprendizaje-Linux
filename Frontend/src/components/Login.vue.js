import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
async function handleLogin() {
    if (!email.value || !password.value) {
        alert('Por favor llena todos los campos');
        return;
    }
    loading.value = true;
    try {
        const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email.value,
                password: password.value
            })
        });
        if (!response.ok)
            throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        // Guardar token y datos del usuario en localStorage
        // La API de Nest devuelve access_token; mantenemos compat con token
        const token = data.token || data.access_token;
        AuthService.setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
            id: data.user.id_Usuario,
            username: data.user.username,
            correo: data.user.correo,
            avatar: data.user.avatar,
            racha: data.user.racha,
            experiencia: data.user.experiencia,
            rol: data.user.rol
        }));
        // Redirección por rol
        if (data.user.rol === 'admin') {
            router.push('/admin');
        }
        else {
            router.push('/dashboard');
        }
    }
    catch (err) {
        console.error('❌ Error en login:', err);
        alert('Credenciales incorrectas o error en el servidor');
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-password']} */ ;
/** @type {__VLS_StyleScopedClasses['register-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "Background" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "Plantilla" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    alt: "Mi logo",
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
__VLS_asFunctionalElement(__VLS_elements.br)({});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "label-left" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    placeholder: "Ingresa tu apodo",
    value: (__VLS_ctx.email),
});
// @ts-ignore
[email,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "label-left" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    placeholder: "Ingresa tu contraseña",
});
(__VLS_ctx.password);
// @ts-ignore
[password,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleLogin) },
    ...{ class: "login-btn" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[handleLogin, loading,];
(__VLS_ctx.loading ? 'Cargando...' : 'Iniciar sesión');
// @ts-ignore
[loading,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "links" },
});
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "#",
    ...{ class: "forgot-password" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "register-text" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/registro",
    ...{ class: "register-link" },
}));
const __VLS_2 = __VLS_1({
    to: "/registro",
    ...{ class: "register-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Background']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['label-left']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['label-left']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['links']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-password']} */ ;
/** @type {__VLS_StyleScopedClasses['register-text']} */ ;
/** @type {__VLS_StyleScopedClasses['register-link']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
