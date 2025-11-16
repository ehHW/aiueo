import { defineStore } from 'pinia'

import { getMessageListApi, getSessionListApi } from '@/api/friend';
import type { MessageItem, SessionData, WSReadReceiptData } from '@/types/chat';
import { ref } from 'vue';


export const useSessionStore = defineStore(
    'session',
    () => {
        const SessionInfo = ref<SessionData>({
            created_at: 0,
            id: 0,
            last_msg_id: null,
            last_time: null,
            title: "",
            type: "private",
            unread: 0,
            dissolved: false
        })
        const convIds = ref<number []>([])
        const sessionList = ref<SessionData[]>([])
        const getSessionList = async () => {
            await getSessionListApi().then(async res => {
                if (res.data.state === 200) {
                    sessionList.value = res.data.data
                    convIds.value = sessionList.value.map(item => item.id)
                    await loadLastMessage()
                }
            })
        }

        /* 新增：convId -> 最后一条消息 */
        const lastMsgMap = ref<Record<number, MessageItem>>({})
        /* 批量拉取每个会话的最后 1 条消息 */
        const loadLastMessage = async () => {
            const reqs = convIds.value.map(convId => getMessageListApi({ conv_id: convId, last_msg_id: 0, limit: 1 }).then(res => {
                if (res.data.state === 200 && res.data.data.length) {
                    lastMsgMap.value[convId] = res.data.data[0];
                }
            }).catch(() => { }))
            await Promise.all(reqs)
        }

        const changeSession = (session: SessionData) => {
            SessionInfo.value = session
        }

        const changeSessionById = (id: number) => {
            SessionInfo.value = sessionList.value.find(item => item.id === id) as SessionData
        }

        const setLastMsg = (conv_id: number, msg: MessageItem) => {
            lastMsgMap.value[conv_id] = msg
        }

        const updateUnRead = (data: WSReadReceiptData, type: 'add' | 'minus') => {
            const conv = sessionList.value.find(item => item.id === data.conv_id)
            if (conv) {
                if (conv.unread > 0 && type === 'minus') conv.unread --;
                if (type === 'add') conv.unread ++;
            }
        }

        const resetSessionInfo = () => {
            SessionInfo.value.created_at = 0
            SessionInfo.value.id = 0
            SessionInfo.value.last_msg_id = null
            SessionInfo.value.last_time = null
            SessionInfo.value.title = ""
            SessionInfo.value.type = "private"
            SessionInfo.value.unread = 0
        }

        return {
            SessionInfo,
            sessionList,
            getSessionList,
            changeSession,
            changeSessionById,
            resetSessionInfo,
            loadLastMessage,
            lastMsgMap,
            setLastMsg,
            updateUnRead
        }
    },
    {
        persist: true,
    },
)
