<template>
    <div class="contact-list">
        <ul>
            <li v-for="friend in chatStore.friendList" :key="friend.user_id"
            @dblclick="chatStore.getOrCreatePrivate(friend.user_id)">
                <div class="avatar">
                    <img src="@/assets/img/miao.png" />
                </div>
                <div class="username">
                    {{ friend.username }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/useChat';
import { onMounted } from 'vue';

const chatStore = useChatStore()
onMounted(() => chatStore.getFriendList())
</script>

<style scoped>
.contact-list {
    width: 100%;
    height: calc(100% - 50px);
    /* margin-top: 50px; */
    background-color: var(--chat-session-list-li-bg-color);
    overflow: auto;
    position: relative;
}

.contact-list ul {
    width: 100%;
    height: 100%;
    overflow: auto;
    cursor: default;
}

.contact-list ul li {
    width: 100%;
    height: 50px;
    background-color: transparent;
    display: flex;
    align-items: center;
    padding: 5px 10px;
}

.contact-list ul li:hover {
    background-color: rgba(200, 200, 200, 0.4);
}

.avatar {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
    }
}

.contact-list ul li:nth-child(n+2) {
    margin-top: 10px;
}
</style>
