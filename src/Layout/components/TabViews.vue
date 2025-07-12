<template>
    <div class="tabViews">
        <el-tabs v-model="editableTabsValue" type="" closable class="demo-tabs" @edit="handleTabsEdit"
            @tab-change="handleTabChange">
            <el-tab-pane v-for="item in tabViewsStore.tabViews" :key="item.path" :label="item.title"
                :name="item.path" />
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { TabPaneName } from 'element-plus'
import { useTabViewsStore } from '@/stores/useTabViews'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
const tabViewsStore = useTabViewsStore()
const editableTabsValue = ref('')
watch(
    () => route.path,
    (newVal) => {
        editableTabsValue.value = newVal
    },
    {
        immediate: true,
    },
)

const handleTabsEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
    if (action === 'remove') {
        const tabs = tabViewsStore.tabViews
        let activeName = editableTabsValue.value
        if (activeName === targetName) {
            tabs.forEach((tab, index) => {
                if (tab.path === targetName) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        activeName = nextTab.path
                    }
                }
            })
        }

        editableTabsValue.value = activeName
        tabViewsStore.tabViews = tabs.filter((tab) => tab.path !== targetName)
        router.push(activeName)
    }
}

const handleTabChange = (tab: TabPaneName) => router.push(tab as string)
</script>

<style scoped>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.tabViews {
    width: 100%;
    height: 40px;
    background-color: var(--my-header-bg-color);
    padding: 0 20px;
    margin-bottom: 0;
}

:deep(div.el-tabs__item.is-top.is-closable) {
    color: var(--text-color);
}
</style>
