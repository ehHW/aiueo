import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore(
    'theme',
    () => {
        const isDark = ref(false)
        return { isDark }
    },
    {
        persist: true,
    },
)
