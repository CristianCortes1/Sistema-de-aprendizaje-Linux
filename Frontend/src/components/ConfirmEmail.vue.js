import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthService from '../services/AuthService';
const router = useRouter();
const route = useRoute();
const loading = ref(true);
const message = ref('');
const isSuccess = ref(false);
const countdown = ref(5);
onMounted(async () => {
    const token = typeof route.query.token === 'string' ? route.query.token : '';
    if (!token) {
        message.value = 'Token de confirmación no encontrado';
        isSuccess.value = false;
        loading.value = false;
        return;
    }
    try {
        await AuthService.confirmEmail(token);
        message.value = 'Email confirmado exitosamente. ¡Ya puedes iniciar sesión!';
        isSuccess.value = true;
        // Countdown para redirección
        const interval = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(interval);
                router.push('/');
            }
        }, 1000);
    }
    catch (error) {
        console.error('Error confirmando email:', error);
        message.value = error.message || 'Error al confirmar el email. El token puede haber expirado o ser inválido.';
        isSuccess.value = false;
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "confirm-email" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "Background" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "Plantilla" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "result" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "icon" },
    });
    if (__VLS_ctx.isSuccess) {
        // @ts-ignore
        [isSuccess,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "success-icon" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "error-icon" },
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: ({ 'success': __VLS_ctx.isSuccess, 'error': !__VLS_ctx.isSuccess }) },
    });
    // @ts-ignore
    [isSuccess, isSuccess,];
    (__VLS_ctx.isSuccess ? '¡Confirmación exitosa!' : 'Error de confirmación');
    // @ts-ignore
    [isSuccess,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "message" },
    });
    (__VLS_ctx.message);
    // @ts-ignore
    [message,];
    if (__VLS_ctx.isSuccess) {
        // @ts-ignore
        [isSuccess,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "success-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "redirect-info" },
        });
        (__VLS_ctx.countdown);
        // @ts-ignore
        [countdown,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!(__VLS_ctx.isSuccess))
                        return;
                    __VLS_ctx.router.push('/');
                    // @ts-ignore
                    [router,];
                } },
            ...{ class: "login-btn" },
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "error-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.isSuccess))
                        return;
                    __VLS_ctx.router.push('/registro');
                    // @ts-ignore
                    [router,];
                } },
            ...{ class: "register-btn" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.isSuccess))
                        return;
                    __VLS_ctx.router.push('/');
                    // @ts-ignore
                    [router,];
                } },
            ...{ class: "login-btn" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['confirm-email']} */ ;
/** @type {__VLS_StyleScopedClasses['Background']} */ ;
/** @type {__VLS_StyleScopedClasses['Plantilla']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['result']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['redirect-info']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['error-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['register-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
