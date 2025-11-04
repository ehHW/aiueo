import { defineStore } from 'pinia'

import { getMessageListApi } from '@/api/friend';
// import type { GetMessageListParams, Message, SessionMessageItem } from '@/types/chat';
import type { SessionMessageItem } from '@/types/chat';
import { computed, ref } from 'vue';
import { useSessionStore } from '@/stores/useSession';


export const useMessageStore = defineStore(
    'message',
    () => {
        const sessionStore = useSessionStore()
        const sessionMessageList = ref<SessionMessageItem[]>([])
        const getSessionMessageListMessages = () => {
            sessionMessageList.value.forEach(sessionMessageItem => {
                getMessageListApi({
                    conversation_id: sessionMessageItem.conv_id,
                    limit: 50
                }).then(res => {
                    const list = res.data.data
                    sessionMessageItem.noMore = res.data.data.length < 50
                    sessionMessageItem.msgList.push(...list)
                })
            })
        }
        const currentSession = computed(() => sessionMessageList.value.find(item => item.conv_id === sessionStore.conv_id))
        // const messageList = ref<Message[]>([])
        const loading = ref(false)          // 是否正在请求
        // const noMore = ref(false)        // 是否到底（没有更早消息）
        // const getMessageList = (data: GetMessageListParams) => {
        //     messageList.value = []
        //     getMessageListApi(data).then(res => {
        //         if (res.data.state == 200) {
        //             messageList.value.push(...res.data.data)
        //             noMore.value = res.data.data.length < data.limit   // 返回不足 50 条说明到顶
        //         } else ElMessage.error(res.data.msg)
        //     }).finally(() => loading.value = false)
        // }

        const loadMoreHistory = (conversationId: number) => {
            const currentSession = sessionMessageList.value.find(sessionMessageItem => sessionMessageItem.conv_id === conversationId)
            if (loading.value || currentSession!.noMore) return
            const oldestId = currentSession?.msgList[0]?.id      //messageList.value[0]?.id
            if (!oldestId) return          // 当前列表为空
            loading.value = true
            return getMessageListApi({
                conversation_id: conversationId,
                last_msg_id: oldestId - 1,   // 后端 id>last_msg_id ，所以减 1
                limit: 50
            }).then(res => {
                if (res.data.state === 200) {
                    const list = res.data.data
                    if (list.length) currentSession.msgList.unshift(...list)
                    currentSession!.noMore = list.length < 50
                    } else ElMessage.error(res.data.msg)
                }).finally(() => loading.value = false)
        }

        return {
            // messageList,
            currentSession,
            loading,
            // noMore,
            // getMessageList,
            loadMoreHistory,
            sessionMessageList,
            getSessionMessageListMessages
        }
    },
    {
        persist: true,
    },
)
