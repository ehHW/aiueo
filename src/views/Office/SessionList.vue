<template>
    <div class="session-list">
        <ul>
            <li v-for="session in chatStore.sessionList" :key="session.id">
                {{ session.title }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/useChat';


const chatStore = useChatStore();
chatStore.getSessionList();
</script>

<style scoped>
.session-list {
    width: 100%;
    height: calc(100% - 50px);
    /* margin-top: 50px; */
    background-color: var(--header-bg-color);
    overflow: auto;
    position: relative;
}

.session-list ul {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.session-list ul li {
    width: 100%;
    height: 50px;
    background-color: red;
}

.session-list ul li:nth-child(n+2) {
    margin-top: 10px;
}
</style>
