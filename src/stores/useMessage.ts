import { defineStore } from 'pinia'

import { getMessageListApi } from '@/api/friend';
import type { GetMessageListParams } from '@/types/chat';
import { ref } from 'vue';


export const useMessageStore = defineStore(
    'message',
    () => {
        const messageList = ref([])
        const getMessageList = (data: GetMessageListParams) => {
            getMessageListApi(data).then(res => {
                console.log(res.data);
            })
        }

        return {
            messageList,
            getMessageList,
        }
    },
    {
        persist: true,
    },
)
