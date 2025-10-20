import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import Header from './Header.vue';
import Footer from './Footer.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = (await import('vue')).defineComponent({
    name: 'Ranking',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        const ranking = ref([]);
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        onMounted(async () => {
            document.title = 'Ranking - Sistema de Aprendizaje Linux';
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localUser.value.username = parsed.username;
                localUser.value.racha = parsed.racha;
                localUser.value.experiencia = parsed.experiencia;
                localUser.value.avatar = parsed.avatar;
                localUser.value.correo = parsed.correo;
            }
            await fetchRanking();
        });
        const displayUser = computed(() => {
            return localUser.value;
        });
        const fetchRanking = async () => {
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
                ranking.value = [
                    { username: 'CristianUser', experiencia: 1500 },
                    { username: 'Cristian', experiencia: 900 },
                    { username: 'juana', experiencia: 600 },
                    { username: 'cherry', experiencia: 450 }
                ];
            }
        };
        const getDefaultAvatar = (username) => {
            const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
            const colorIndex = username.length % colors.length;
            return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`;
        };
        const handleLogout = () => {
            AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/');
        };
        return {
            ranking,
            displayUser,
            handleLogout,
            getDefaultAvatar
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Ranking',
    components: {
        Header,
        Footer
    },
    setup() {
        const router = useRouter();
        const ranking = ref([]);
        const localUser = ref({
            username: '',
            correo: '',
            racha: 0,
            experiencia: 0,
            avatar: ""
        });
        onMounted(async () => {
            document.title = 'Ranking - Sistema de Aprendizaje Linux';
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                localUser.value.username = parsed.username;
                localUser.value.racha = parsed.racha;
                localUser.value.experiencia = parsed.experiencia;
                localUser.value.avatar = parsed.avatar;
                localUser.value.correo = parsed.correo;
            }
            await fetchRanking();
        });
        const displayUser = computed(() => {
            return localUser.value;
        });
        const fetchRanking = async () => {
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
                ranking.value = [
                    { username: 'CristianUser', experiencia: 1500 },
                    { username: 'Cristian', experiencia: 900 },
                    { username: 'juana', experiencia: 600 },
                    { username: 'cherry', experiencia: 450 }
                ];
            }
        };
        const getDefaultAvatar = (username) => {
            const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE'];
            const colorIndex = username.length % colors.length;
            return `https://ui-avatars.com/api/?name=${username}&background=${colors[colorIndex]}&color=fff&size=128&bold=true`;
        };
        const handleLogout = () => {
            AuthService.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/');
        };
        return {
            ranking,
            displayUser,
            handleLogout,
            getDefaultAvatar
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = {
    Header,
    Footer
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ranking-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-item']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-item']} */ ;
/** @type {__VLS_StyleScopedClasses['medal']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-number']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['xp-value']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "page" },
});
const __VLS_0 = {}.Header;
/** @type {[typeof __VLS_components.Header, ]} */ ;
// @ts-ignore
Header;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    user: (__VLS_ctx.displayUser),
    logout: (__VLS_ctx.handleLogout),
}));
const __VLS_2 = __VLS_1({
    user: (__VLS_ctx.displayUser),
    logout: (__VLS_ctx.handleLogout),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[displayUser, handleLogout,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ranking-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ranking-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "col-rank" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "col-user" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "col-xp" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "ranking-list" },
});
for (const [user, index] of __VLS_getVForSourceType((__VLS_ctx.ranking))) {
    // @ts-ignore
    [ranking,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        key: (user.username),
        ...{ class: (['ranking-item', { 'top-three': index < 3, 'first-place': index === 0 }]) },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "rank-column" },
    });
    if (index === 0) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "medal gold" },
        });
    }
    else if (index === 1) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "medal silver" },
        });
    }
    else if (index === 2) {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "medal bronze" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "rank-number" },
        });
        (index + 1);
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "user-column" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "avatar" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (user.avatar || __VLS_ctx.getDefaultAvatar(user.username)),
        alt: (user.username),
    });
    // @ts-ignore
    [getDefaultAvatar,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "username" },
    });
    (user.username);
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "xp-column" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "xp-value" },
    });
    (user.experiencia);
}
const __VLS_5 = {}.Footer;
/** @type {[typeof __VLS_components.Footer, ]} */ ;
// @ts-ignore
Footer;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    goInicio: (() => __VLS_ctx.$router.push('/dashboard')),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}));
const __VLS_7 = __VLS_6({
    goInicio: (() => __VLS_ctx.$router.push('/dashboard')),
    goBiblioteca: (() => __VLS_ctx.$router.push('/biblioteca')),
    goRanking: (() => __VLS_ctx.$router.push('/ranking')),
    goConfig: (() => __VLS_ctx.$router.push('/configuracion')),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[$router, $router, $router, $router,];
/** @type {__VLS_StyleScopedClasses['page']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-container']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-header']} */ ;
/** @type {__VLS_StyleScopedClasses['col-rank']} */ ;
/** @type {__VLS_StyleScopedClasses['col-user']} */ ;
/** @type {__VLS_StyleScopedClasses['col-xp']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-list']} */ ;
/** @type {__VLS_StyleScopedClasses['ranking-item']} */ ;
/** @type {__VLS_StyleScopedClasses['top-three']} */ ;
/** @type {__VLS_StyleScopedClasses['first-place']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-column']} */ ;
/** @type {__VLS_StyleScopedClasses['medal']} */ ;
/** @type {__VLS_StyleScopedClasses['gold']} */ ;
/** @type {__VLS_StyleScopedClasses['medal']} */ ;
/** @type {__VLS_StyleScopedClasses['silver']} */ ;
/** @type {__VLS_StyleScopedClasses['medal']} */ ;
/** @type {__VLS_StyleScopedClasses['bronze']} */ ;
/** @type {__VLS_StyleScopedClasses['rank-number']} */ ;
/** @type {__VLS_StyleScopedClasses['user-column']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['username']} */ ;
/** @type {__VLS_StyleScopedClasses['xp-column']} */ ;
/** @type {__VLS_StyleScopedClasses['xp-value']} */ ;
export default {};
