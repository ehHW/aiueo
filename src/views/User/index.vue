<template>
    <div class="user-container">
        <el-card :body-style="{
            padding: '16px 16px 0',
            backgroundColor: `var(--my-main-search-bg-color)`,
        }">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="60px">
                <el-form-item style="background-color: var(--my-main-search-bg-color)">
                    <template #label>
                        <span style="color: var(--my-main-search-color)">用户名</span>
                    </template>
                    <el-input v-model="formInline.username" placeholder="请输入用户名" clearable
                        style="background-color: var(--my-main-search-bg-color)"
                        input-style="color: var(--my-main-search-color);" />
                </el-form-item>
                <el-form-item style="background-color: var(--my-main-search-bg-color)">
                    <template #label>
                        <span style="color: var(--my-main-search-color)">手机号</span>
                    </template>
                    <el-input v-model="formInline.phone" placeholder="请输入手机号" clearable
                        input-style="color: var(--my-main-search-color);" />
                </el-form-item>
                <el-form-item label="昵称" v-show="expand">
                    <el-input v-model="formInline.nickname" placeholder="请输入昵称" clearable />
                </el-form-item>
                <el-form-item label="创建于" v-show="expand">
                    <el-date-picker v-model="formInline.date1" type="daterange" range-separator="到"
                        start-placeholder="开始日期" end-placeholder="结束日期" :size="size" />
                </el-form-item>
                <el-form-item label="更新于" v-show="expand">
                    <el-date-picker v-model="formInline.date2" type="daterange" range-separator="到"
                        start-placeholder="开始日期" end-placeholder="结束日期" :size="size" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">
                        <el-icon size="20" style="margin-bottom: 2px">
                            <Search style="margin-right: 4px; color: #fff; font-size: 26px" />
                        </el-icon>
                        查询
                    </el-button>
                    <el-button @click="onReset">重置</el-button>
                    <el-button type="primary" @click="expandSearch">{{ expandText }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{
            backgroundColor: 'var(--my-main-table-bg-color)',
            height: '100%', padding: '15px',
            display: 'flex', flexDirection: 'column',
            borderRadious: '8px',
        }">
            <div class="user-container-header" style="margin-bottom: 16px">
                <el-button type="danger" @click="handleDelete">批量删除</el-button>
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="tableData" :style="{
                width: '100%',
                height: '100%',
                border: 'none',
                '--el-border-color-lighter': 'none',
                borderCollapse: 'collapse',
                background: 'var(--my-main-table-bg-color)',
            }" max-height="100%" :border="true" :header-row-style="{}" :header-cell-style="{
                background: 'var(--my-main-table-head-bg-color)',
                color: 'var(--my-main-table-head-color)',
                border: '0.5px solid var(--my-main-table-head-border-color)',
            }" :cell-style="{
                background: 'var(--my-main-table-cell-bg-color)',
                color: 'var(--my-main-table-cell-color)',
                border: '0.5px solid var(--my-main-table-cell-border-color)',
            }" :row-style="{}">
                <el-table-column fixed type="selection" :selectable="selectable" width="40" />
                <el-table-column prop="user_id" label="编号" width="200" align="center" />
                <el-table-column prop="role_name" label="所属角色" width="200" align="center" />
                <el-table-column prop="avatar" label="头像" width="200" align="center">
                    <template #default="{ row: { avatar } }">
                        <el-image :src="avatar" style="width: 30px; height: 30px; border-radius: 50%" />
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="200" align="center" />
                <el-table-column prop="mobile" label="手机号" width="200" align="center" />
                <el-table-column prop="state" label="登录" width="200" align="center">
                </el-table-column>
                <el-table-column prop="created_at" label="创建于" width="200" align="center" />
                <el-table-column prop="updated_at" label="更新于" width="200" align="center" />
                <el-table-column fixed="right" label="操作" width="240" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="editUser(row)" />
                        <el-button type="success" size="small" @click="handleAssignRole(row)">分配角色</el-button>
                        <el-button type="danger" size="small" @click="deleteRow(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-config-provider :locale="locale">
                <el-pagination v-model:current-page="pagenum" v-model:page-size="pagesize"
                    :page-sizes="[10, 20, 30, 40]" size="default" :background="true"
                    layout="total, sizes, prev, pager, next, jumper" :total="Number(resData!.total)" />
            </el-config-provider>
        </el-card>
    </div>
    <el-dialog v-model="dialogFormVisible" width="800"
        style="padding: 0; background-color: var(--my-main-search-bg-color)">
        <template #header>
            <p style="color: var(--my-main-search-color); padding: 20px 20px 0 20px">用户编辑</p>
        </template>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="70px" class="demo-ruleForm"
            style="padding: 10px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model.number="ruleForm.mobile" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-upload class="avatar-uploader" :on-success="handleAvatarSuccess" :show-file-list="false"
                    :before-upload="beforeAvatarUpload" :http-request="uploadHttpRequest"
                    :on-change="handleAvatarChange">
                    <img v-if="imgPreview" :src="imgPreview" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)"> 立即编辑 </el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog v-model="dialogFormVisibleRole" width="800"
        style="padding: 0; background-color: var(--my-main-search-bg-color)">
        <template #header>
            <p style="color: var(--my-main-search-color); padding: 20px 20px 0 20px">分配角色</p>
        </template>
        <el-form ref="ruleFormRefRole" :model="ruleFormRole" status-icon label-width="70px" class="demo-ruleForm"
            style="padding: 10px 50px 10px 50px">
            <el-form-item label="当前用户" prop="username">
                <el-input v-model="ruleFormRole.username" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="当前角色" prop="role_name">
                <el-input v-model="ruleFormRole.role_name" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="选择角色" prop="role_name">
                <el-select v-model="value" placeholder="Select" style="width: 240px" @change="handleChange">
                    <el-option v-for="item in options" :key="item.role_id" :label="item.role_name"
                        :value="item.role_id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitFormRole(ruleFormRefRole)">
                    立即更新
                </el-button>
                <el-button @click="resetFormRole(ruleFormRefRole)">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import {
    assignRoleApi,
    createUploadApi,
    deleteUserApi,
    getUserListApi,
    updateUserApi,
} from '@/api/user'
import type {
    AssignRoleResponse,
    UpdateUserResponse,
    UserListData,
    UserListResponse,
} from '@/types/user'
import { Edit, Search } from '@element-plus/icons-vue'
import router from '@/router'
import type { Language } from 'element-plus/es/locale'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import type { AxiosResponse } from 'axios'
import type { FormInstance, FormRules, UploadFile, UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { RoleListData, RoleListResponse } from '@/types/role'
import { getRoleListApi } from '@/api/role'
import { useUserStore } from '@/stores/useUser'

const userStore = useUserStore()
const language = ref('zh-cn')
const locale = computed<Language>(() => (language.value === 'zh-cn' ? zhCn : en))
let pagenum = ref(1)
let pagesize = ref(10)

const dialogFormVisible = ref(false)
const ruleForm = reactive({
    user_id: 0,
    username: '',
    password: '',
    mobile: '',
    avatar: '',
})
const ruleFormRef = ref<FormInstance>()
// eslint-disable-next-line
const checkUsername = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (value.length > 10 || value.length < 2) {
        callback(new Error('用户名长度至少为2位，最多10位'))
    } else {
        callback()
    }
}
// eslint-disable-next-line
const checkPhone = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入正确的手机号'))
    } else if (String(value).length !== 11 || !/^1[3-9]\d{9}$/.test(String(value))) {
        callback(new Error('请输入正确的手机号'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<typeof ruleForm>>({
    username: [{ required: true, validator: checkUsername, trigger: 'blur' }],
    password: [{ required: false, trigger: 'blur', min: 2, max: 6 }],
    mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
    avatar: [{ required: false }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            updateUserApi({ ...ruleForm, current_user_id: userStore.userInfo.user_id }).then((res: AxiosResponse<UpdateUserResponse>) => {
                if (res.data.state === 200) {
                    dialogFormVisible.value = false
                    ruleForm.avatar = ''
                    ElMessage.success(res.data.msg)
                    getData(pagenum.value, pagesize.value)
                } else if (res.data.state === 400) {
                    ElMessage.error(res.data.msg)
                }
            })
        } else {
            ElMessage.error('请输入正确的信息')
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const editUser = (row: UserListData) => {
    dialogFormVisible.value = true
    ruleForm.username = row.username
    ruleForm.user_id = row.user_id
    ruleForm.mobile = row.mobile
}

const handleAvatarSuccess: UploadProps['onSuccess'] = () => { }

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像必须是JPG格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('头像大小不能超过10MB!')
        return false
    }
    return true
}

let imgPreview = ref('')
const handleAvatarChange = async (file: UploadFile) => {
    // 创建一个 FormData 对象
    const formData = new FormData()
    // 将文件添加到 FormData 对象中
    formData.append('file', file.raw!, file.name)
    let res = await createUploadApi(formData)
    ruleForm.avatar = res.data.data.database
    imgPreview.value = URL.createObjectURL(file.raw!)
}

const uploadHttpRequest = () => { }

const handleDelete = () => {
    console.log('批量删除')
}
const handleAdd = () => {
    router.push('/user/create')
}

// let tableHeight = ref("100%")
function expandSearch() {
    expand.value = !expand.value
    expandText.value = expand.value ? '收起' : '展开'
    // tableHeight.value = expand.value ? "80%" : "100%"
}

const formInline = reactive({
    username: '',
    date1: '',
    date2: '',
    phone: '',
    nickname: '',
})

const size = ref<'default' | 'large' | 'small'>('default')

const onSubmit = () => {
    getData(pagenum.value, pagesize.value)
}

const onReset = () => {
    formInline.username = ''
    formInline.date1 = ''
    formInline.date2 = ''
    formInline.phone = ''
    formInline.nickname = ''
    getData(pagenum.value, pagesize.value)
}

const expand = ref(false)
let expandText = ref('展开')

const tableData = ref<UserListData[]>([])
let resData = ref<UserListResponse<UserListData[]>>({})
const getData = async (pagenum: number = 1, pagesize: number = 10) => {
    const create_at1 = formInline.date1[0] ? new Date(formInline.date1[0]).getTime() : ''
    const create_at2 = formInline.date1[1] ? new Date(formInline.date1[1]).getTime() : ''
    const update_at1 = formInline.date2[0] ? new Date(formInline.date2[0]).getTime() : ''
    const update_at2 = formInline.date2[1] ? new Date(formInline.date2[1]).getTime() : ''
    let res: AxiosResponse<UserListResponse<UserListData[]>> = await getUserListApi({
        user_id: userStore.userInfo.user_id,
        pagenum,
        pagesize,
        username: formInline.username,
        mobile: formInline.phone,
        role_name: formInline.nickname,
        created_at: create_at1 + '-' + create_at2,
        updated_at: update_at1 + '-' + update_at2,
    })
    tableData.value = res.data.list?.reverse() || []
    resData.value = res.data
}
getData(pagenum.value, pagesize.value)
// setInterval(() => {
//     getData(pagenum.value, pagesize.value)
// }, 5000)

watch(
    () => pagenum.value,
    (newVal) => {
        if (newVal) {
            getData(newVal, pagesize.value)
        }
    },
)

watch(
    () => pagesize.value,
    (newVal) => {
        if (newVal) {
            getData(pagenum.value, newVal)
        }
    },
)

// 是否可选择
const selectable = () => true

const deleteRow = async (row: UserListData) => {
    ElMessageBox.confirm('确定要删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
            await deleteUserApi({ user_id: userStore.userInfo.user_id as number, del_user_id: row.user_id }).then(res => {
                if (res.data.state === 200) {
                    ElMessage({
                        type: 'success',
                        message: res.data.msg,
                    })
                } else if (res.data.state === 400) {
                    ElMessage.error(res.data.msg)
                }
                getData(pagenum.value, pagesize.value)
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

// 分配角色
let ruleFormRole = reactive({
    username: '',
    role_name: '',
    user_id: 0,
    role_id: 0,
})

let dialogFormVisibleRole = ref(false)
const ruleFormRefRole = ref<FormInstance>()
const value = ref('')
let currentRow = ref<UserListData | null>(null)
let options = ref<RoleListData[]>([])
const getRoleData = async (pagenum: number = 1, pagesize: number = 10, role_name: string = '') => {
    let res: AxiosResponse<RoleListResponse<RoleListData[]>> = await getRoleListApi({
        pagenum,
        pagesize,
        role_name,
        user_id: userStore.userInfo.user_id,
    })
    options.value = res.data.list
}
getRoleData()
const handleAssignRole = (row: UserListData) => {
    getRoleData()
    dialogFormVisibleRole.value = true
    ruleFormRole.username = row.username
    ruleFormRole.role_name = row.role_name
    ruleFormRole.user_id = row.user_id
    ruleFormRole.role_id = row.role_id
    value.value = row.role_name
    currentRow.value = row
}
const handleChange = (value: string) => {
    ruleFormRole.role_id = Number(value)
}
const submitFormRole = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            assignRoleApi({ ...ruleFormRole, current_user_id: userStore.userInfo.user_id }).then((res: AxiosResponse<AssignRoleResponse>) => {
                // console.log(res)
                if (res.data.state === 200) {
                    dialogFormVisibleRole.value = false
                    ElMessage.success(res.data.msg)
                    getData(pagenum.value, pagesize.value)
                    getRoleData()
                    value.value = ''
                } else if (res.data.state === 400) {
                    ElMessage.error(res.data.msg)
                }
            })
        }
    })
}
const resetFormRole = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    handleAssignRole(currentRow.value as UserListData)
}
</script>

<style scoped lang="scss">
.el-pagination.el-pagination--default {
    justify-content: center;
    align-items: center;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}

.demo-form-inline .el-input {
    --el-input-width: 220px;
}

.demo-form-inline .el-select {
    --el-select-width: 220px;
}

.demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-date-picker .block:last-child {
    border-right: none;
}

.demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}

.el-form-item {
    margin-right: 32px;
    margin-bottom: 18px;
    vertical-align: middle;
}

.user-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    >.el-card:first-child {
        margin-bottom: 16px;
        padding: 0;
        border: none;
    }

    >.el-card:last-child {
        flex: 1;
        overflow: auto;

        .el-pagination {
            margin-top: 10px;
            --el-pagination-button-bg-color: var(--my-pagination-button-bg-color2);
            --el-pagination-button-color: var(--my-pagination-button-text-color2);
        }
    }
}

.el-card {
    --el-card-border-color: none;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.el-pagination .btn-next) {
    background-color: var(--my-pagination-button-bg-color2);
    color: var(--my-pagination-button-text-color2);
}

:deep(.el-pagination .btn-prev) {
    background-color: var(--my-pagination-button-bg-color2);
    color: var(--my-pagination-button-text-color2);
}

:deep(.el-pagination .btn-next:disabled) {
    background-color: var(--my-pagination-button-bg-color2-disabled);
    color: var(--my-pagination-button-text-color2-disabled);
}

:deep(.el-pagination .btn-prev:disabled) {
    background-color: var(--my-pagination-button-bg-color2-disabled);
    color: var(--my-pagination-button-text-color2-disabled);
}

:deep(div.el-card.is-always-shadow) {
    background-color: var(--my-main-table-bg-color);
}

:deep(div.el-pagination.is-background.el-pagination--default) {
    margin-top: 20px;
}

:deep(.el-pagination .btn-next:disabled) {
    background-color: var(--my-pagination-button-bg-color2);
    color: var(--my-pagination-button-text-color2);
}

:deep(.el-pagination .btn-prev:disabled) {
    background-color: var(--my-pagination-button-bg-color2);
    color: var(--my-pagination-button-text-color2);
}

:deep(.el-select__wrapper.el-tooltip__trigger.el-tooltip__trigger) {
    background-color: var(--my-main-search-bg-color) !important;
}

:deep(.el-input__wrapper) {
    background-color: var(--my-main-search-bg-color) !important;
}

:deep(.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default) {
    max-height: calc(100% - 20px) !important;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
