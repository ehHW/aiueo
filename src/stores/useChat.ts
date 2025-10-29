import { reactive } from 'vue'
import { defineStore } from 'pinia'

import { getFriendRequestListApi } from '@/api/friend';
import type { FriendRequestData } from '@/types/chat';
import { ref } from 'vue';


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
        return {
            mode,
            changeMode,
            friendRequestList,
            getFriendRequestList,
        }
    },
    {
        persist: true,
    },
)
