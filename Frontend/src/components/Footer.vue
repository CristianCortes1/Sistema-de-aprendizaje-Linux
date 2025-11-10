<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    props: {
        goInicio: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
        goBiblioteca: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
        goRanking: { type: Function as PropType<(event: MouseEvent) => void>, required: true },
        goConfig: { type: Function as PropType<(event: MouseEvent) => void>, required: true }
    }
})
</script>

<template>
    <footer class="footer">
        <div class="barra-inicio">
            <button type="button" @click="goInicio"><img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Inicio">Inicio</button>
        </div>
        <div class="barra">
            <button @click="goBiblioteca">
                <img src="/Assets/Biblioteca.svg" alt="Biblioteca">
                Biblioteca
            </button>
        </div>
        <div class="barra">
            <button type="button" @click="goRanking"><img src="/Assets/Ranking.svg" alt="Ranking">Ranking</button>
        </div>
        <div class="barra">
            <button type="button" @click="goConfig"><img src="/Assets/Configuración.svg" alt="Configuración">Configuración</button>
        </div>
    </footer>
</template>

<style scoped>
/* ...existing footer styles from Dashboard.vue... */
.footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(15px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    position: fixed;
    bottom: 0;
    width: 100%;
}
.footer button {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    gap: 6px;
}
.footer button img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}
.footer .barra-inicio button img {
    width: 45px;
    height: 45px;
    object-fit: contain;
}
@media (max-width: 768px) {
    .footer {
        flex-direction: row;
        justify-content: space-around;
    }
}
</style>
