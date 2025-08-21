<template>
    <div class="chat-container">
        <div class="change-list">
            <div :class="{ 'session': true, 'selected': chatStore.toolBar.sessionList }"
                @click="chatStore.toggleToolBar('sessionList')">
                <span class="iconfont icon-xiaoxi"></span>
            </div>
            <div :class="{ 'contact': true, 'selected': chatStore.toolBar.contactList }"
                @click="chatStore.toggleToolBar('contactList')">
                <span class="iconfont icon-biaoqing"></span>
            </div>
        </div>
        <div class="user-area">
            <div class="search">
                <el-input placeholder="搜索" style="width: 70%;" />
                <span>+</span>
            </div>
            <div class="session-list" v-if="chatStore.toolBar.sessionList">
                <div class="self-user">
                    <div class="user-avatar">
                        <img src="" alt="头像" />
                    </div>
                </div>
            </div>
            <div class="friend-list" v-if="chatStore.toolBar.contactList">
                <el-button type="primary" plain @click="addFriend(3)">添加好友</el-button> <br />
                <el-button type="primary" plain @click="getFriendList">获取好友列表</el-button> <br />
                <el-button type="primary" plain @click="getFriendRequestList">获取好友请求列表</el-button> <br />
                <el-button type="primary" plain @click="handleFriendRequest('accept', 3)">接受好友请求</el-button> <br />
                <el-button type="primary" plain @click="handleFriendRequest('decline', 3)">拒绝好友请求</el-button> <br />
            </div>
        </div>
        <div class="chat-area">
            <div v-if="chatStore.toolBar.sessionList">
                <!-- 聊天内容区域 -->
                <p>聊天内容区域</p>
            </div>
            <div v-if="chatStore.toolBar.contactList">
                <!-- 联系人内容区域 -->
                <p>联系人内容区域</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useChatStore } from '@/stores/useChat';
import {
    getFriendListApi,
    addFriendApi,
    handleFriendRequestApi,
    getFriendRequestListApi,
 } from '@/api/friend';

const chatStore = useChatStore();


const getFriendList = () => {
    getFriendListApi().then((res) => {
        console.log('获取好友列表:', res.data);
    }).catch((error) => {
        console.error('获取好友列表失败:', error);
    });
}


const addFriend = (receiverId: number) => {
    addFriendApi(receiverId).then((res) => {
        console.log('添加好友请求:', res.data);
    }).catch((error) => {
        console.error('添加好友请求失败:', error);
    });
}


const getFriendRequestList = () => {
    getFriendRequestListApi().then((res) => {
        console.log('获取好友请求列表:', res.data);
    }).catch((error) => {
        console.error('获取好友请求列表失败:', error);
    });
}


const handleFriendRequest = (action: 'accept' | 'decline', senderId: number) => {
    handleFriendRequestApi(action, senderId).then((res) => {
        console.log(`处理好友请求 ${action}:`, res.data);
    }).catch((error) => {
        console.error(`处理好友请求 ${action} 失败:`, error);
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
    overflow: auto;
}

.user-area .search {
    width: 100%;
    height: 8%;
    background-color: red;
    padding: 0 10px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.user-area .search span {
    display: block;
    color: black;
    border: 1px solid black;
    border-radius: 5px;
    font-size: 20px;
    width: 30px;
    height: 30px;
    text-align: center;
    cursor: default;
    transition: all 0.3s ease;
}

.user-area .search span:hover {
    color: white;
    background-color: black;
}

.chat-area {
    flex: 1;
    background-color: rgb(96, 203, 96);
}
</style>
