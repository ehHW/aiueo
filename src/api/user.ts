import type {
    LoginParams,
    LoginResponse,
    UserInfo,
    UserListResponse,
    UserListData,
    UserListParams,
    CreateUserParams,
    CreateUserResponse,
    UpdateUserData,
    UpdateUserResponse,
    CreateUploadResponse,
    CreateUploadResponseData,
    AssignRoleParams,
    AssignRoleResponse,
    DeleteUserResponse,
    RefreshTokenResponse,
} from '@/types/user'
import instance from '@/utils/requests'

export const loginApi = (data: LoginParams) => {
    return instance.post<LoginResponse<UserInfo>>('/user/login/', data)
}

export const refreshTokenApi = () => {
    return instance.post<RefreshTokenResponse>('/user/refresh_token/')
}

export const getUserListApi = (data: UserListParams) => {
    return instance.get<UserListResponse<UserListData[]>>('/user/user_list/', {
        params: data,
    })
}

export const createUserApi = (data: CreateUserParams) => {
    return instance.post<CreateUserResponse>('/user/create_user/', data)
}

export const createUploadApi = (data: FormData) => {
    return instance.post<CreateUploadResponse<CreateUploadResponseData>>('/upload/create/', data)
}

export const deleteUserApi = (data: { user_id: number; del_user_id: number }) => {
    return instance.post<DeleteUserResponse>('/user/delete_user/', data)
}

export const updateUserApi = (data: UpdateUserData) => {
    return instance.post<UpdateUserResponse>('/user/update_user/', data)
}

export const assignRoleApi = (data: AssignRoleParams) => {
    return instance.post<AssignRoleResponse>('/user/change_user_role/', data)
}

export const logoutApi = () => {
    return instance.post('/user/logout/')
}
