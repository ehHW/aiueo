<template>
    <div class="conversation">
        <el-splitter layout="vertical" v-show="chatStore.mode.message">
            <el-splitter-panel>
                <div class="content-area">
                    <div class="content-header">
                        <span>{{ sessionStore.SessionInfo.title }}</span>
                    </div>
                    <div class="content-body">
                        <ul>
                            <li v-for="(mesg, index) in msgList" :key="index">
                                {{ mesg }}
                            </li>
                        </ul>
                    </div>
                </div>
            </el-splitter-panel>
            <el-splitter-panel size="40%" min="30%" max="50%">
                <div class="input-area">
                    <div class="input-header">
                        toolbar
                    </div>
                    <div class="input-body">
                        <a-textarea
                        v-model:value="msg"
                        />
                    </div>
                    <div class="input-footer">
                        <el-button @click="send()" type="primary" size="small">send</el-button>
                    </div>
                </div>
            </el-splitter-panel>
        </el-splitter>
        <div class="request-friend-list" v-show="chatStore.mode.contact">
            <ul>
                <li v-for="sender in chatStore.friendRequestList" :key="sender.sender_id">
                    <div class="request-friend-list-avatar">
                        <el-image :src="sender.sender_avatar" />
                    </div>
                    <div class="request-friend-list-content">
                        {{ sender.sender_username }}
                        {{ sender.sender_time }}
                    </div>
                    <div class="request-friend-list-handle">
                        <el-button @click="handleFriendRequest('accept', sender.sender_id)">接受</el-button>
                        <el-button @click="handleFriendRequest('decline', sender.sender_id)">拒绝</el-button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ReconnectingWebSocket from '@/utils/ReconnectingWebSocket'
import { useChatStore } from "@/stores/useChat";
import { handleFriendRequestApi } from "@/api/friend";
import { useSessionStore } from '@/stores/useSession';

const chatStore = useChatStore()
const sessionStore = useSessionStore()

const handleFriendRequest = (action: 'accept' | 'decline', senderId: number) => {
    handleFriendRequestApi(action, senderId).then(() => {
        // console.log(`处理好友请求 ${action}:`, res.data);
        chatStore.getFriendRequestList();
        ElMessage.success('好友请求已接受')
    }).catch(() => {
        // console.error(`处理好友请求 ${action} 失败:`, error);
        chatStore.getFriendRequestList();
        ElMessage.success('好友请求已拒绝')
    });
}


const msgList = ref<string[]>([]);
let msg = ref<string>("");

const ws = ref<ReconnectingWebSocket | null>(null)
/* ---------- 收发消息 ---------- */
function send() {
    const text = msg.value.trim()
    if (!text || !ws.value) return
    ws.value.send(JSON.stringify({ type: 'chat', text }))
    msg.value = ''
}
/* ---------- 统一的事件回调（静态，避免闭包旧实例） ---------- */
const handleOpen = () => console.log('✅ WebSocket opened')
const handleClose = () => console.log('❌ WebSocket closed')
const handleError = () => console.log('⚠️ WebSocket error')
const handleMessage = (e: MessageEvent<string>) => {
    msgList.value.push(e.data)
}
/* ---------- 创建/销毁连接 ---------- */
function makeWs(id: number) {
  // 如果已有连接，先强制关闭
    if (ws.value) {
        ws.value.close(1000, 'switch room')
        ws.value = null
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${window.location.host}/chat/channel/${id}/`

    const instance = new ReconnectingWebSocket(url, {
        maxRetries: 5,
        heartbeatInterval: 25000
    })

    // 绑定事件
    instance.onopen = handleOpen
    instance.onclose = handleClose
    instance.onerror = handleError
    instance.onmessage = handleMessage

    ws.value = instance
}

/* ---------- 切换房间 ---------- */
function changeRoom() {
    console.log(`🔄  switching to room ${sessionStore.conv_id}`)
    makeWs(sessionStore.conv_id)
}

watch(() => sessionStore.conv_id, () => {
    changeRoom()
})

/* ---------- 生命周期 ---------- */
onMounted(() => makeWs(sessionStore.conv_id))
onUnmounted(() => ws.value?.close())

</script>

<style scoped>
.conversation {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.content-area {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.content-header {
    width: 100%;
    height: 50px;
    padding: 0 10px;
    /* background-color: aqua; */
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(55, 55, 55);
}

.content-body {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
}

.input-area {
    width: 100%;
    height: 100%;
    /* background-color: antiquewhite; */
    overflow: hidden;
    padding: 5px;
    display: flex;
    flex-direction: column;

}

.input-header {
    width: 100%;
    height: 30px;
    background-color: rgb(55, 87, 87);
    padding: 0px 11px;
}

.input-body {
    width: 100%;
    height: 100%;
    margin-top: 5px;
    /* background-color: red; */
    overflow: auto;
}

:deep(.ant-input.css-dev-only-do-not-override-1p3hq3p) {
    width: 100%;
    height: 100%;
    resize: none;
    background-color: transparent;
    color: var(--header-text-color);
    border: none;
}

:deep(.el-input__wrapper) {
    background-color: transparent;
}

.input-footer {
    width: 100%;
    height: 30px;
    margin-top: 5px;
    padding: 0px 11px;
    display: flex;
    justify-content: flex-end;
}

.request-friend-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 30px;
    background-color: antiquewhite;
}

.request-friend-list ul {
    width: 100%;
}

.request-friend-list ul li {
    width: 100%;
    height: 60px;
    background-color: var(--header-bg-color);
    margin-top: 10px;
    display: flex;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: default;
}

.request-friend-list-avatar {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.request-friend-list-avatar img {
    width: 50px;
    height: 50px;
}

.request-friend-list-content {
    width: calc(100% - 200px);
    display: flex;
    justify-content: start;
    align-items: center;
}

.request-friend-list-handle {
    width: 150px;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    /* background-color: red; */
}

.request-friend-list-handle button {
    --el-button-text-color: rgb(91 91 91)
}
</style>
