interface LoginParams {
    mobile: string
    password: string
}

interface LoginResponse<T> {
    state: number
    data: T
}

interface RefreshTokenResponse {
    state: number
    msg: string
    data: {
        token: string
        expires_in: number
    }
}

interface UserInfo {
    user_id: number | string
    token: string
    mobile: string
    username: string
    role_id: number | string
    role_name: string
    avatar: string
    expires_in: number
}

interface UserListResponse<T> {
    state?: number
    message?: string
    total?: number
    list?: T
}

interface UserListData {
    user_id: number
    username: string
    mobile: string
    avatar: string
    created_at: string
    updated_at: string
    state: number
    role_id: number
    role_name: string
}

interface UserListParams {
    pagenum: number
    pagesize: number
    username: string
    mobile: string
    role_name: string
    created_at: string
    updated_at: string
}

interface CreateUserParams {
    user_id: number | string
    username: string
    password: string
    mobile: string
    avatar?: string
}

interface CreateUserResponse {
    state: number
    msg: string
    data: null
}

interface UpdateUserData {
    user_id: number
    username: string
    password?: string
    mobile?: string
    avatar?: string
    current_user_id: number | string
}

interface UpdateUserResponse {
    state: number
    msg: string
    data: null
}

interface DeleteUserResponse {
    state: number
    msg: string
    data: null
}

interface CreateUploadResponse<T> {
    state: number
    msg: string
    data: T
}

interface CreateUploadData {
    formData: object
}

interface CreateUploadResponseData {
    database: string
    url: string
    preview: string
}

interface AssignRoleParams {
    username: string
    role_name: string
    user_id: number
    role_id: number
    current_user_id: number | string
}

interface AssignRoleResponse {
    state: number
    msg: string
    data: null
}

export type {
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
    CreateUploadData,
    CreateUploadResponse,
    CreateUploadResponseData,
    AssignRoleParams,
    AssignRoleResponse,
    DeleteUserResponse,
    RefreshTokenResponse,
}
