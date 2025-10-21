import { ref, watch } from 'vue';
const props = defineProps();
const emit = defineEmits();
const formData = ref({ ...props.data });
watch(() => props.data, (newData) => {
    formData.value = { ...newData };
}, { deep: true });
const handleSave = () => {
    emit('save', formData.value);
};
const handleClose = () => {
    emit('close');
};
const handleConfirmDelete = () => {
    emit('confirmDelete');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-close']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete-confirm']} */ ;
if (__VLS_ctx.visible) {
    // @ts-ignore
    [visible,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.handleClose) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [handleClose,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: () => { } },
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    (__VLS_ctx.title);
    // @ts-ignore
    [title,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleClose) },
        ...{ class: "btn-close" },
    });
    // @ts-ignore
    [handleClose,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-body" },
    });
    if (__VLS_ctx.type === 'usuario') {
        // @ts-ignore
        [type,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.formData.nombre),
            placeholder: "Ingrese el nombre",
            ...{ class: "form-input" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "email",
            placeholder: "Ingrese el correo",
            ...{ class: "form-input" },
        });
        (__VLS_ctx.formData.correo);
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            value: (__VLS_ctx.formData.rol),
            ...{ class: "form-select" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "usuario",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "admin",
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            value: (__VLS_ctx.formData.estado),
            ...{ class: "form-select" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "activo",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "inactivo",
        });
    }
    if (__VLS_ctx.type === 'leccion') {
        // @ts-ignore
        [type,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.formData.titulo),
            placeholder: "Ingrese el título",
            ...{ class: "form-input" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
            value: (__VLS_ctx.formData.descripcion),
            placeholder: "Ingrese la descripción",
            rows: "3",
            ...{ class: "form-textarea" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.formData.comandos),
            placeholder: "Ingrese los comandos (separados por comas)",
            ...{ class: "form-input" },
        });
        // @ts-ignore
        [formData,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-group" },
        });
        __VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({});
        __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
            value: (__VLS_ctx.formData.retroalimentacion),
            placeholder: "Ingrese la retroalimentación",
            rows: "3",
            ...{ class: "form-textarea" },
        });
        // @ts-ignore
        [formData,];
    }
    if (__VLS_ctx.type === 'eliminar') {
        // @ts-ignore
        [type,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "confirm-delete" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "warning" },
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-footer" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handleClose) },
        ...{ class: "btn-cancel" },
    });
    // @ts-ignore
    [handleClose,];
    if (__VLS_ctx.type !== 'eliminar') {
        // @ts-ignore
        [type,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.handleSave) },
            ...{ class: "btn-save" },
        });
        // @ts-ignore
        [handleSave,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.handleConfirmDelete) },
            ...{ class: "btn-delete-confirm" },
        });
        // @ts-ignore
        [handleConfirmDelete,];
    }
}
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-close']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['warning']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-save']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete-confirm']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
