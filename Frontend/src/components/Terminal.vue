<template>
  <div class="terminal-container">
    <div class="terminal-output" ref="output">
      <pre>{{ logs }}</pre>
    </div>
    <input
      v-model="command"
      @keyup.enter="sendCommand"
      placeholder="Type a command and press Enter..."
      class="terminal-input"
    />
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import { ref, onMounted, nextTick } from "vue";

const logs = ref("");
const command = ref("");
const output = ref(null);

// ⚙️ Conexión al backend NestJS (ajusta si no es localhost:3000)
const socket = io("http://localhost:3000");

onMounted(() => {
  socket.on("output", async (data) => {
    logs.value += data;
    await nextTick();
    output.value.scrollTop = output.value.scrollHeight;
  });
});

function sendCommand() {
  if (command.value.trim() === "") return;
  socket.emit("input", command.value);
  command.value = "";
}
</script>

<style scoped>
.terminal-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #000;
  color: #00ff6a;
  font-family: monospace;
  padding: 10px;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  background: #111;
  border: 1px solid #333;
  padding: 10px;
  margin-bottom: 10px;
}

.terminal-input {
  background: #111;
  color: #00ff6a;
  border: 1px solid #333;
  padding: 8px;
  font-family: monospace;
  font-size: 1rem;
  outline: none;
}
.terminal-input:focus {
  border-color: #00ff6a;
}
</style>
