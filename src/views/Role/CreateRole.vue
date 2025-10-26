<template>
    <div class="create-user">
        <div class="create-user-title">
            <span>角色创建</span>
            <el-button type="primary" @click="router.push('/role')" size="default">返回</el-button>
        </div>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="80px"
            class="demo-ruleForm">
            <el-form-item label="角色名称" prop="role_name">
                <el-input v-model="ruleForm.role_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色描述" prop="role_desc">
                <el-input v-model="ruleForm.role_desc" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)"> 立即创建 </el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

import { createRoleApi } from '@/api/role'
import type { CreateRoleResponse } from '@/types/role'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/useUser'

const userStore = useUserStore()
const router = useRouter()

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

const ruleForm = reactive({
    role_name: '',
    role_desc: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
    role_name: [{ required: true, validator: checkRoleName, trigger: 'blur' }],
    role_desc: [{ required: false, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            createRoleApi({ ...ruleForm, user_id: userStore.userInfo.user_id }).then((res: AxiosResponse<CreateRoleResponse>) => {
                if (res.data.state === 200) {
                    ElMessage.success(res.data.msg)
                    router.push('/role')
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
</script>

<style scoped>
.create-user {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--my-main-search-bg-color);
    border-radius: 10px;
}

.create-user-title {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--my-main-table-cell-border-color);
}

.create-user-title span {
    color: var(--my-main-search-color);
}

.el-form {
    flex: 1;
    padding: 20px;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.el-input__wrapper) {
    background-color: var(--my-main-search-bg-color) !important;
}

:deep(.el-form-item__content button:nth-child(2)) {
    --el-button-text-color: rgb(91 91 91)
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
