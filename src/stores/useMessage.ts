import { defineStore } from 'pinia'

import { getMessageListApi } from '@/api/friend';
import type { GetMessageListParams, Message } from '@/types/chat';
import { ref } from 'vue';


export const useMessageStore = defineStore(
    'message',
    () => {
        const messageList = ref<Message[]>([])
        const loading = ref(false)          // 是否正在请求
        const noMore = ref(false)           // 是否到底（没有更早消息）
        const getMessageList = (data: GetMessageListParams) => {
            messageList.value = []
            getMessageListApi(data).then(res => {
                if (res.data.state == 200) {
                    messageList.value.push(...res.data.data)
                    noMore.value = res.data.data.length < data.limit   // 返回不足 50 条说明到顶
                } else ElMessage.error(res.data.msg)
            }).finally(() => loading.value = false)
        }

        const loadMoreHistory = (conversationId: number) => {
            if (loading.value || noMore.value) return
            const oldestId = messageList.value[0]?.id
            if (!oldestId) return          // 当前列表为空
            loading.value = true
            return getMessageListApi({
                conversation_id: conversationId,
                last_msg_id: oldestId - 1,   // 后端 id>last_msg_id ，所以减 1
                limit: 50
            }).then(res => {
                if (res.data.state === 200) {
                    const list = res.data.data
                    if (list.length) messageList.value.unshift(...list)
                    noMore.value = list.length < 50
                    } else ElMessage.error(res.data.msg)
                }).finally(() => loading.value = false)
        }

        return {
            messageList,
            loading,
            noMore,
            getMessageList,
            loadMoreHistory,
        }
    },
    {
        persist: true,
    },
)
