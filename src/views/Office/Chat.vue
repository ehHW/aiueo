<template>
    <div class="chat-container">
        <div class="change-list">
            <div :class="{ 'session': true, 'selected': chatStore.toolBar.chatList }"
                @click="chatStore.toggleToolBar('chatList')">
                <span class="iconfont icon-xiaoxi"></span>
            </div>
            <div :class="{ 'contact': true, 'selected': chatStore.toolBar.contactList }"
                @click="chatStore.toggleToolBar('contactList')">
                <span class="iconfont icon-biaoqing"></span>
            </div>
        </div>
        <div class="user-area">
            <div class="user-list">
                <div class="self-user">
                    <div class="user-avatar">
                        <img src="" alt="头像" />
                    </div>
                    <div class="search"></div>
                </div>
                <el-button type="primary" plain @click="test">测试请求</el-button>
            </div>
        </div>
        <div class="chat-area"></div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useChatStore } from '@/stores/useChat';
import { getTestApi, postTestApi } from '@/api/test';

const chatStore = useChatStore();

const test = () => {
    // getTestApi().then((res) => {
    //     console.log('GET API Response:', res);
    // }).catch((error) => {
    //     console.error('GET API Error:', error);
    // });
    postTestApi().then((res) => {
        console.log('POST API Response:', res);
    }).catch((error) => {
        console.error('POST API Error:', error);
    });
}

</script>

<style scoped>
.chat-container {
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 7px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.change-list {
    width: 40px;
    height: 100%;
    background-color: var(--header-bg-color);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.session {
    width: 40px;
    height: 40px;
    margin-top: 20px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    transition: all 0.3s ease;
    color: var(--text-color);
}

.session span {
    font-size: 20px;
    font-weight: 500;
}

.session:hover {
    color: var(--hover-text-color);
    background-color: rgba(0, 0, 0, 0.1);
}

.contact {
    width: 40px;
    height: 40px;
    margin-top: 20px;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
    transition: all 0.3s ease;
    color: var(--text-color);
}

.contact span {
    font-size: 20px;
    font-weight: 500;
}

.contact:hover {
    color: var(--hover-text-color);
    background-color: rgba(0, 0, 0, 0.1);
}

.selected {
    color: var(--chat-change-list-selected-text-color);
    background-color: var(--chat-change-list-selected-bg-color);
}

.user-area {
    width: 360px;
    background-color: rgb(109, 109, 255);
}

.self-user {
    display: flex;
    padding: 10px;
}

.chat-area {
    flex: 1;
    background-color: rgb(96, 203, 96);
}
</style>
