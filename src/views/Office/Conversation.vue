<template>
    <div class="conversation">
        <el-splitter layout="vertical" v-show="chatStore.mode.message">
            <!-- 展示区 -->
            <el-splitter-panel>
                <div class="content-area">
                    <!-- 内容头 -->
                    <div class="content-header">
                        <span>{{ sessionStore.SessionInfo.title }}</span>
                        <span @click="convDrawer = true">...</span>
                    </div>
                    <!-- 内容体 -->
                    <div class="content-body" ref="contentBody" @scroll="onScroll">
                        <ul>
                            <li
                            v-for="msgItem in messageStore.currentSession?.msgList"
                            :key="msgItem.id"
                            :class="msgItem.sender_id === userStore.userInfo.user_id ? 'selfuser' : 'targetuser'"
                            >
                                <div class="user-avatar" v-if="!(msgItem.sender_id === userStore.userInfo.user_id)">
                                    <img src="@/assets/img/miao.png" alt="">
                                </div>
                                <div class="msg-content">
                                    <div class="usernickname" v-if="sessionStore.SessionInfo.type === 'group'">
                                        {{ msgItem.sender_username }}
                                    </div>
                                    <div class="content">
                                        {{ msgItem.content }}
                                    </div>
                                </div>
                                <div class="user-avatar" v-if="msgItem.sender_id === userStore.userInfo.user_id">
                                    <img src="@/assets/img/miao.png" alt="">
                                </div>
                            </li>
                        </ul>
                    </div>
                    <!-- 会话抽屉 -->
                    <el-drawer v-model="convDrawer" title="I am the title" :with-header="false">
                        <div class="convDrawer">
                            <div class="private-type" v-show="sessionStore.SessionInfo.type === 'private'">
                                <div class="set-as-top">
                                    <span>设为置顶</span><el-switch v-model="setAsTop" />
                                </div>
                                <div class="msg-undisturbed">
                                    <span>消息免打扰</span><el-switch v-model="msgUndisturbed" />
                                </div>
                                <div class="block-out">
                                    <span>屏蔽此人</span><el-switch v-model="blockOut" />
                                </div>
                                <div class="del-msg-history">
                                    <span>删除聊天记录</span>
                                </div>
                                <div class="del-friend" @click="delFriendOrQuitGroup(sessionStore.SessionInfo.id)">
                                    <span>删除好友</span>
                                </div>
                            </div>
                            <div class="group-type" v-show="sessionStore.SessionInfo.type === 'group'">
                                <div class="change-name">
                                    <el-input type="text" v-model="new_group_name"/>
                                    <el-button type="primary" @click="changeGroupName(sessionStore.SessionInfo.id)">修改</el-button>
                                </div>
                                <div class="quit-group" @click="delFriendOrQuitGroup(sessionStore.SessionInfo.id)">
                                    <span>退出群聊</span>
                                </div>
                                <div class="clear-group"
                                @click="delGroup()"
                                v-show="creator">
                                    <span>解散群聊</span>
                                </div>
                            </div>
                        </div>
                    </el-drawer>
                </div>
            </el-splitter-panel>
            <!-- 输入区 -->
            <el-splitter-panel size="40%" min="30%" max="50%">
                <div class="input-area">
                    <div class="input-header">
                        toolbar
                    </div>
                    <div class="input-body">
                        <a-textarea id="input-body"
                        v-model:value="msg"
                        @keyup.enter.prevent="send()"
                        />
                    </div>
                    <div class="input-footer">
                        <el-button @click="send()" type="primary" size="small">发送</el-button>
                    </div>
                    <div class="mask" v-if="sessionStore.SessionInfo.dissolved">群聊已解散</div>
                </div>
            </el-splitter-panel>
        </el-splitter>
        <!-- 处理好友请求区 -->
        <div class="request-friend-list" v-show="chatStore.mode.contact">
            <ul>
                <li v-for="fr in chatStore.friendRequestList" :key="fr.user_id">
                    <div class="request-friend-list-avatar">
                        <el-image :src="fr.avatar" />
                    </div>
                    <div class="request-friend-list-content">
                        <span>{{ fr.username }}</span>
                        <span>{{ fr.created_at?.split('T')[0] }}</span>
                    </div>
                    <div class="request-friend-list-handle" v-if="fr.status === 'pending' && fr.direction === 'in'">
                        <el-button @click="handleFriendRequest('accept', fr.user_id)">接受</el-button>
                        <el-button @click="handleFriendRequest('decline', fr.user_id)">拒绝</el-button>
                    </div>
                    <div class="in-or-out-status" v-if="fr.status === 'accepted' && fr.direction === 'in'">已接受</div>
                    <div class="in-or-out-status" v-if="fr.status === 'declined' && fr.direction === 'in'">已拒绝</div>
                    <div class="in-or-out-status" v-if="fr.status === 'pending' && fr.direction === 'out'">等待验证</div>
                    <div class="in-or-out-status" v-if="fr.status === 'accepted' && fr.direction === 'out'">对方已接受</div>
                    <div class="in-or-out-status" v-if="fr.status === 'declined' && fr.direction === 'out'">对方已拒绝</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useTemplateRef, nextTick } from 'vue'
import ReconnectingWebSocket from '@/utils/ReconnectingWebSocket'
import { useChatStore } from "@/stores/useChat";
import { handleFriendRequestApi, delFriendOrQuitGroupApi, changeGroupNameApi, isGroupCreatorApi, delGroupApi } from "@/api/friend";
import { useSessionStore } from '@/stores/useSession';
import { useMessageStore } from '@/stores/useMessage';
import { useUserStore } from '@/stores/useUser';

const chatStore = useChatStore()
const sessionStore = useSessionStore()
const messageStore = useMessageStore()
const userStore = useUserStore()
const contentBody = useTemplateRef('contentBody')

const handleFriendRequest = (action: 'accept' | 'decline', senderId: number) => {
    handleFriendRequestApi(action, senderId).then(() => {
        // console.log(`处理好友请求 ${action}:`, res.data);
        chatStore.getFriendRequestList();
        chatStore.getOrCreatePrivate(senderId)
        chatStore.changeMode('message')
        ElMessage.success('好友请求已接受')
    }).catch(() => {
        // console.error(`处理好友请求 ${action} 失败:`, error);
        chatStore.getFriendRequestList();
        ElMessage.success('好友请求已拒绝')
    });
}

/* 滚动监听 */
let prevScrollTop = 0
const onScroll = (e: Event) => {
    const el = e.target as HTMLDivElement
    const toTop = el.scrollTop <= 0 && prevScrollTop >= 0
    prevScrollTop = el.scrollTop

    if (toTop) {
        // 记录当前高度，用于加载后保持滚动位置
        const oldHeight = el.scrollHeight
        messageStore.loadMoreHistory(sessionStore.SessionInfo?.id)?.then(() => {
            nextTick(() => { el.scrollTop = el.scrollHeight - oldHeight })
        })
    }
}

const scrollToBottom = async () => {
  await nextTick()          // 等 DOM 更新
  contentBody.value?.scrollTo({ top: contentBody.value.scrollHeight })
}

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
const delivered = new Set<number>()
const handleMessage = (e: MessageEvent<string>) => {  // e: MessageEvent<string>
    const { type, state, msg } = JSON.parse(e.data)
    if (type === 'inbox' && state === 403) {
        ElMessage.error(msg.content)
        return
    }
    const id = msg.id
    if (delivered.has(id)) return   // 重复直接丢弃
    delivered.add(id)
    if (type === 'inbox' && state === 200) {               // 个人收件箱
        // 1. 如果当前正好在对应会话，直接追加
        if (msg.conv_id === sessionStore.conv_id) {
            messageStore.currentSession!.msgList.push(msg)
            nextTick(scrollToBottom)
        } else {
            // 2. 否则弹通知 / 未读+1 / 会话列表重新排序
            ElMessage.primary(`新消息来自 ${msg.sender_username}`)
            // chatStore.increaseUnread(msg.conv_id)
            messageStore.sessionMessageList.find(item => item.conv_id === msg.conv_id)!.msgList.push(msg)
        }
        return
    }
    if (type === 'normal' && state === 200) {
        // 原来的聊天室消息（已经在房间里）
        messageStore.currentSession!.msgList.push(msg)
        nextTick(scrollToBottom)
    }
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
    if (!sessionStore.SessionInfo.dissolved) makeWs(sessionStore.conv_id)
    else ws.value?.close()
}

const creator = ref(false);
isGroupCreatorApi(sessionStore.conv_id).then(() => creator.value = true).catch(() => creator.value = false)
watch(() => sessionStore.conv_id, () => {
    isGroupCreatorApi(sessionStore.conv_id).then(() => creator.value = true).catch(() => creator.value = false)
    delivered.clear()
    changeRoom()
})

watch(() => messageStore.currentSession?.msgList,
    async () => {
        await scrollToBottom()
    },
    { deep: true }   // 数组 push 会触发
)

const convDrawer = ref(false)
const setAsTop = ref(false)
const msgUndisturbed = ref(false)
const blockOut = ref(false)

const delFriendOrQuitGroup = (conv_id: number) => {
    ws.value?.close()
    const tipMsg = sessionStore.SessionInfo.type === 'private'? '确定删除该好友吗?': '确定退出群聊吗?'
    ElMessageBox.confirm(
        tipMsg,
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        const s_index = sessionStore.sessionList.indexOf(sessionStore.SessionInfo)
        delFriendOrQuitGroupApi(conv_id).then(res => {
            const msg = sessionStore.SessionInfo.type === 'private'? '删除成功': '退出成功'
            if (res.data.state === 200) {
                sessionStore.getSessionList()
                chatStore.getFriendList()
                convDrawer.value = false
                if (sessionStore.sessionList[s_index - 1]) sessionStore.changeSession(sessionStore.sessionList[s_index - 1])
                else sessionStore.resetSessionInfo()
                ElMessage({
                    type: 'success',
                    message: msg,
                })
            } else ElMessage.error(res.data.msg)
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })
}

const new_group_name = ref('')
const changeGroupName = (conv_id: number) => {
    changeGroupNameApi(conv_id, new_group_name.value).then((res) => {
        if (res.data.state === 200) {
            sessionStore.getSessionList()
            chatStore.getFriendList()
            convDrawer.value = false
            ElMessage({
                type: 'success',
                message: res.data.msg,
            })
        }
    }).catch(res => {
        const status = res.status
        if (status === 400) ElMessage.error(res.response.data.msg)
        if (status === 401) ElMessage.error(res.response.data.msg)
        if (status === 403) ElMessage.error(res.response.data.msg)
        if (status === 501) ElMessage.error(res.response.data.msg)
    })
}

const delGroup = () => {
    ElMessageBox.confirm(
        "确定解散群聊吗?",
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        ws.value?.close()
        const s_index = sessionStore.sessionList.indexOf(sessionStore.SessionInfo)
        delGroupApi(sessionStore.SessionInfo.id).then(res => {
            if (res.data.state === 200) {
                sessionStore.getSessionList()
                chatStore.getFriendList()
                convDrawer.value = false
                if (sessionStore.sessionList[s_index - 1]) sessionStore.changeSession(sessionStore.sessionList[s_index - 1])
                else sessionStore.resetSessionInfo()
                ElMessage.success(res.data.msg)
            }
        }).catch(res => {
            const status = res.status
            if (status === 401) ElMessage.error(res.response.data.msg)
            if (status === 403) ElMessage.error(res.response.data.msg)
            if (status === 404) ElMessage.error(res.response.data.msg)
            if (status === 405) ElMessage.error(res.response.data.msg)
            if (status === 500) ElMessage.error(res.response.data.msg)
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    })
}
/* ---------- 生命周期 ---------- */
onMounted(async () => {
    if (!sessionStore.SessionInfo.dissolved) makeWs(sessionStore.conv_id)
    else ws.value?.close()
    await scrollToBottom()   // 首次渲染完滚到底
})

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
    user-select: none;
    justify-content: space-between;
}

.content-header span{
    font-weight: bold;
    color: var(--header-text-color);
}

.content-body {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    color: var(--header-text-color)
}

.content-body ul {
    width: 100%;
}

.content-body ul li {
    width: 100%;
    display: flex;
    padding: 7px 10px;
}

.content-body ul li:nth-child(n+2) {
    margin-top: 5px;
}

.user-avatar {
    user-select: none;
    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
    }
}

.content-body ul li.selfuser {
    justify-content: end;
    /* background-color: rgba(0, 255, 255, 0.2); */
    /* position: relative; */
}

.content-body ul li.targetuser {
    justify-content: start;
    /* background-color: rgba(173, 255, 47, 0.2); */
    /* position: relative; */
}

.usernickname {
    font-size: 12px;
}

.msg-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.content-body ul li.selfuser .msg-content {
    align-items: end;
    margin: 0 10px 0 40px;
}

.content-body ul li.targetuser .msg-content {
    align-items: start;
    margin: 0 40px 0 10px;
}

.content-body ul li.selfuser .msg-content .content {
    background-color: var(--self-user-msg-bgc);
}

.content-body ul li.targetuser .msg-content .content {
    background-color: var(--target-user-msg-bgc);
}

.content {
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: center;
}

.input-area {
    width: 100%;
    height: 100%;
    /* background-color: antiquewhite; */
    overflow: hidden;
    padding: 5px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.input-area .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--input-area-mask-bgc);
    /* opacity: 0.5; */
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--header-text-color);
    cursor: default;
    user-select: none;
}

.input-header {
    width: 100%;
    height: 30px;
    background-color: rgb(55, 87, 87);
    padding: 0px 11px;
    user-select: none;
}

.input-body {
    width: 100%;
    height: 100%;
    margin-top: 5px;
    /* background-color: red; */
    overflow: auto;
}

textarea {
    width: 100%;
    height: 100%;
    resize: none;
    background-color: transparent;
    color: var(--header-text-color);
    border: none;
    box-shadow: none !important;
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
    color: var(--header-text-color);
    /* background-color: antiquewhite; */
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
    justify-content: space-around;
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

.in-or-out-status {
    width: 150px;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

:deep(.el-drawer__body) {
    padding: 10px;
    background-color: var(--layout-content-bg-color);
}

.convDrawer {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background: var(--header-bg-color);
}

.private-type {
    width: 100%;
    height: 100%;
    /* background: rgb(126, 126, 172); */
    cursor: default;
    color: var(--header-text-color);
    padding-top: 20px;
}

.private-type > div:nth-child(n) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* width: 100%; */
    height: 40px;
    margin: 0 12px 0 12px;
    border-radius: 5px;
    background-color: var(--layout-content-bg-color);
    padding: 0 10px;
}

.private-type > div:nth-child(n+2) {
    margin-top: 10px;
}

.private-type > div.del-msg-history {
    justify-content: center;
}

.private-type > div.del-msg-history:hover {
    background-color: var(--chat-change-list-iconfont-hover-color);
}

.private-type > div.del-friend {
    justify-content: center;
}

.private-type > div.del-friend:hover {
    background-color: var(--chat-change-list-iconfont-hover-color);
}

.group-type {
    width: 100%;
    height: 100%;
    /* background: rgb(126, 126, 172); */
    cursor: default;
    color: var(--header-text-color);
    padding-top: 20px;
}

.group-type > div:nth-child(n+2) {
    margin-top: 10px;
}

.change-name {
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .el-input {
        width: 75%;
    }
}

.quit-group {
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin: 0 12px 0 12px;
    border-radius: 5px;
    background-color: var(--layout-content-bg-color);
    padding: 0 10px;
}

.quit-group:hover {
    background-color: var(--chat-change-list-iconfont-hover-color);
}

.clear-group {
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin: 0 12px 0 12px;
    border-radius: 5px;
    background-color: var(--layout-content-bg-color);
    padding: 0 10px;
}

.clear-group:hover {
    background-color: var(--chat-change-list-iconfont-hover-color);
}
</style>
