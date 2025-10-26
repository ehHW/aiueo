<template>
    <div class="conversation">
        <el-splitter layout="vertical" v-show="chatStore.mode.message">
            <el-splitter-panel>
                <div class="content-area">
                    123
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
                        <el-button @click="send(msg)" type="primary" size="small">send</el-button>
                    </div>
                </div>
            </el-splitter-panel>
        </el-splitter>
        <div class="request-friend-list" v-show="chatStore.mode.contact">
            <ul>
                <li v-for="sender in friendRequestList" :key="sender.sender_id">
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
import { onBeforeUnmount, ref } from "vue";
import ReconnectingWebSocket from '@/utils/ReconnectingWebSocket';
import { useChatStore } from "@/stores/useChat";
import { getFriendRequestListApi, handleFriendRequestApi } from "@/api/friend";
import type { FriendRequestData } from "@/types/chat";

const chatStore = useChatStore()



const friendRequestList = ref<FriendRequestData[]>([])
const getFriendRequestList = () => {
    getFriendRequestListApi().then((res) => {
        friendRequestList.value = res.data.data
        // console.log('获取好友请求列表:', friendRequestList.value);
    }).catch((error) => {
        console.error('获取好友请求列表失败:', error);
    });
}
getFriendRequestList();

const handleFriendRequest = (action: 'accept' | 'decline', senderId: number) => {
    handleFriendRequestApi(action, senderId).then((res) => {
        console.log(`处理好友请求 ${action}:`, res.data);
    }).catch((error) => {
        console.error(`处理好友请求 ${action} 失败:`, error);
    });
}




const msgList = ref<string[]>([]);
let msg = ref<string>("");

const roomName = "testroom";
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsURL = `${protocol}//${window.location.host}/chat/channel/${roomName}/`

const ws = new ReconnectingWebSocket(
    wsURL,
    { maxRetries: 5, heartbeatInterval: 25000 }
);

ws.onopen = () => {
    console.log('连接成功');
}

ws.onmessage = (ev) => {
    if (ev.data === '__pong__') return;          // 心跳
    const msg = JSON.parse(ev.data).msg;        // 聊天消息
    msgList.value.push(msg);
};

function send(msg: string) {
    ws.send(JSON.stringify({ msg }));
}

onBeforeUnmount(() => ws.close());
</script>

<style scoped>
.conversation {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.content-area {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
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
