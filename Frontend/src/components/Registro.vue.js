export default (await import('vue')).defineComponent({
    name: 'RegistroComponent',
    emits: ['goLogin'],
    data() {
        return {
            username: '',
            correo: '',
            contraseña: ''
        };
    },
    methods: {
        async handleRegistro() {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/auth/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        correo: this.correo,
                        contraseña: this.contraseña
                    })
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const user = await response.json();
                console.log('✅ Registro exitoso:', user);
                alert('Usuario registrado con éxito');
                this.$emit('goLogin');
            }
            catch (err) {
                console.error('❌ Error en registro:', err);
                alert('No se pudo registrar el usuario');
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
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.registrarUsuario) },
    ...{ class: "form-group" },
});
// @ts-ignore
[registrarUsuario,];
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "username",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.username),
    type: "text",
    id: "username",
    name: "username",
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
    name: "correo",
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
    name: "contraseña",
    placeholder: "Escribe la contraseña",
    required: true,
});
(__VLS_ctx.contraseña);
// @ts-ignore
[contraseña,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    type: "submit",
    ...{ class: "boton-enviar" },
});
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Background']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['boton-enviar']} */ ;
var __VLS_dollars;
let __VLS_self;
