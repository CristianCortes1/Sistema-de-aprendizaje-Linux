import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// Simple tabs: Users and Lessons
const activeTab = ref('users');
function goBack() {
    router.push('/dashboard');
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "admin" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "admin-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "brand" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "/Assets/Archivos.svg",
    alt: "logo",
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "back" },
});
// @ts-ignore
[goBack,];
__VLS_asFunctionalElement(__VLS_elements.aside, __VLS_elements.aside)({
    ...{ class: "sidebar" },
});
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'users';
            // @ts-ignore
            [activeTab,];
        } },
    ...{ class: ({ active: __VLS_ctx.activeTab === 'users' }) },
});
// @ts-ignore
[activeTab,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.activeTab = 'lessons';
            // @ts-ignore
            [activeTab,];
        } },
    ...{ class: ({ active: __VLS_ctx.activeTab === 'lessons' }) },
});
// @ts-ignore
[activeTab,];
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "content" },
});
if (__VLS_ctx.activeTab === 'users') {
    // @ts-ignore
    [activeTab,];
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({});
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.section, __VLS_elements.section)({});
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
/** @type {__VLS_StyleScopedClasses['admin']} */ ;
/** @type {__VLS_StyleScopedClasses['admin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
