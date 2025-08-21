import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore(
    'chat',
    () => {
        const toolBar = reactive({
            contactList: false,
            sessionList: true,
        })

        const toggleToolBar = (key: string) => {
            for (const k in toolBar) {
                toolBar[k] = false
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
