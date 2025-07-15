<template>
    <a-layout-sider v-model:collapsed="useMenu.collapsed" :trigger="null" collapsible
        :theme="useTheme.isDark ? 'dark' : 'light'" :style="{ height: `${viewportHeight}px`, overflow: 'auto' }">
        <div class="logo">
            <img src="@/assets/img/miao.png" />
        </div>
        <a-menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            :theme="useTheme.isDark ? 'dark' : 'light'"
            mode="inline"
            >
            <a-sub-menu v-for="item in useUser.menuList" :key="item.auth_id" >
                <template #title>
                    <span>
                        <i class="iconfont" :class="item.icon"></i>
                        <span v-if="!useMenu.collapsed">{{ item.auth_name }}</span>
                    </span>
                </template>
                <a-menu-item v-for="subItem in item.children" :key="subItem.auth_id" @click="router.push(subItem.path)">
                    <i class="iconfont" :class="subItem.icon"></i>
                    {{ subItem.auth_name }}</a-menu-item>
            </a-sub-menu>
        </a-menu>
    </a-layout-sider>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useMenuStore } from '@/stores/useMenu';
import { useThemeStore } from '@/stores/useTheme';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/useUser';

const route = useRoute()
const openKeys = ref<number[]>([]);
const selectedKeys = ref<number[]>([]);
const useMenu = useMenuStore();
const useUser = useUserStore()
const useTheme = useThemeStore();
const router = useRouter();

watch(
    () => route.path,
    (newVal) => {
        const matched = useUser.menuList.find(item => item.children.some(subItem => subItem.path === newVal));
        if (matched) {
            openKeys.value = [matched.auth_id];
            selectedKeys.value = matched.children.filter(subItem => subItem.path === newVal).map(subItem => subItem.auth_id);
        } else {
            openKeys.value = [];
            selectedKeys.value = [];
        }
    },
    {
        immediate: true,
    }
)

const viewportHeight = ref(window.innerHeight);
// console.log(viewportHeight.value);

const updateHeight = () => {
    viewportHeight.value = window.innerHeight;
};

onMounted(() => {
    window.addEventListener('resize', updateHeight);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateHeight);
});
</script>

<style scoped>
.logo {
    height: 32px;
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
    }
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}
</style>
