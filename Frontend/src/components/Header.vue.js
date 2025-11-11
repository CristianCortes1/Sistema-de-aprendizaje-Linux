import { defineComponent, computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    props: {
        user: {
            type: Object,
            required: false,
            default: () => ({})
        },
        logout: {
            type: Function,
            required: false
        }
    },
    setup(props) {
        const router = useRouter();
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        onMounted(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localUser.value.username = parsed.username;
                localUser.value.racha = parsed.racha;
                localUser.value.experiencia = parsed.experiencia;
                localUser.value.avatar = parsed.avatar;
                localUser.value.correo = parsed.correo;
            }
        });
        const displayUser = computed(() => {
            // Si se pasa un user prop con datos, usarlo; si no, usar localUser
            return Object.keys(props.user || {}).length > 0 ? props.user : localUser.value;
        });
        const handleLogout = () => {
            if (props.logout) {
                props.logout({});
            }
            else {
                AuthService.logout();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/');
            }
        };
        return { displayUser, handleLogout };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    props: {
        user: {
            type: Object,
            required: false,
            default: () => ({})
        },
        logout: {
            type: Function,
            required: false
        }
    },
    setup(props) {
        const router = useRouter();
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        onMounted(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localUser.value.username = parsed.username;
                localUser.value.racha = parsed.racha;
                localUser.value.experiencia = parsed.experiencia;
                localUser.value.avatar = parsed.avatar;
                localUser.value.correo = parsed.correo;
            }
        });
        const displayUser = computed(() => {
            // Si se pasa un user prop con datos, usarlo; si no, usar localUser
            return Object.keys(props.user || {}).length > 0 ? props.user : localUser.value;
        });
        const handleLogout = () => {
            if (props.logout) {
                props.logout({});
            }
            else {
                AuthService.logout();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/');
            }
        };
        return { displayUser, handleLogout };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    alt: "Penguin",
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "brand" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "status" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "streak" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Racha.svg",
    alt: "Racha",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.displayUser.racha);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "xp" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/xp.svg",
    alt: "XP",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.displayUser.experiencia);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "perfil" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.displayUser.avatar || '/Assets/Avatar1.svg'),
    alt: "Perfil",
});
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.displayUser.username);
// @ts-ignore
[displayUser,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleLogout) },
    ...{ class: "logout-btn" },
});
// @ts-ignore
[handleLogout,];
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['streak']} */ ;
/** @type {__VLS_StyleScopedClasses['xp']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
export default {};
