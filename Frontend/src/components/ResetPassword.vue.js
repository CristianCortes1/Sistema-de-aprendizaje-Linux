import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { API_URL } from '../config/api';
const router = useRouter();
const route = useRoute();
const token = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
onMounted(() => {
    // Obtener el token de la URL
    token.value = route.query.token || '';
    if (!token.value) {
        errorMessage.value = 'Token de recuperación no válido. Por favor solicita un nuevo enlace.';
    }
});
const handleResetPassword = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    // Validaciones
    if (!token.value) {
        errorMessage.value = 'Token de recuperación no válido';
        return;
    }
    if (!newPassword.value || !confirmNewPassword.value) {
        errorMessage.value = 'Por favor completa todos los campos';
        return;
    }
    if (newPassword.value.length < 6) {
        errorMessage.value = 'La nueva contraseña debe tener al menos 6 caracteres';
        return;
    }
    if (newPassword.value !== confirmNewPassword.value) {
        errorMessage.value = 'Las contraseñas no coinciden';
        return;
    }
    isLoading.value = true;
    try {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token.value,
                newPassword: newPassword.value,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            successMessage.value = '¡Contraseña restablecida exitosamente! Redirigiendo al inicio de sesión...';
            // Limpiar el formulario
            newPassword.value = '';
            confirmNewPassword.value = '';
            // Redirigir después de 3 segundos
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
        else {
            if (data.message && data.message.includes('Token inválido o expirado')) {
                errorMessage.value = 'El enlace de recuperación ha expirado o no es válido. Por favor solicita uno nuevo.';
            }
            else {
                errorMessage.value = data.message || 'Error al restablecer la contraseña';
            }
        }
    }
    catch (error) {
        console.error('Error:', error);
        errorMessage.value = 'Error de conexión. Por favor intenta nuevamente más tarde.';
    }
    finally {
        isLoading.value = false;
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
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "reset-password-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "reset-password-card" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "back-button" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "back-button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
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
__VLS_asFunctionalElement(__VLS_elements.line, __VLS_elements.line)({
    x1: "19",
    y1: "12",
    x2: "5",
    y2: "12",
});
__VLS_asFunctionalElement(__VLS_elements.polyline, __VLS_elements.polyline)({
    points: "12 19 5 12 12 5",
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    alt: "Penguin Path Logo",
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.handleResetPassword) },
});
// @ts-ignore
[handleResetPassword,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "newPassword",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    id: "newPassword",
    type: "password",
    placeholder: "Mínimo 6 caracteres",
    disabled: (__VLS_ctx.isLoading || !__VLS_ctx.token),
});
(__VLS_ctx.newPassword);
// @ts-ignore
[isLoading, token, newPassword,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "confirmNewPassword",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    id: "confirmNewPassword",
    type: "password",
    placeholder: "Repite tu nueva contraseña",
    disabled: (__VLS_ctx.isLoading || !__VLS_ctx.token),
});
(__VLS_ctx.confirmNewPassword);
// @ts-ignore
[isLoading, token, confirmNewPassword,];
if (__VLS_ctx.errorMessage) {
    // @ts-ignore
    [errorMessage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-message" },
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
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.errorMessage);
    // @ts-ignore
    [errorMessage,];
}
if (__VLS_ctx.successMessage) {
    // @ts-ignore
    [successMessage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "success-message" },
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
    __VLS_asFunctionalElement(__VLS_elements.path, __VLS_elements.path)({
        d: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
    });
    __VLS_asFunctionalElement(__VLS_elements.polyline, __VLS_elements.polyline)({
        points: "22 4 12 14.01 9 11.01",
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
    (__VLS_ctx.successMessage);
    // @ts-ignore
    [successMessage,];
}
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    ...{ class: "submit-button" },
    disabled: (__VLS_ctx.isLoading || !__VLS_ctx.token),
});
// @ts-ignore
[isLoading, token,];
(__VLS_ctx.isLoading ? 'Restableciendo...' : 'Restablecer contraseña');
// @ts-ignore
[isLoading,];
/** @type {__VLS_StyleScopedClasses['reset-password-container']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['back-button']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
