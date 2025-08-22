<template>
    <div class="chat-container">
        <ChatMenu />
        <ConversationList />
        <Conversation />
    </div>
</template>

<script lang="ts" setup>
import ChatMenu from './ChatMenu.vue';
import ConversationList from './ConversationList.vue';
import Conversation from './Conversation.vue';
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
</style>
