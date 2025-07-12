<template>
    <div class="login">
        <div class="login-container">
            <div class="left">
                <img src="@/assets/img/miao.png" alt="" />
            </div>
            <div class="right">
                <div class="right-box">
                    <div class="logo">
                        <!-- <img src="@/assets/img/miao.png" alt="" /> -->
                    </div>
                    <el-form :model="form" :rules="rules" ref="formRef">
                        <el-form-item prop="username">
                            <el-input v-model="form.mobile" :prefix-icon="User" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="form.password" :prefix-icon="Lock" show-password />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm(formRef)">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/useUser';

const userStore = useUserStore()

interface RuleForm {
    mobile: string
    password: string
}

let form = reactive({
    mobile: '13409830827',
    password: '888888',
})

const formRef = ref<FormInstance>()

const rules = reactive<FormRules<RuleForm>>({
    mobile: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度为2到10位', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码长度为6到16位', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            userStore.login({
                mobile: form.mobile,
                password: form.password,
            })
        } else {
            console.log('error submit!')
        }
    })
}
</script>

<style scoped lang="scss">
.login {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #dfdfdf;
}

.login-container {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: flex;
}

.left {
    width: 50%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
    }
}

.right {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .right-box {
        width: 60%;
        height: 50%;
        border-radius: 10px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .el-form {
            width: 80%;
            margin-top: 20px;
        }

        button {
            width: 100%;
        }
    }
}
</style>
