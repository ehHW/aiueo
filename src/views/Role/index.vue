<template>
    <div class="user-container">
        <el-card :body-style="{
            padding: '16px 16px 0',
            backgroundColor: `var(--my-main-search-bg-color)`,
        }">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="70px">
                <el-form-item style="background-color: var(--my-main-search-bg-color)">
                    <template #label>
                        <span style="color: var(--my-main-search-color)">角色名称</span>
                    </template>
                    <el-input v-model="formInline.role_name" placeholder="请输入角色名称" clearable
                        style="background-color: var(--my-main-search-bg-color)"
                        input-style="background-color: var(--my-main-search-bg-color); color: var(--my-main-search-color);" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">
                        <el-icon size="20" style="margin-bottom: 2px">
                            <Search style="margin-right: 4px; color: #fff; font-size: 26px" />
                        </el-icon>
                        查询
                    </el-button>
                    <el-button @click="onReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
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
            }" :max-height="tableHeight" :border="true" :header-row-style="{}" :header-cell-style="{
                background: 'var(--my-main-table-head-bg-color)',
                color: 'var(--my-main-table-head-color)',
                border: '0.5px solid var(--my-main-table-head-border-color)',
            }" :cell-style="{
                background: 'var(--my-main-table-cell-bg-color)',
                color: 'var(--my-main-table-cell-color)',
                border: '0.5px solid var(--my-main-table-cell-border-color)',
            }" :row-style="{}">
                <el-table-column fixed type="selection" :selectable="selectable" width="40" />
                <el-table-column prop="role_id" label="角色编号" width="200" align="center" />
                <el-table-column prop="role_name" label="角色名称" width="200" align="center" />
                <el-table-column prop="role_desc" label="角色描述" width="200" align="center" />
                <el-table-column prop="created_at" label="创建于" width="200" align="center" />
                <el-table-column prop="updated_at" label="更新于" width="200" align="center" />
                <el-table-column fixed="right" label="操作" width="240" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" :icon="Edit" @click="editRole(row)" />
                        <el-button type="success" size="small" @click="handleAuth(row)">分配权限</el-button>
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

            <el-dialog v-model="dialogFormVisible" width="800"
                style="height: 300px; padding: 0; background-color: var(--my-main-search-bg-color)">
                <template #header>
                    <p style="color: var(--my-main-search-color); padding: 20px 20px 0 20px">
                        角色编辑
                    </p>
                </template>
                <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px"
                    class="demo-ruleForm" style="
                        width: 100%;
                        height: 100%;
                        padding: 30px 20px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;
                    ">
                    <el-form-item prop="role_name" style="background-color: var(--my-main-search-bg-color)">
                        <template #label>
                            <span style="color: var(--my-main-search-color)">角色名称</span>
                        </template>
                        <el-input v-model="ruleForm.role_name" autocomplete="off"
                            input-style="background-color: var(--my-main-search-bg-color); color: var(--my-main-search-color);" />
                    </el-form-item>
                    <el-form-item prop="role_desc" style="background-color: var(--my-main-search-bg-color)">
                        <template #label>
                            <span style="color: var(--my-main-search-color)">角色描述</span>
                        </template>
                        <el-input v-model="ruleForm.role_desc" autocomplete="off"
                            input-style="background-color: var(--my-main-search-bg-color); color: var(--my-main-search-color);" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)">
                            立即编辑
                        </el-button>
                        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-card>
    </div>
    <el-drawer v-model="visible" :show-close="false" style="background-color: var(--my-main-search-bg-color)"
        v-if="visible" @closed="handleClose" size="25%">
        <template #header="{ close, titleId, titleClass }">
            <h4 :id="titleId" :class="titleClass">分配权限</h4>
            <el-button type="default" @click="close" style="border: none" ref="closeButton">
                <el-icon size="20">
                    <Close />
                </el-icon>
            </el-button>
        </template>
        <el-tree ref="treeRef" style="max-width: 600px" :data="menuList" :props="defaultProps" show-checkbox
            node-key="auth_id" :default-checked-keys="[...defaultCheckedKeys]" @check="handleCheck" />
        <el-button type="primary" @click="assignPermission">分配权限</el-button>
        <el-button type="default" @click="cancelAssignAuth">取消</el-button>
    </el-drawer>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUser'
const userStore = useUserStore()
const menuList = userStore.menuList

const defaultProps = {
    label: 'auth_name',
    children: 'children',
}

let defaultCheckedKeys = ref<string[]>([])
const visible = ref(false)
let closeButton = ref()
const assignAuthParams = reactive<AssignAuthParams>({
    role_name: '',
    role_id: 0,
    auth_ids: '',
    auth_ids_son: '',
    user_id: userStore.userInfo.user_id
})

/* eslint-disable */
const handleCheck = (data: any, node: any) => {
    assignAuthParams.auth_ids = node.checkedNodes
        .filter((item: any) => item.auth_pid === 0)
        .map((item: any) => item.auth_id)
        .join(',')
    assignAuthParams.auth_ids_son = node.checkedNodes
        .filter((item: any) => item.auth_pid !== 0)
        .map((item: any) => item.auth_id)
        .join(',')
}
/* eslint-enable */
const handleAuth = (row: RoleListData) => {
    visible.value = true
    defaultCheckedKeys.value = row.auth_ids_son.split(',')
    assignAuthParams.role_id = row.role_id
    assignAuthParams.role_name = row.role_name
}

const assignPermission = () => {
    if (assignAuthParams.auth_ids === '' && assignAuthParams.auth_ids_son === '') {
        assignAuthParams.auth_ids = "1,2"
        assignAuthParams.auth_ids_son = "101,102,203,204,205"
    }

    changeRolePermissionApi(assignAuthParams).then((res: AxiosResponse<AssignAuthResponse>) => {
        if (res.data.state === 200) {
            ElMessage.success(res.data.msg)
            getData(pagenum.value, pagesize.value)
            cancelAssignAuth()
        } else {
            ElMessage.error(res.data.msg)
            // console.log(assignAuthParams)
        }
    })
}

const cancelAssignAuth = () => {
    closeButton.value.ref.click()
}

const handleClose = () => {
    defaultCheckedKeys.value = []
    assignAuthParams.role_id = 0
    assignAuthParams.role_name = ''
    assignAuthParams.auth_ids = ''
    assignAuthParams.auth_ids_son = ''
    visible.value = false
}

import { reactive, ref, computed, watch } from 'vue'
import { Edit, Search } from '@element-plus/icons-vue'
import router from '@/router'
import type { Language } from 'element-plus/es/locale'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import type { AxiosResponse } from 'axios'
import type { RoleListData, RoleListResponse, UpdateRoleResponse } from '@/types/role'
import { deleteRoleApi, getRoleListApi, updateRoleApi } from '@/api/role'
import type { FormInstance, FormRules } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { changeRolePermissionApi } from '@/api/assign'
import type { AssignAuthParams, AssignAuthResponse } from '@/types/assign'

const language = ref('zh-cn')
const locale = computed<Language>(() => (language.value === 'zh-cn' ? zhCn : en))
let pagenum = ref(1)
let pagesize = ref(10)
const dialogFormVisible = ref(false)
const ruleForm = reactive({
    role_id: 0,
    role_name: '',
    role_desc: '',
})
const ruleFormRef = ref<FormInstance>()
// eslint-disable-next-line
const checkRoleName = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入角色名称'))
    } else if (value.length > 6 || value.length < 2) {
        callback(new Error('角色名称长度至少为2位，最多6位'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<typeof ruleForm>>({
    role_name: [{ required: true, validator: checkRoleName, trigger: 'blur' }],
    role_desc: [{ required: false, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            updateRoleApi({ ...ruleForm, user_id: userStore.userInfo.user_id }).then((res: AxiosResponse<UpdateRoleResponse>) => {
                if (res.data.state === 200) {
                    ElMessage.success(res.data.msg)
                    dialogFormVisible.value = false
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

const editRole = (row: RoleListData) => {
    dialogFormVisible.value = true
    ruleForm.role_id = row.role_id
    ruleForm.role_name = row.role_name
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const handleDelete = () => {
    console.log('批量删除')
}
const handleAdd = () => {
    router.push('/role/create')
}

let tableHeight = ref(341)

const formInline = reactive({
    role_name: '',
})

const onSubmit = () => {
    getData(pagenum.value, pagesize.value, formInline.role_name)
}

const onReset = () => {
    formInline.role_name = ''
    getData(pagenum.value, pagesize.value, formInline.role_name)
}

const tableData = ref<RoleListData[]>([])
let resData = ref<RoleListResponse<RoleListData[]>>({
    state: 0,
    msg: '',
    list: [],
    total: 0,
})
const getData = async (pagenum: number = 1, pagesize: number = 10, role_name: string = '') => {
    let res: AxiosResponse<RoleListResponse<RoleListData[]>> = await getRoleListApi({
        pagenum,
        pagesize,
        role_name,
        user_id: userStore.userInfo.user_id
    })
    tableData.value = res.data.list || []
    resData.value = res.data
    // console.log(tableData.value);

}
getData(pagenum.value, pagesize.value, formInline.role_name)
// setInterval(() => {
//     getData(pagenum.value, pagesize.value, formInline.role_name)
// }, 5000)

watch(
    () => pagenum.value,
    (newVal) => {
        if (newVal) {
            getData(newVal, pagesize.value, formInline.role_name)
        }
    },
)

watch(
    () => pagesize.value,
    (newVal) => {
        if (newVal) {
            getData(pagenum.value, newVal, formInline.role_name)
        }
    },
)

// 是否可选择
const selectable = () => true

const deleteRow = async (row: RoleListData) => {
    let role_id = row.role_id
    ElMessageBox.confirm('确定要删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(async () => {
            await deleteRoleApi({ role_id, user_id: userStore.userInfo.user_id }).then(res => {
                if (res.data.state === 200) {
                    ElMessage.success(res.data.msg)
                } else {
                    ElMessage.error(res.data.msg)
                }
            })
            getData(pagenum.value, pagesize.value, formInline.role_name)
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
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
        background-color: var(--my-main-table-bg-color);

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

.el-tree {
    --el-tree-node-hover-bg-color: none;
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

:deep(.el-tree-node) {
    background-color: var(--my-main-search-bg-color) !important;
}

:deep(.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default) {
    max-height: calc(100% - 20px) !important;
}

</style>
