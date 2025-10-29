<template>
    <div class="session-list">
        <ul>
            <li
            v-for="session in sessionStore.sessionList"
            :key="session.id"
            @dblclick="changeSession(session)">
                {{ session.title }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/useMessage';
import { useSessionStore } from '@/stores/useSession';
import { onMounted, toRefs, watch } from 'vue';


const sessionStore = useSessionStore();
const messageStore = useMessageStore();
const { SessionInfo, changeSession } = toRefs(sessionStore);
watch(() => SessionInfo.value, () => {
    messageStore.getMessageList({
        conversation_id: SessionInfo.value.id
    })
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
}

.session-list ul li {
    width: 100%;
    height: 50px;
    background-color: red;
}

.session-list ul li:nth-child(n+2) {
    margin-top: 5px;
}
</style>
