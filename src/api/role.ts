import type {
    CreateRoleParams,
    CreateRoleResponse,
    RoleListParams,
    RoleListData,
    RoleListResponse,
    UpdateRoleResponse,
    UpdateRoleParams,
    DeleteRoleResponse,
} from '@/types/role'
import instance from '@/utils/requests'

const postHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' }

export const createRoleApi = (data: CreateRoleParams) => {
    return instance.post<CreateRoleResponse>('/user/create_role/', data, {
        headers: postHeaders,
    })
}

export const getRoleListApi = (data: RoleListParams) => {
    return instance.get<RoleListResponse<RoleListData[]>>('/user/role_list/', { params: data })
}

export const updateRoleApi = (data: UpdateRoleParams) => {
    return instance.post<UpdateRoleResponse>('/user/update_role/', data, {
        headers: postHeaders,
    })
}

export const deleteRoleApi = (data: { role_id: number; user_id: number | string }) => {
    return instance.post<DeleteRoleResponse>('/user/delete_role/', data, {
        headers: postHeaders,
    })
}
