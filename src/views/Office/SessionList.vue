<template>
    <div class="session-list">
        <ul>
            <li
            v-for="session in sessionStore.sessionList"
            :key="session.id"
            :class="sessionStore.conv_id === session.id ? 'active' : ''"
            @dblclick="changeSession(session)">
                <div class="session-item-left">
                    <img src="@/assets/img/miao.png" alt="" />
                </div>
                <div class="session-item-mid">
                    <div class="session-title">
                        {{ session.title }}
                    </div>
                    <div class="last-msg">
                        {{ messageStore.messageList[messageStore.messageList.length-1].content }}
                    </div>
                </div>
                <div class="session-item-right">
                    <div class="time">
                        16:51
                    </div>
                    <div class="unreadnum">
                        <span>10</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/useMessage';
import { useSessionStore } from '@/stores/useSession';
import { onMounted, toRefs, watch } from 'vue';

const messageStore = useMessageStore()
const sessionStore = useSessionStore();
const { SessionInfo, changeSession } = toRefs(sessionStore);
watch(() => SessionInfo.value, () => {
    sessionStore.changeConvId(SessionInfo.value.id)
})

onMounted(() => sessionStore.getSessionList())
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
    cursor: default;
}

.session-list ul li {
    width: 100%;
    height: 50px;
    background-color: var(--header-bg-color);
    display: flex;
    padding: 5px 10px;
    align-items: center;
    justify-content: space-between;
    color: var(--header-text-color)
}

.session-list ul li:hover {
    background-color: rgba(200, 200, 200, 0.4);
}

.session-list ul li:nth-child(n+2) {
    margin-top: 5px;
}

.session-list ul li.active {
    background-color: #aaa;
}

.session-item-left {
    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
    }
}

.session-item-mid {
    width: 65%;
    height: 100%;
    /* background-color: red; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.last-msg {
    font-size: small;
}

.session-item-right {
    font-size: smaller;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.time {
    text-align: center;
}

.unreadnum {
    text-align: center;
}

.unreadnum span {
    display: inline-block;
    width: 18px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    border-radius: 50%;
    background-color: #d4d4d4;
}
</style>
