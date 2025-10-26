<template>
    <div class="contact-list">
        <ul>
            <li v-for="friend in friendList" :key="friend.user_id">
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
import { getFriendListApi } from '@/api/friend';
import type { FriendData } from '@/types/chat';
import { ref } from 'vue';

const friendList = ref<FriendData[]>([])
const getFriendList = () => {
    getFriendListApi().then((res) => {
        console.log('获取好友列表:', res.data.data);
        friendList.value = res.data.data
    }).catch((error) => {
        console.error('获取好友列表失败:', error);
    });
}
getFriendList()
</script>

<style scoped>
.contact-list {
    width: 100%;
    height: calc(100% - 50px);
    /* margin-top: 50px; */
    background-color: var(--header-bg-color);
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
    background-color: aqua;
    display: flex;
    align-items: center;
    padding: 5px 10px;
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
