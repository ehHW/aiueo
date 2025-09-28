<template>
    <div>
        <el-button type="primary" plain @click="addFriend(3)">添加好友</el-button> <br />
        <el-button type="primary" plain @click="getFriendList">获取好友列表</el-button> <br />
        <el-button type="primary" plain @click="getFriendRequestList">获取好友请求列表</el-button> <br />
        <el-button type="primary" plain @click="handleFriendRequest('accept', 3)">接受好友请求</el-button> <br />
        <el-button type="primary" plain @click="handleFriendRequest('decline', 3)">拒绝好友请求</el-button> <br />
    </div>
</template>

<script lang="ts" setup>
// import { useChatStore } from '@/stores/useChat';
import {
    getFriendListApi,
    addFriendApi,
    handleFriendRequestApi,
    getFriendRequestListApi,
 } from '@/api/friend';

// const chatStore = useChatStore();


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

<style></style>
