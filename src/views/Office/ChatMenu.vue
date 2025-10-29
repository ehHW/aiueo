<template>
    <div class="chat-menu">
        <p :class="`
        iconfont icon-xiaoxi
        ${ chatStore.mode.message ? 'active': '' }
         `" @click="chatStore.changeMode('message')"></p>
        <p :class="`
        iconfont icon-biaoqing
        ${ chatStore.mode.contact ? 'active': '' }
         `" @click="chatStore.changeMode('contact')"></p>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/useChat';
import { useSessionStore } from '@/stores/useSession';
import { watch } from 'vue';
const chatStore = useChatStore();
const sessionStore = useSessionStore()

watch(() => chatStore.mode.message, (newVal) => {
    if (newVal) {
        sessionStore.getSessionList()
    } else {
        chatStore.getFriendRequestList()
    }
})
</script>

<style scoped>
.chat-menu {
    width: 50px;
    height: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: #f5f5f5;
    overflow: hidden;
}

.iconfont {
    width: 36px;
    height: 36px;
    font-size: 24px;
    text-align: center;
    line-height: 36px;
    margin: 5px 0;
    background-color: red;
    transition: all 0.3s ease;
    cursor: default;
}

.iconfont:hover {
    color: #409eff;
    background-color: #fff;
}

.iconfont.active {
    color: red;
    background-color: black;
}
</style>
