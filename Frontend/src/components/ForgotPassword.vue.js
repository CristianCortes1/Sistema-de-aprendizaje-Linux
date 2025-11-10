import { ref } from 'vue';
import { API_URL } from '../config/api';
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
const handleForgotPassword = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    // Validaciones
    if (!email.value) {
        errorMessage.value = 'Por favor ingresa tu correo electrónico';
        return;
    }
    if (!validateEmail(email.value)) {
        errorMessage.value = 'Por favor ingresa un correo electrónico válido';
        return;
    }
    isLoading.value = true;
    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value }),
        });
        const data = await response.json();
        if (response.ok) {
            successMessage.value =
                'Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.';
            email.value = '';
        }
        else {
            errorMessage.value = data.message || 'Error al procesar la solicitud';
        }
    }
    catch (error) {
        console.error('Error:', error);
        errorMessage.value =
            'Error de conexión. Por favor intenta nuevamente más tarde.';
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
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-login']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-login']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "forgot-password-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "forgot-password-card" },
});
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
    ...{ onSubmit: (__VLS_ctx.handleForgotPassword) },
});
// @ts-ignore
[handleForgotPassword,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "email",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    id: "email",
    type: "email",
    placeholder: "tu@correo.com",
    disabled: (__VLS_ctx.isLoading),
});
(__VLS_ctx.email);
// @ts-ignore
[isLoading, email,];
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
    disabled: (__VLS_ctx.isLoading),
});
// @ts-ignore
[isLoading,];
(__VLS_ctx.isLoading ? 'Enviando...' : 'Enviar enlace de recuperación');
// @ts-ignore
[isLoading,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "back-to-login" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
}));
const __VLS_2 = __VLS_1({
    to: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['forgot-password-container']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['submit-button']} */ ;
/** @type {__VLS_StyleScopedClasses['back-to-login']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
