import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const useTabViewsStore = defineStore(
    'tabViews',
    () => {
        const route = useRoute()
        const tabViews = ref<{ title: string; path: string }[]>([])
        onMounted(() => {
            watch(
                () => route.path,
                (newVal) => {
                    if (!tabViews.value.some((item) => item.path === newVal)) {
                        tabViews.value.push({
                            title: route.meta.name2 as string,
                            path: newVal,
                        })
                    }
                },
                {
                    immediate: true,
                },
            )
        })
        const clearTabViews = () => {
            tabViews.value = []
        }
        return {
            tabViews,
            clearTabViews,
        }
    },
    {
        persist: true,
    },
)
