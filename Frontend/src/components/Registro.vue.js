import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { API_URL } from '../config/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'RegistroComponent',
    setup() {
        const username = ref('');
        const correo = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const acceptedPrivacy = ref(false);
        const acceptedTerms = ref(false);
        const loading = ref(false);
        const errorMessage = ref('');
        const successMessage = ref('');
        const router = useRouter();
        const handleRegistro = async () => {
            // Limpiar mensajes previos
            errorMessage.value = '';
            successMessage.value = '';
            // Validaciones
            if (!username.value || !correo.value || !password.value || !confirmPassword.value) {
                errorMessage.value = 'Por favor llena todos los campos';
                return;
            }
            if (password.value !== confirmPassword.value) {
                errorMessage.value = 'Las contraseñas no coinciden';
                return;
            }
            if (password.value.length < 6) {
                errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
                return;
            }
            if (!acceptedPrivacy.value) {
                errorMessage.value = 'Debes aceptar la Política de Privacidad';
                return;
            }
            if (!acceptedTerms.value) {
                errorMessage.value = 'Debes aceptar los Términos y Condiciones';
                return;
            }
            loading.value = true;
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.value,
                        correo: correo.value,
                        password: password.value
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    // Manejar errores específicos del backend
                    if (data.message) {
                        if (data.message.includes('Username already exists')) {
                            errorMessage.value = 'Este nombre de usuario ya está en uso';
                        }
                        else if (data.message.includes('Email already exists')) {
                            errorMessage.value = 'Este correo ya está registrado';
                        }
                        else {
                            errorMessage.value = data.message;
                        }
                    }
                    else {
                        errorMessage.value = 'Error al registrar usuario';
                    }
                    return;
                }
                console.log('✅ Registro exitoso:', data);
                successMessage.value = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta';
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
            catch (err) {
                console.error('❌ Error en registro:', err);
                errorMessage.value = 'Error de conexión. Por favor intenta de nuevo';
            }
            finally {
                loading.value = false;
            }
        };
        return {
            username,
            correo,
            contraseña: password,
            confirmPassword,
            acceptedPrivacy,
            acceptedTerms,
            loading,
            errorMessage,
            successMessage,
            handleRegistro
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'RegistroComponent',
    setup() {
        const username = ref('');
        const correo = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const acceptedPrivacy = ref(false);
        const acceptedTerms = ref(false);
        const loading = ref(false);
        const errorMessage = ref('');
        const successMessage = ref('');
        const router = useRouter();
        const handleRegistro = async () => {
            // Limpiar mensajes previos
            errorMessage.value = '';
            successMessage.value = '';
            // Validaciones
            if (!username.value || !correo.value || !password.value || !confirmPassword.value) {
                errorMessage.value = 'Por favor llena todos los campos';
                return;
            }
            if (password.value !== confirmPassword.value) {
                errorMessage.value = 'Las contraseñas no coinciden';
                return;
            }
            if (password.value.length < 6) {
                errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
                return;
            }
            if (!acceptedPrivacy.value) {
                errorMessage.value = 'Debes aceptar la Política de Privacidad';
                return;
            }
            if (!acceptedTerms.value) {
                errorMessage.value = 'Debes aceptar los Términos y Condiciones';
                return;
            }
            loading.value = true;
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.value,
                        correo: correo.value,
                        password: password.value
                    })
                });
                const data = await response.json();
                if (!response.ok) {
                    // Manejar errores específicos del backend
                    if (data.message) {
                        if (data.message.includes('Username already exists')) {
                            errorMessage.value = 'Este nombre de usuario ya está en uso';
                        }
                        else if (data.message.includes('Email already exists')) {
                            errorMessage.value = 'Este correo ya está registrado';
                        }
                        else {
                            errorMessage.value = data.message;
                        }
                    }
                    else {
                        errorMessage.value = 'Error al registrar usuario';
                    }
                    return;
                }
                console.log('✅ Registro exitoso:', data);
                successMessage.value = '¡Registro exitoso! Revisa tu correo para confirmar tu cuenta';
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
            catch (err) {
                console.error('❌ Error en registro:', err);
                errorMessage.value = 'Error de conexión. Por favor intenta de nuevo';
            }
            finally {
                loading.value = false;
            }
        };
        return {
            username,
            correo,
            contraseña: password,
            confirmPassword,
            acceptedPrivacy,
            acceptedTerms,
            loading,
            errorMessage,
            successMessage,
            handleRegistro
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['legal-link']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-link']} */ ;
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
if (__VLS_ctx.successMessage) {
    // @ts-ignore
    [successMessage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "message success-message" },
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
    (__VLS_ctx.successMessage);
    // @ts-ignore
    [successMessage,];
}
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.handleRegistro) },
    ...{ class: "form-group" },
});
// @ts-ignore
[handleRegistro,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "username",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.username),
    type: "text",
    id: "username",
    placeholder: "Escribe el apodo",
    required: true,
});
// @ts-ignore
[username,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "correo",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "email",
    id: "correo",
    placeholder: "Escribe el correo",
    required: true,
});
(__VLS_ctx.correo);
// @ts-ignore
[correo,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "contraseña",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    id: "contraseña",
    placeholder: "Mínimo 6 caracteres",
    required: true,
});
(__VLS_ctx.contraseña);
// @ts-ignore
[contraseña,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "confirmPassword",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    id: "confirmPassword",
    placeholder: "Repite la contraseña",
    required: true,
});
(__VLS_ctx.confirmPassword);
// @ts-ignore
[confirmPassword,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "checkbox-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "checkbox-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "checkbox",
    required: true,
});
(__VLS_ctx.acceptedPrivacy);
// @ts-ignore
[acceptedPrivacy,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/privacy-policy",
    ...{ class: "inline-link" },
}));
const __VLS_2 = __VLS_1({
    to: "/privacy-policy",
    ...{ class: "inline-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "checkbox-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "checkbox-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "checkbox",
    required: true,
});
(__VLS_ctx.acceptedTerms);
// @ts-ignore
[acceptedTerms,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
const __VLS_5 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    to: "/terms",
    ...{ class: "inline-link" },
}));
const __VLS_7 = __VLS_6({
    to: "/terms",
    ...{ class: "inline-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
var __VLS_8;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    ...{ class: "boton-enviar" },
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
(__VLS_ctx.loading ? 'Registrando...' : 'Registrar');
// @ts-ignore
[loading,];
const __VLS_10 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    to: "/",
    ...{ class: "back-link" },
}));
const __VLS_12 = __VLS_11({
    to: "/",
    ...{ class: "back-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_14 } = __VLS_13.slots;
var __VLS_13;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "legal-links" },
});
const __VLS_15 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    to: "/privacy-policy",
    ...{ class: "legal-link" },
}));
const __VLS_17 = __VLS_16({
    to: "/privacy-policy",
    ...{ class: "legal-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_19 } = __VLS_18.slots;
var __VLS_18;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "separator" },
});
const __VLS_20 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    to: "/terms",
    ...{ class: "legal-link" },
}));
const __VLS_22 = __VLS_21({
    to: "/terms",
    ...{ class: "legal-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_24 } = __VLS_23.slots;
var __VLS_23;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Background']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-link']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-link']} */ ;
/** @type {__VLS_StyleScopedClasses['boton-enviar']} */ ;
/** @type {__VLS_StyleScopedClasses['back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['legal-links']} */ ;
/** @type {__VLS_StyleScopedClasses['legal-link']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['legal-link']} */ ;
export default {};
