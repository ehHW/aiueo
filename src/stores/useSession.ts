import { defineStore } from 'pinia'

import { getSessionListApi } from '@/api/friend';
import type { SessionData } from '@/types/chat';
import { ref } from 'vue';
import { useMessageStore } from '@/stores/useMessage';


export const useSessionStore = defineStore(
    'session',
    () => {
        const conv_id = ref<number>(0);
        const changeConvId = (convId: number) => {
            conv_id.value = convId
        }

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
        const sessionList = ref<SessionData[]>([])
        const messageStore = useMessageStore()
        const getSessionList = async () => {
            return await getSessionListApi().then(res => {
                if (res.data.state == 200) {
                    sessionList.value = res.data.data
                    messageStore.sessionMessageList = []
                    const unexist_session_message_list = sessionList.value.filter(session => {
                        const exist_session_message_list = messageStore.sessionMessageList.map(item => item.conv_id)
                        if (!exist_session_message_list.includes(session.id)) return true
                    })
                    unexist_session_message_list.forEach(session => {
                        messageStore.sessionMessageList.push({conv_id: session.id, noMore: false, msgList: []})
                    })
                    messageStore.getSessionMessageListMessages()
                }
            })
        }

        const changeSession = (session: SessionData) => {
            SessionInfo.value = session
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
            conv_id,
            changeConvId,
            SessionInfo,
            sessionList,
            getSessionList,
            changeSession,
            resetSessionInfo
        }
    },
    {
        persist: true,
    },
)
