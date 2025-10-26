import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore(
    'chat',
    () => {
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

        return {
            mode,
            changeMode,
        }
    },
    {
        persist: true,
    },
)
