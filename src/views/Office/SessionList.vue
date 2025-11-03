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
                        {{ session?.title }}
                    </div>
                    <div class="last-msg">
                        {{ getLastMsg(session.id) }}
                    </div>
                </div>
                <div class="session-item-right">
                    <div class="time">
                        {{ formatTs(getDate(session.id) as number) }}
                    </div>
                    <div class="unreadnum">
                        <span>{{ session.unread <= 99 ? session.unread : "99+" }}</span>
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


const getLastMsg = (sessionId: number) => {
    const session = messageStore.sessionMessageList.find(s => s.conv_id === sessionId);
    const list = session?.msgList;
    return list?.length ? list[list.length - 1].content : '';
};

const getDate = (sessionId: number) => {
    const session = messageStore.sessionMessageList.find(s => s.conv_id === sessionId);
    const list = session?.msgList;
    return list?.length ? list[list.length - 1].timestamp : '';
}

watch(() => SessionInfo.value, () => {
    sessionStore.changeConvId(SessionInfo.value.id)
})

// 处理日期
const formatTs = (ts: number): string => {
    const date = new Date(ts);
    const now = new Date();

    // 统一为本地零点时间
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfThisWeek = new Date(startOfToday);
    startOfThisWeek.setDate(startOfToday.getDate() - startOfToday.getDay()); // 本周日

    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

    // 今天内
    if (date >= startOfToday) {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    // 本周内
    if (date >= startOfThisWeek) {
        const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
        return `星期${weekDay}`;
    }

    // 今年内
    if (date >= startOfThisYear && date < startOfNextYear) {
        const M = (date.getMonth() + 1).toString().padStart(2, '0');
        const D = date.getDate().toString().padStart(2, '0');
        return `${M}/${D}`;
    }

    // 其它
    return '';
}

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
    user-select: none;
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
