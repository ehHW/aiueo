import type { AssignAuthParams, AssignAuthResponse } from '@/types/assign'
import instance from '@/utils/requests'

const postHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' }

export const changeRolePermissionApi = (data: AssignAuthParams) => {
    return instance.post<AssignAuthResponse>('/user/change_role_permission/', data, {
        headers: postHeaders,
    })
}
