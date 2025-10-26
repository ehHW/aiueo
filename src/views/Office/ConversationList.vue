<template>
    <div class="conversation-list">
        <ConversationHeader />
        <SessionList v-show="chatStore.mode.message"/>
        <ContactList v-show="chatStore.mode.contact"/>
    </div>
</template>

<script lang="ts" setup>
import SessionList from './SessionList.vue';
import ConversationHeader from './ConversationHeader.vue';
import ContactList from './ContactList.vue';
import { useChatStore } from '@/stores/useChat';

const chatStore = useChatStore()
</script>

<style scoped>
.conversation-list {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
