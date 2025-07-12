<template>
    <a-layout-header style="padding: 0; height: 80px;" class="header">
        <div class="topNav">
            <div class="left">
                <menu-unfold-outlined v-if="useMenu.collapsed" class="trigger" @click="useMenu.toggleCollapsed" />
                <menu-fold-outlined v-else class="trigger" @click="useMenu.toggleCollapsed" />
            </div>
            <div class="right">
                <div class="right">
                    <!-- <el-icon :size="20" style="color: var(--my-aside-text-color); margin-right: 10px">
                        <Setting />
                    </el-icon> -->
                    <!-- <el-icon :size="20" style="color: var(--my-aside-text-color); margin-right: 10px">
                        <FullScreen />
                    </el-icon> -->
                    <SwitchTheme style="margin-right: 10px" />
                    <!-- <img :src="userStore.userInfo.avatar" alt="logo" /> -->
                    <el-dropdown style="border: none">
                        <span class="el-dropdown-link">
                            {{ userStore.userInfo.username }}
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu style="background-color: var(--bg-color); border: none">
                                <el-dropdown-item disabled>{{
                                    userStore.userInfo.username
                                    }}</el-dropdown-item>
                                <el-dropdown-item @click=" userStore.logout(); tabViewsStore.clearTabViews()"
                                    style="color: var(--el-text-color-regular)">退出登录</el-dropdown-item>
                                <el-dropdown-item style="color: var(--el-text-color-regular)">主题切换</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <TabViews />
    </a-layout-header>
</template>

<script lang="ts" setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { ArrowDown } from '@element-plus/icons-vue'  // Setting, FullScreen,
import SwitchTheme from '@/components/ChangeTheme/SwitchTheme.vue';
import TabViews from './TabViews.vue'
import { useMenuStore } from '@/stores/useMenu';
import { useUserStore } from '@/stores/useUser';
import { useTabViewsStore } from '@/stores/useTabViews';

const userStore = useUserStore();
const tabViewsStore = useTabViewsStore();
const useMenu = useMenuStore();
</script>

<style scoped>
.changeTheme {
    display: inline-block;
    width: 40px;
    height: 32px;
    position: absolute;
    right: 10px;
}

.trigger {
    font-size: 18px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    transition: color 0.3s;
    color: var(--text-color);
}

.trigger:hover {
    color: #1890ff;
}

.header {
    background: var(--header-bg-color);
}

.topNav {
    width: 100%;
    height: 40px;
    /* padding: 0 20px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--my-header-bg-color)
}

.left {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.right {
    height: 100%;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    cursor: default;
    padding: 0 20px;
}

img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}

.el-dropdown-link:focus {
    outline: none;
}
</style>
