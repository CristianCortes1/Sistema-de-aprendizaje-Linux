import { defineComponent } from 'vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    props: {
        user: {
            type: Object,
            required: true
        },
        logout: {
            type: Function,
            required: true
        }
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    props: {
        user: {
            type: Object,
            required: true
        },
        logout: {
            type: Function,
            required: true
        }
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
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
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
(__VLS_ctx.user.racha);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "xp" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/xp.svg",
    alt: "XP",
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.user.experiencia);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "perfil" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: (__VLS_ctx.user.avatar),
    alt: "Perfil",
});
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
(__VLS_ctx.user.username);
// @ts-ignore
[user,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.logout) },
    ...{ class: "logout-btn" },
});
// @ts-ignore
[logout,];
__VLS_asFunctionalElement(__VLS_elements.svg, __VLS_elements.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
    ...{ class: "feather feather-log-out" },
});
__VLS_asFunctionalElement(__VLS_elements.path)({
    d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
});
__VLS_asFunctionalElement(__VLS_elements.polyline)({
    points: "16 17 21 12 16 7",
});
__VLS_asFunctionalElement(__VLS_elements.line)({
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12",
});
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['streak']} */ ;
/** @type {__VLS_StyleScopedClasses['xp']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['feather']} */ ;
/** @type {__VLS_StyleScopedClasses['feather-log-out']} */ ;
export default {};
