interface CreateRoleParams {
    user_id: number | string
    role_name: string
    role_desc?: string
}

interface CreateRoleResponse {
    state: number
    msg: string
    data: null
}

interface RoleListParams {
    pagenum: number
    pagesize: number
    role_name: string
    user_id: number | string
}

interface RoleListData {
    action_list: string
    auth_ids: string
    auth_ids_son: string
    created_at: string
    role_desc: string
    role_id: number
    role_name: string
    updated_at: string
}

interface DeleteRoleResponse {
    state: number
    msg: string
    data: null
}

interface RoleListResponse<T> {
    state: number
    msg: string
    list: T
    total: number
}

interface UpdateRoleParams {
    user_id: number | string
    role_id: number
    role_name: string
    role_desc?: string
}

interface UpdateRoleResponse {
    state: number
    msg: string
    data: null
}

export type {
    CreateRoleParams,
    CreateRoleResponse,
    RoleListParams,
    RoleListData,
    RoleListResponse,
    UpdateRoleParams,
    UpdateRoleResponse,
    DeleteRoleResponse,
}
