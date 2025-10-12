import { defineComponent, onMounted, ref } from 'vue';
import AuthService from '../services/AuthService';
import { useRouter } from 'vue-router';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'Ranking',
    setup() {
        const router = useRouter();
        const ranking = ref([]);
        onMounted(async () => {
            try {
                const token = AuthService.getToken();
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/ranking', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                ranking.value = data;
            }
            catch (error) {
                console.error('Error fetching ranking:', error);
                // Fallback to mock data if API fails
                ranking.value = [
                    { username: 'tux', experiencia: 1500 },
                    { username: 'root', experiencia: 900 },
                    { username: 'penguin', experiencia: 600 },
                ];
            }
        });
        const goBack = () => router.push('/dashboard');
        return { ranking, goBack };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Ranking',
    setup() {
        const router = useRouter();
        const ranking = ref([]);
        onMounted(async () => {
            try {
                const token = AuthService.getToken();
                const response = await fetch('https://sistema-de-aprendizaje-linux-production.up.railway.app/users/ranking', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                ranking.value = data;
            }
            catch (error) {
                console.error('Error fetching ranking:', error);
                // Fallback to mock data if API fails
                ranking.value = [
                    { username: 'tux', experiencia: 1500 },
                    { username: 'root', experiencia: 900 },
                    { username: 'penguin', experiencia: 600 },
                ];
            }
        });
        const goBack = () => router.push('/dashboard');
        return { ranking, goBack };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page" },
});
__VLS_asFunctionalElement(__VLS_elements.header, __VLS_elements.header)({
    ...{ class: "header" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    ...{ class: "back" },
});
// @ts-ignore
[goBack,];
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({});
__VLS_asFunctionalElement(__VLS_elements.ul, __VLS_elements.ul)({
    ...{ class: "list" },
});
for (const [u, i] of __VLS_getVForSourceType((__VLS_ctx.ranking))) {
    // @ts-ignore
    [ranking,];
    __VLS_asFunctionalElement(__VLS_elements.li, __VLS_elements.li)({
        key: (u.username),
        ...{ class: "item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "pos" },
    });
    (i + 1);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "name" },
    });
    (u.username);
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "xp" },
    });
    (u.experiencia);
}
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['pos']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['xp']} */ ;
export default {};
