import { defineStore } from 'pinia'

import { getSessionListApi } from '@/api/friend';
import type { SessionData } from '@/types/chat';
import { ref } from 'vue';


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
        const getSessionList = () => {
            getSessionListApi().then(res => {
                sessionList.value = res.data.data
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
