<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    visible: boolean
    type: 'usuario' | 'leccion' | 'eliminar'
    title: string
    data: any
}>()

const emit = defineEmits<{
    close: []
    save: [data: any]
    confirmDelete: []
}>()

const formData = ref({ ...props.data })

watch(() => props.data, (newData) => {
    formData.value = { ...newData }
}, { deep: true })

const handleSave = () => {
    emit('save', formData.value)
}

const handleClose = () => {
    emit('close')
}

const handleConfirmDelete = () => {
    emit('confirmDelete')
}
</script>

<template>
    <div v-if="visible" class="modal-overlay" @click="handleClose">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="btn-close" @click="handleClose">×</button>
            </div>

            <div class="modal-body">
                <!-- Modal de Usuario -->
                <div v-if="type === 'usuario'">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input 
                            type="text" 
                            v-model="formData.nombre" 
                            placeholder="Ingrese el nombre" 
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label>Correo</label>
                        <input 
                            type="email" 
                            v-model="formData.correo" 
                            placeholder="Ingrese el correo" 
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label>Rol</label>
                        <select v-model="formData.rol" class="form-select">
                            <option value="usuario">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Estado</label>
                        <select v-model="formData.estado" class="form-select">
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>

                <!-- Modal de Lección -->
                <div v-if="type === 'leccion'">
                    <div class="form-group">
                        <label>Título</label>
                        <input 
                            type="text" 
                            v-model="formData.titulo" 
                            placeholder="Ingrese el título" 
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea 
                            v-model="formData.descripcion" 
                            placeholder="Ingrese la descripción" 
                            rows="3"
                            class="form-textarea"
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label>Comandos</label>
                        <input 
                            type="text" 
                            v-model="formData.comandos" 
                            placeholder="Ingrese los comandos (separados por comas)" 
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label>Retroalimentación</label>
                        <textarea 
                            v-model="formData.retroalimentacion" 
                            placeholder="Ingrese la retroalimentación" 
                            rows="3"
                            class="form-textarea"
                        ></textarea>
                    </div>
                </div>

                <!-- Modal de Confirmación de Eliminación -->
                <div v-if="type === 'eliminar'" class="confirm-delete">
                    <p>¿Está seguro de que desea eliminar este elemento?</p>
                    <p class="warning">Esta acción no se puede deshacer.</p>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="handleClose">Cancelar</button>
                <button 
                    v-if="type !== 'eliminar'" 
                    class="btn-save" 
                    @click="handleSave"
                >
                    Guardar
                </button>
                <button 
                    v-else 
                    class="btn-delete-confirm" 
                    @click="handleConfirmDelete"
                >
                    Eliminar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: linear-gradient(135deg, rgba(239, 156, 108, 0.95) 0%, rgba(197, 125, 161, 0.95) 50%, rgba(149, 110, 170, 0.95) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    width: 90%;
    max-width: 550px;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-header h3 {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.btn-close {
    background: none;
    border: none;
    color: white;
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s;
}

.btn-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: white;
    font-weight: 500;
    margin-bottom: 8px;
    font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    font-size: 15px;
    font-family: inherit;
    transition: all 0.3s;
}

.form-input::placeholder,
.form-textarea::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.25);
}

.form-select {
    cursor: pointer;
}

.form-select option {
    background: #6b4c8a;
    color: white;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

.confirm-delete {
    text-align: center;
    padding: 20px 0;
}

.confirm-delete p {
    color: white;
    font-size: 16px;
    margin-bottom: 12px;
}

.warning {
    color: #fca5a5;
    font-size: 14px;
    font-weight: 500;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel,
.btn-save,
.btn-delete-confirm {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.2);
}

.btn-save {
    background: rgba(34, 197, 94, 0.3);
    color: white;
    border: 1px solid rgba(34, 197, 94, 0.5);
}

.btn-save:hover {
    background: rgba(34, 197, 94, 0.4);
}

.btn-delete-confirm {
    background: rgba(239, 68, 68, 0.3);
    color: white;
    border: 1px solid rgba(239, 68, 68, 0.5);
}

.btn-delete-confirm:hover {
    background: rgba(239, 68, 68, 0.4);
}
</style>