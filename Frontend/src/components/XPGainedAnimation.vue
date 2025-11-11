<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'XPGainedAnimation',
    props: {
        xpAmount: {
            type: Number,
            required: true
        },
        show: {
            type: Boolean,
            default: false
        }
    }
})
</script>

<template>
    <transition name="xp-fade">
        <div v-if="show" class="xp-animation-overlay">
            <div class="xp-animation-content">
                <div class="xp-icon">⭐</div>
                <div class="xp-text">¡Ganaste XP!</div>
                <div class="xp-amount">+{{ xpAmount }} XP</div>
                <div class="xp-sparkles">
                    <span class="sparkle" v-for="n in 12" :key="n">✨</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.xp-animation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease-out;
}

.xp-animation-content {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.95) 0%, rgba(255, 152, 0, 0.95) 100%);
    border-radius: 24px;
    padding: 48px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(255, 193, 7, 0.5);
    border: 3px solid #fff;
    position: relative;
    animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.xp-icon {
    font-size: 80px;
    animation: rotate 2s ease-in-out infinite;
    margin-bottom: 16px;
}

.xp-text {
    color: white;
    font-size: 28px;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    margin-bottom: 12px;
}

.xp-amount {
    color: white;
    font-size: 48px;
    font-weight: 900;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    animation: pulse 1.5s ease-in-out infinite;
}

.xp-sparkles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.sparkle {
    position: absolute;
    font-size: 24px;
    animation: sparkle 2s ease-out infinite;
}

.sparkle:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.sparkle:nth-child(2) { top: 15%; right: 15%; animation-delay: 0.2s; }
.sparkle:nth-child(3) { top: 30%; left: 5%; animation-delay: 0.4s; }
.sparkle:nth-child(4) { top: 40%; right: 10%; animation-delay: 0.6s; }
.sparkle:nth-child(5) { bottom: 30%; left: 15%; animation-delay: 0.8s; }
.sparkle:nth-child(6) { bottom: 20%; right: 20%; animation-delay: 1s; }
.sparkle:nth-child(7) { top: 50%; left: -5%; animation-delay: 0.3s; }
.sparkle:nth-child(8) { top: 60%; right: -5%; animation-delay: 0.5s; }
.sparkle:nth-child(9) { bottom: 40%; left: 50%; animation-delay: 0.7s; }
.sparkle:nth-child(10) { top: 20%; left: 50%; animation-delay: 0.9s; }
.sparkle:nth-child(11) { bottom: 10%; left: 30%; animation-delay: 1.1s; }
.sparkle:nth-child(12) { bottom: 15%; right: 30%; animation-delay: 1.3s; }

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes bounceIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes rotate {
    0%, 100% {
        transform: rotate(0deg) scale(1);
    }
    25% {
        transform: rotate(-10deg) scale(1.1);
    }
    75% {
        transform: rotate(10deg) scale(1.1);
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

@keyframes sparkle {
    0% {
        opacity: 0;
        transform: scale(0) translateY(0);
    }
    50% {
        opacity: 1;
        transform: scale(1) translateY(-20px);
    }
    100% {
        opacity: 0;
        transform: scale(0) translateY(-40px);
    }
}

.xp-fade-enter-active,
.xp-fade-leave-active {
    transition: opacity 0.3s ease;
}

.xp-fade-enter-from,
.xp-fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .xp-animation-content {
        padding: 32px;
        margin: 20px;
    }

    .xp-icon {
        font-size: 60px;
    }

    .xp-text {
        font-size: 22px;
    }

    .xp-amount {
        font-size: 36px;
    }

    .sparkle {
        font-size: 18px;
    }
}
</style>
