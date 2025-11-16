import { reactive } from 'vue'
import { defineStore } from 'pinia'

import { getFriendListApi, getFriendRequestListApi, getOrCreatePrivateApi } from '@/api/friend';
import type { FriendData, FriendRequestData, SessionData } from '@/types/chat';
import { ref } from 'vue';
import { useSessionStore } from '@/stores/useSession';


export const useChatStore = defineStore(
    'chat',
    () => {
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

        // conversation-right-friendRequestList
        const friendRequestList = ref<FriendRequestData[]>([])
        const getFriendRequestList = () => {
            getFriendRequestListApi().then((res) => {
                friendRequestList.value = res.data.data
                // console.log('获取好友请求列表:', friendRequestList.value);
            }).catch((error) => {
                console.error('获取好友请求列表失败:', error);
            });
        }
        getFriendRequestList();

        const friendList = ref<FriendData[]>([])
        const getFriendList = () => {
            getFriendListApi().then((res) => {
                friendList.value = res.data.data
            }).catch((error) => {
                console.error('获取好友列表失败:', error);
            });
        }

        const sessionStore = useSessionStore()
        const getOrCreatePrivate = (target_id: number) => {
            getOrCreatePrivateApi({target_id}).then(res => {
                const conv_id = res.data.data.conversation_id
                changeMode('message')
                sessionStore.getSessionList().then(() => {
                    sessionStore.changeSession(sessionStore.sessionList.find(item => item.id === conv_id) as SessionData)
                })
            })
        }

        return {
            mode,
            changeMode,
            friendRequestList,
            getFriendRequestList,
            friendList,
            getFriendList,
            getOrCreatePrivate,
        }
    },
    {
        persist: true,
    },
)
