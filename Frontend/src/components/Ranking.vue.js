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
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    user: ({ username: '', correo: '', racha: 0, experiencia: 0, avatar: '' }),
    logout: (() => { }),
}));
const __VLS_2 = __VLS_1({
    user: ({ username: '', correo: '', racha: 0, experiencia: 0, avatar: '' }),
    logout: (() => { }),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ style: {} },
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
const __VLS_5 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    goInicio: (__VLS_ctx.goBack),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}));
const __VLS_7 = __VLS_6({
    goInicio: (__VLS_ctx.goBack),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[goBack, $router, $router, $router,];
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['back']} */ ;
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['item']} */ ;
/** @type {__VLS_StyleScopedClasses['pos']} */ ;
/** @type {__VLS_StyleScopedClasses['name']} */ ;
/** @type {__VLS_StyleScopedClasses['xp']} */ ;
export default {};
