<template>
    <div class="conversation-header">
        <!-- 下拉框 - 搜索会话 -->
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
        <!-- 下拉菜单 - 加好友/建群 -->
        <template v-for="(placement) in placements" :key="placement">
            <a-dropdown :placement="placement">
                <a-button size="small">+</a-button>
                <template #overlay>
                    <a-menu style="background-color: var(--layout-content-bg-color)">
                        <a-menu-item>
                            <span @click="addFriendDialogVisible = true" style="color: var(--header-text-color);">
                                添加好友
                            </span>
                        </a-menu-item>
                        <a-menu-item>
                            <span @click="{
                                createGroupDialogVisible = true;
                                selfData = initUserList.find(item => item.user_id === userStore.userInfo.user_id)
                                groupCheckedList = [selfData as UserListData]
                                }" style="color: var(--header-text-color);">
                                创建群聊
                            </span>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </template>
        <!-- 加好友 -->
        <el-dialog
            v-model="addFriendDialogVisible"
            title=""
            width="500"
            align-center
            style="padding: 5px; background-color: var(--layout-content-bg-color)"
            @closed="checkList = []"
        >
            <div class="add-friend-panel">
                <div class="add-friend-panel-left">
                    <div class="add-friend-panel-left-header">
                        <el-input v-model="addFriendPanelLeftValue"></el-input>
                    </div>
                    <div class="add-friend-panel-left-body">
                        <el-checkbox-group v-model="checkList">
                            <p v-for="userItem in userList" :key="userItem.user_id">
                                <el-checkbox :label="userItem.username" :value="userItem" />
                            </p>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="add-friend-panel-right">
                    <div class="add-friend-panel-right-header">
                        <div class="add-friend-panel-right-header-title">
                            添加好友
                        </div>
                        <div class="add-friend-panel-right-header-checkedNum">
                            已选{{ checkList.length }}个联系人
                        </div>
                    </div>
                    <div class="add-friend-panel-right-body">
                        <p v-for="item in checkList" :key="item.user_id">
                            <span>{{ item.username }}</span>
                            <span class="delete-checked" @click="checkList = checkList.filter((userItem) => userItem !== item)">x</span>
                        </p>
                    </div>
                    <div class="add-friend-panel-right-footer">
                        <el-button type="primary" @click="{
                            addFriendDialogVisible = false;
                            checkList.forEach(checkedUser => addFriend(checkedUser.user_id));
                            checkList = []
                            }">
                            确认
                        </el-button>
                        <el-button @click="addFriendDialogVisible = false">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 建群 -->
        <el-dialog
            v-model="createGroupDialogVisible"
            title=""
            width="500"
            align-center
            style="padding: 5px; background-color: var(--layout-content-bg-color)"
            @closed="groupCheckedList = []"
        >
            <div class="add-friend-panel">
                <div class="add-friend-panel-left">
                    <div class="add-friend-panel-left-header">
                        <el-input v-model="addFriendPanelLeftValue"></el-input>
                    </div>
                    <div class="add-friend-panel-left-body">
                        <el-checkbox-group v-model="groupCheckedList">
                            <p v-for="userItem in userList" :key="userItem.user_id">
                                <el-checkbox
                                :label="userItem.username"
                                :value="userItem"
                                :disabled="userItem.user_id === userStore.userInfo.user_id"/>
                            </p>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="add-friend-panel-right">
                    <div class="add-friend-panel-right-header">
                        <div class="add-friend-panel-right-header-title">创建群聊</div>
                        <div class="add-friend-panel-right-header-checkedNum">
                            已选{{ groupCheckedList.length }}个联系人
                        </div>
                    </div>
                    <div class="add-friend-panel-right-body">
                        <p v-for="item in groupCheckedList" :key="item.user_id" v-show="item.user_id !== userStore.userInfo.user_id">
                            <span>{{ item.username }}</span>
                            <span class="delete-checked"
                            @click="groupCheckedList = groupCheckedList.filter((userItem) => userItem !== item)"
                            >x</span>
                        </p>
                    </div>
                    <div class="add-friend-panel-right-footer">
                        <el-button type="primary" @click="{
                            createGroupDialogVisible = false;
                            createGroup(groupCheckedList)
                            groupCheckedList = []
                            }" :disabled="groupCheckedList.length < 2">
                            确认
                        </el-button>
                        <el-button @click="createGroupDialogVisible = false">取消</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    addFriendApi,
    createGroupApi,
} from '@/api/friend';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { DropdownProps } from 'ant-design-vue';
import { getUserListApi } from '@/api/user';
import type { UserListData, UserListResponse } from '@/types/user';
import type { AxiosResponse } from 'axios';
import { useUserStore } from '@/stores/useUser';
import { useSessionStore } from '@/stores/useSession';
const sessionStore = useSessionStore();
const placements = ['bottomLeft'] as DropdownProps['placement'][];

const addFriendDialogVisible = ref(false)
const createGroupDialogVisible = ref(false)


/* 下拉框 - 搜索会话 */
const searchValue = ref<string>('')
const searchDropDown = ref(false)
const searchInputRef  = ref()
const searchDropDownRef = ref<HTMLElement>()
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


// 加好友/建群 - 用户列表
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

const userStore = useUserStore();
const selfData = ref<UserListData>();
const groupCheckedList = ref<UserListData[]>([]);
const createGroup = (checkedList: UserListData[]) => {
    createGroupApi({
        name: JSON.stringify(checkedList.map(item => item.username)),
        member_ids: JSON.stringify(checkedList.map(item => item.user_id))
    }).then(() => {
        sessionStore.getSessionList()
    })
}
</script>

<style scoped>
.conversation-header {
    width: 100%;
    height: 50px;
    background-color: var(--layout-content-bg-color);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.convsersation-search-input {
    width: 70% !important;
    height: 50%;
    background-color: var(--layout-content-bg-color) !important;
}

.search-drop-down {
    width: 250px;
    height: 200px;
    position: absolute;
    left: 65px;
    top: 6%;
    /* background-color: aquamarine; */
    border-radius: 5px;
    padding: 5px;
    z-index: 2;
}

:deep(.el-input__wrapper) {
    background-color: var(--layout-content-bg-color) !important;
}

:deep(.convsersation-search-input .el-input__inner) {
    height: 100% !important;
}

.conversation-header > button {
    background-color: var(--layout-content-bg-color);
    color: var(--header-text-color);
}

.conversation-header > button:hover {
    color: #4096ff
}

:deep(.ant-dropdown-menu-item.ant-dropdown-menu-item-only-child:hover) {
    background-color: var(--chat-conv-header-dropdown-hover-color);
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
    /* background-color: red; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    color: var(--header-text-color);
    font-size: 14px;
    position: relative;
}

.add-friend-panel-right-header::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.5px;
    background-color: var(--header-text-color);
    left: 0;
    bottom: -5px;

}

.add-friend-panel-right-body {
    width: 100%;
    height: calc(90% - 30px);
    overflow: auto;
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
    /* background-color: antiquewhite; */
}

:deep(div.add-friend-panel-right > div.add-friend-panel-right-footer > button:nth-child(2)) {
    --el-button-text-color: rgb(91 91 91)
}
</style>
