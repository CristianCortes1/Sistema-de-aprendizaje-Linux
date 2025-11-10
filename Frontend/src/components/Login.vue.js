import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import { API_URL } from '../config/api';
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const router = useRouter();
async function handleLogin() {
    // Limpiar mensaje de error previo
    errorMessage.value = '';
    if (!email.value || !password.value) {
        errorMessage.value = 'Por favor llena todos los campos';
        return;
    }
    loading.value = true;
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email.value,
                password: password.value
            })
        });
        const data = await response.json();
        if (!response.ok) {
            // Manejar errores específicos del backend
            if (data.message) {
                if (data.message.includes('Account not activated') || data.message.includes('not activated')) {
                    errorMessage.value = 'Tu cuenta aún no está activada. Por favor revisa tu correo para confirmar tu cuenta.';
                }
                else if (data.message.includes('Invalid credentials') || data.message.includes('Unauthorized')) {
                    errorMessage.value = 'Usuario o contraseña incorrectos';
                }
                else {
                    errorMessage.value = data.message;
                }
            }
            else {
                errorMessage.value = 'Error al iniciar sesión. Por favor intenta de nuevo.';
            }
            return;
        }
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
        errorMessage.value = 'Error de conexión. Por favor verifica tu internet e intenta de nuevo.';
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
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
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
if (__VLS_ctx.errorMessage) {
    // @ts-ignore
    [errorMessage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "message error-message" },
    });
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
    __VLS_asFunctionalElement(__VLS_elements.circle, __VLS_elements.circle)({
        cx: "12",
        cy: "12",
        r: "10",
    });
    __VLS_asFunctionalElement(__VLS_elements.line, __VLS_elements.line)({
        x1: "15",
        y1: "9",
        x2: "9",
        y2: "15",
    });
    __VLS_asFunctionalElement(__VLS_elements.line, __VLS_elements.line)({
        x1: "9",
        y1: "9",
        x2: "15",
        y2: "15",
    });
    (__VLS_ctx.errorMessage);
    // @ts-ignore
    [errorMessage,];
}
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
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/forgot-password",
    ...{ class: "forgot-password" },
}));
const __VLS_2 = __VLS_1({
    to: "/forgot-password",
    ...{ class: "forgot-password" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "register-text" },
});
const __VLS_5 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    to: "/registro",
    ...{ class: "register-link" },
}));
const __VLS_7 = __VLS_6({
    to: "/registro",
    ...{ class: "register-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
var __VLS_8;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Background']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
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
