export default (await import('vue')).defineComponent({
    name: 'LoginComponent',
    emits: ['login'],
    methods: {
        handleLogin() {
            // Credenciales por defecto para pruebas
            const defaultEmail = 'admin@penguinpath.com';
            const defaultPassword = '12345';
            // Obtener valores de los inputs
            const emailInput = this.$el.querySelector('input[type="email"]');
            const passwordInput = this.$el.querySelector('input[type="password"]');
            const email = emailInput.value;
            const password = passwordInput.value;
            // Validación simple con credenciales por defecto
            if (email === defaultEmail && password === defaultPassword) {
                console.log('✅ Login exitoso!');
                this.$emit('login'); // Emite evento al componente padre
            }
            else {
                console.log('❌ Credenciales incorrectas');
                alert('Credenciales incorrectas.\nUsa:\nEmail: admin@penguinpath.com\nPassword: 12345');
            }
        }
    }
});
const __VLS_ctx = {};
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
// CSS variable injection 
// CSS variable injection end 
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
    type: "email",
    placeholder: "ejemplo@correo.com",
});
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
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleLogin) },
    ...{ class: "login-btn" },
});
// @ts-ignore
[handleLogin,];
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
__VLS_asFunctionalElement(__VLS_elements.a, __VLS_elements.a)({
    href: "#",
    ...{ class: "register-link" },
});
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
var __VLS_dollars;
let __VLS_self;
