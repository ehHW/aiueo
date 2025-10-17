<template>
    <div class="conversation">
        <el-input v-model="msg"></el-input>
        <ul class="msg-area">
            <li v-for="(msg, index) in msgList" :key="index">{{ msg }}</li>
        </ul>
        <el-button type="primary" plain @click="sendMessage(msg)">发送</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import socket from "@/utils/webSocket";

const msgList = ref<string[]>([]);
let msg = ref<string>("");

socket.onopen = () => {
    console.log("连接成功");
}

socket.onclose = () => {
    console.log("连接断开");
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    msgList.value.push(data);
};

const sendMessage = (msg: string) => {
    if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ msg }));
        } else {
            console.error("WebSocket未连接");
        }
    }
</script>

<style scoped>
.conversation {
    width: 100%;
    margin: 0 auto;
}

.msg-area {
    width: 100%;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    list-style: none;
}

:deep(.el-input__wrapper) {
    background-color: var(--my-main-search-bg-color) !important;
}
</style>
