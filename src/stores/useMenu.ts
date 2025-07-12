import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore(
    'menu',
    () => {
        const collapsed = ref<boolean>(false)
        const toggleCollapsed = () => {
            collapsed.value = !collapsed.value
        }
        return {
            collapsed,
            toggleCollapsed,
        }
    },
    {
        persist: true,
    },
)
