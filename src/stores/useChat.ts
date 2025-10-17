import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore(
    'chat',
    () => {
        type toolBarType = {
            contactList: boolean
            sessionList: boolean
        }
        const toolBar = reactive<toolBarType>({
            contactList: false,
            sessionList: true,
        })

        const toggleToolBar = (key: keyof toolBarType) => {
            for (const k in toolBar) {
                toolBar[k as keyof toolBarType] = false
            }
            toolBar[key] = true
        }

        return {
            toolBar,
            toggleToolBar,
        }
    },
    {
        persist: true,
    },
)
