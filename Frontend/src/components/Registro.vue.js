import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'RegistroComponent',
    setup() {
        const username = ref('');
        const correo = ref('');
        const password = ref('');
        const loading = ref(false);
        const router = useRouter();
        const handleRegistro = async () => {
            if (!username.value || !correo.value || !password.value) {
                alert('Por favor llena todos los campos');
                return;
            }
            loading.value = true;
            try {
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/auth/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.value,
                        correo: correo.value,
                        password: password.value
                    })
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const user = await response.json();
                console.log('✅ Registro exitoso:', user);
                alert('Usuario registrado con éxito');
                router.push('/'); // 👈 redirige directo al login
            }
            catch (err) {
                console.error('❌ Error en registro:', err);
                alert('No se pudo registrar el usuario');
            }
            finally {
                loading.value = false;
            }
        };
        return {
            username,
            correo,
            contraseña: password,
            loading,
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
        const loading = ref(false);
        const router = useRouter();
        const handleRegistro = async () => {
            if (!username.value || !correo.value || !password.value) {
                alert('Por favor llena todos los campos');
                return;
            }
            loading.value = true;
            try {
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/auth/registro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username.value,
                        correo: correo.value,
                        password: password.value
                    })
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const user = await response.json();
                console.log('✅ Registro exitoso:', user);
                alert('Usuario registrado con éxito');
                router.push('/'); // 👈 redirige directo al login
            }
            catch (err) {
                console.error('❌ Error en registro:', err);
                alert('No se pudo registrar el usuario');
            }
            finally {
                loading.value = false;
            }
        };
        return {
            username,
            correo,
            contraseña: password,
            loading,
            handleRegistro
        };
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
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
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
    placeholder: "Escribe la contraseña",
    required: true,
});
(__VLS_ctx.contraseña);
// @ts-ignore
[contraseña,];
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
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
    ...{ class: "login-btn" },
}));
const __VLS_2 = __VLS_1({
    to: "/",
    ...{ class: "login-btn" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['login']} */ ;
/** @type {__VLS_StyleScopedClasses['Background']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['boton-enviar']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
export default {};
