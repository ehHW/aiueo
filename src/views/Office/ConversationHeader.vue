<template>
    <div class="conversation-header">
        <el-input
            class="convsersation-search-input"
            ref="searchInputRef"
            placeholder="搜索" v-model="searchValue"
            @focus="searchDropDown = true"
        ></el-input>
        <div v-show="searchDropDown"
        @mouseenter="searchDropDown = true"
        class="search-drop-down"
        ref="searchDropDownRef">
            <ul>
                <li v-for="(item, index) in 10" :key="index">{{ item }}</li>
            </ul>
        </div>
        <template v-for="(placement) in placements" :key="placement">
            <a-dropdown :placement="placement">
                <a-button size="small">+</a-button>
                <template #overlay>
                    <a-menu style="background-color: var(--my-main-search-bg-color)">
                        <a-menu-item>
                            <span @click="centerDialogVisible = true" style="color: var(--header-text-color);">
                                添加好友
                            </span>
                        </a-menu-item>
                        <a-menu-item>
                            <span @click="createGroup" style="color: var(--header-text-color);">
                                创建群聊
                            </span>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </template>
            <!-- <el-button plain @click="addFriend(0)">添加好友</el-button>
            <el-button plain @click="createGroup">创建群聊</el-button>
            <el-button plain>Primary</el-button>
            <el-button plain @click="getFriendList">获取好友列表</el-button>
            <el-button plain @click="getFriendRequestList">获取好友请求列表</el-button>
            <el-button plain @click="handleFriendRequest('accept', 3)">接受好友请求</el-button>
            <el-button plain @click="handleFriendRequest('decline', 3)">拒绝好友请求</el-button> -->
        <el-dialog
            v-model="centerDialogVisible"
            title=""
            width="500"
            align-center
            style="padding: 5px; background-color: var(--my-main-search-bg-color)"
        >
            <div class="add-friend-panel">
                <div class="add-friend-panel-left">
                    <div class="add-friend-panel-left-header">
                        <el-input v-model="addFriendPanelLeftValue"></el-input>
                    </div>
                    <div class="add-friend-panel-left-body">
                        <el-checkbox-group v-model="checkList">
                            <p v-for="(userItem, index) in userList" :key="index">
                                <el-checkbox :label="userItem.username" :value="userItem" />
                            </p>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="add-friend-panel-right">
                    <div class="add-friend-panel-right-header">

                    </div>
                    <div class="add-friend-panel-right-body">
                        <p v-for="item in checkList" :key="item.user_id">
                            <span>{{ item.username }}</span>
                            <span class="delete-checked" @click="checkList = checkList.filter((userItem) => userItem !== item)">x</span>
                        </p>
                    </div>
                    <div class="add-friend-panel-right-footer">
                        <el-button type="primary" @click="{
                            centerDialogVisible = false;
                            checkList.forEach(checkedUser => addFriend(checkedUser.user_id))
                            }">
                            确认
                        </el-button>
                        <el-button @click="centerDialogVisible = false">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    addFriendApi,
} from '@/api/friend';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { DropdownProps } from 'ant-design-vue';
import { getUserListApi } from '@/api/user';
import type { UserListData, UserListResponse } from '@/types/user';
import type { AxiosResponse } from 'axios';
const placements = ['bottomLeft'] as DropdownProps['placement'][];

const centerDialogVisible = ref(false)

const searchValue = ref<string>('')
const searchDropDown = ref(false)
const searchInputRef  = ref()
const searchDropDownRef = ref<HTMLElement>()

/* 点击页面任意处 */
const onClick = (e: MouseEvent) => {
  const tar = e.target as Node
  const inputEl = searchInputRef.value?.$el      // el-input 根节点
  const boxEl   = searchDropDownRef.value

  // 如果点击的是 input 或 search-box 内部，什么也不做
  if (inputEl?.contains(tar) || boxEl?.contains(tar)) return

  // 否则关闭
  searchDropDown.value = false
}

onMounted(() => document.addEventListener('click', onClick))
onBeforeUnmount(() => document.removeEventListener('click', onClick))

const initUserList = ref<UserListData[]>([])
const userList = ref<UserListData[]>([])
const addFriendPanelLeftValue = ref('')

const getUserList = async () => {
    let res: AxiosResponse<UserListResponse<UserListData[]>> = await getUserListApi({
        pagenum: 1,
        pagesize: 2000,
        username: '',
        mobile: '',
        role_name: '',
        created_at: '',
        updated_at: '',
    })
    initUserList.value = res.data.list?.reverse() || []
    userList.value = initUserList.value
}
getUserList()
watch(() => addFriendPanelLeftValue.value, (newVal) => {
    userList.value = initUserList.value.filter(item => {
        if (newVal === '') return true;
        return item.username.includes(newVal);
    })
})

const checkList = ref<UserListData[]>([])


const addFriend = (receiverId: number) => {
    addFriendApi(receiverId).then((res) => {
        // console.log('添加好友请求:', res.data);
        ElMessage.success(res.data.msg)
    }).catch((error) => {
        // console.log('添加好友请求失败:', error.response.data.msg);
        ElMessage.error(error.response.data.msg)
    });
}

const createGroup = () => {
    console.log('createGroup');
}
</script>

<style scoped>
.conversation-header {
    width: 100%;
    height: 50px;
    background-color: var(--header-bg-color);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.convsersation-search-input {
    width: 70% !important;
    height: 50%;
    background-color: var(--my-main-search-bg-color) !important;
}

.search-drop-down {
    width: 250px;
    height: 200px;
    position: absolute;
    left: 65px;
    top: 6%;
    background-color: aquamarine;
    border-radius: 5px;
    padding: 5px;
    z-index: 2;
}

:deep(.el-input__wrapper) {
    background-color: var(--my-main-search-bg-color) !important;
}

:deep(.convsersation-search-input .el-input__inner) {
    height: 100% !important;
}

:deep(.css-dev-only-do-not-override-1p3hq3p.ant-btn.ant-btn-default.ant-btn-sm.ant-dropdown-trigger) {
    background-color: var(--header-bg-color);
    color: var(--header-text-color);
}

:deep(.css-dev-only-do-not-override-1p3hq3p.ant-btn.ant-btn-default.ant-btn-sm.ant-dropdown-trigger:hover) {
    color: #4096ff
}

:deep(.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child:hover) {
    background-color: #2a2a2a;
}

.add-friend-panel {
    width: 100%;
    height: 450px;
    display: flex;
}

.add-friend-panel-left {
    width: 50%;
    padding: 7px;
}

.add-friend-panel-left-header {
    width: 100%;
    height: 30px;
    /* background-color: red; */
}

.add-friend-panel-left-body {
    width: 100%;
    height: calc(100% - 30px);
    /* background-color: antiquewhite; */
    margin-top: 10px;
    overflow: auto;
}

.add-friend-panel-left-body p {
    background-color: #474e56;
    padding: 0 5px;
    border-radius: 5px;
}

.add-friend-panel-left-body p:hover {
    background-color: #333639;
}

.add-friend-panel-left-body p label {
    width: 100%;
}

.add-friend-panel-left-body p {
    margin-top: 5px;
}

.add-friend-panel-left-body ul {
    width: 100%;
    height: 100%;
}

.add-friend-panel-left-body ul li {
    width: 100%;
    height: 50px;
    background-color: #4096ff;
    margin-top: 5px;
}

:deep(.el-dialog__headerbtn) {
    display: none;
}

.add-friend-panel-right {
    width: 50%;
    /* background-color: #474e56; */
}

.add-friend-panel-right-header {
    height: 30px;
    background-color: red;
}

.add-friend-panel-right-body {
    width: 100%;
    height: calc(90% - 30px);
    /* background-color: #4096ff; */
}

.add-friend-panel-right-body p {
    width: 100%;
    height: 32px;
    background-color: #474e56;
    padding: 0 5px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.delete-checked {
    width: 16px;
    height: 16px;
    line-height: 11px;
    text-align: center;
    border-radius: 50%;
    cursor: default;
}

.delete-checked:hover {
    background-color: red;
}

.add-friend-panel-right-body p:hover {
    background-color: #333639;
}

.add-friend-panel-right-body p:nth-child(n+2) {
    margin-top: 5px;
}

.add-friend-panel-right-footer {
    width: 100%;
    height: 10%;
    padding-right: 10px;
    display: flex;
    justify-content: end;
    align-items: center;
    background-color: antiquewhite;
}
</style>
