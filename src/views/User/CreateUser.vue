<template>
    <div class="create-user">
        <div class="create-user-title">
            <span>用户创建</span>
            <el-button type="primary" @click="router.push('/user')" size="default">返回</el-button>
        </div>
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="70px"
            class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
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
                <el-button type="primary" @click="submitForm(ruleFormRef)"> 立即创建 </el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { createUploadApi, createUserApi } from '@/api/user'
import type { CreateUserResponse } from '@/types/user'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/useUser'

const router = useRouter()
const userStore = useUserStore()
const ruleFormRef = ref<FormInstance>()

// eslint-disable-next-line
const checkUsername = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (value.length > 6 || value.length < 2) {
        callback(new Error('用户名长度至少为2位，最多6位'))
    } else {
        callback()
    }
}
// eslint-disable-next-line
const checkPassword = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
    } else {
        callback()
    }
}
// eslint-disable-next-line
const checkPhone = (rule: any, value: number, callback: any) => {
    if (String(value) === '') {
        callback()
    } else if (`${value}`.length !== 11 || !/^1[3-9]\d{9}$/.test(String(value))) {
        callback(new Error('请输入正确的手机号'))
    } else {
        callback()
    }
}

const ruleForm = reactive({
    username: '',
    password: '',
    mobile: '',
    avatar: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
    username: [{ required: true, validator: checkUsername, trigger: 'blur' }],
    password: [{ required: true, validator: checkPassword, trigger: 'blur' }],
    mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
    avatar: [{ required: false }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            createUserApi({ ...ruleForm, user_id: userStore.userInfo.user_id as number }).then((res: AxiosResponse<CreateUserResponse>) => {
                if (res.data.state === 200) {
                    ElMessage.success(res.data.msg)
                    ruleForm.avatar = ''
                    router.push('/user')
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
