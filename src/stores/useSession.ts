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
            title: "title",
            type: "private",
            unread: 0
        })
        const sessionList = ref<SessionData[]>([])
        const messageStore = useMessageStore()
        const getSessionList = () => {
            return getSessionListApi().then(res => {
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

        return {
            conv_id,
            changeConvId,
            SessionInfo,
            sessionList,
            getSessionList,
            changeSession,
        }
    },
    {
        persist: true,
    },
)
