import { reactive } from 'vue'
import { defineStore } from 'pinia'

import { getSessionListApi } from '@/api/friend';
import type { SessionData } from '@/types/chat';
import { ref } from 'vue';
import ReconnectingWebSocket from '@/utils/ReconnectingWebSocket';

export const useChatStore = defineStore(
    'chat',
    () => {
        // ws
        const roomName = "testroom";
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsURL = `${protocol}//${window.location.host}/chat/channel/${roomName}/`
        const ws = new ReconnectingWebSocket(
            wsURL,
            { maxRetries: 5, heartbeatInterval: 25000 }
        );

        // conversation-left
        type modeType = {
            message: boolean
            contact: boolean
        }
        const mode = reactive<modeType>({
            message: true,
            contact: false,
        })
        const changeMode = (key: keyof modeType) => {
            for (const k in mode) {
                mode[k as keyof modeType] = false
            }
            mode[key] = true
        }

        // conversation-mid-sessionList
        const sessionList = ref<SessionData[]>([])
        const getSessionList = () => {
            getSessionListApi().then(res => {
                sessionList.value = res.data.data
            })
        }


        return {
            ws,
            mode,
            changeMode,
            sessionList,
            getSessionList,
        }
    },
    {
        persist: true,
    },
)
