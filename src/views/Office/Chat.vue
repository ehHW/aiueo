<template>
    <div class="chat-container">
        <el-splitter>
            <el-splitter-panel size="50" :resizable="false">
                <ChatMenu />
            </el-splitter-panel>
            <el-splitter-panel min="180" size="250" max="260">
                <ConversationList />
            </el-splitter-panel>
            <el-splitter-panel>
                <Conversation />
            </el-splitter-panel>
        </el-splitter>
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
    overflow: auto;
}

:deep(.el-splitter-panel) {
    overflow: auto;
}
</style>
