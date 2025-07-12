<template>
    <el-switch v-model="isDark" @change="handleChange" @click="handleClick" style="
            --el-switch-on-color: black;
            --el-switch-off-color: white;
            --el-switch-border-color: #aaa;
        ">
        <template #active-action>
            <div class="custom-active-action" style="width: 100%;height: 100%;
            border-radius: 5px;
            overflow: hidden;
            ">
                <el-icon :size="16" color="black">
                    <Moon />
                </el-icon>
            </div>
        </template>
        <template #inactive-action>
            <span class="custom-inactive-action" style="width: 100%;height: 100%;">
                <el-icon :size="16" color="black">
                    <Sunny />
                </el-icon>
            </span>
        </template>
    </el-switch>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/useTheme'


const useTheme = useThemeStore()
document.documentElement.classList.add('light')
document.documentElement.classList.remove('dark')
const isDark = ref(false)
function handleClick(event: MouseEvent) {
    const transition = document.startViewTransition(() => {
        if (isDark.value) {
            document.documentElement.classList.add('dark')
            document.documentElement.classList.remove('light')
            useTheme.isDark = true
        } else {
            document.documentElement.classList.add('light')
            document.documentElement.classList.remove('dark')
            useTheme.isDark = false
        }
    })

    transition.ready.then(() => {
        const { clientX, clientY } = event
        const radius = Math.hypot(
            Math.max(clientX, window.innerWidth - clientX),
            Math.max(clientY, window.innerHeight - clientY),
        )
        const clipPath = [
            `circle(0px at ${clientX}px ${clientY}px)`,
            `circle(${radius}px at ${clientX}px ${clientY}px)`,
        ]
        document.documentElement.animate(
            {
                clipPath: isDark.value ? clipPath.reverse() : clipPath,
            },
            {
                duration: 600,
                easing: 'cubic-bezier(0.605, 0.010, 1.000, 0.635)',
                pseudoElement: isDark.value
                    ? '::view-transition-old(root)'
                    : '::view-transition-new(root)',
            },
        )
    })
}

const handleChange = (val: boolean) => {
    void val
}
</script>

<style scoped>
div.el-switch__action {
    background-color: black;
}
</style>
