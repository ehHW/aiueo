interface AssignAuthParams {
    role_name: string
    role_id: number
    auth_ids: string
    auth_ids_son: string
    user_id: number | string
}

interface AssignAuthResponse {
    state: number
    msg: string
    data: null
}

export type { AssignAuthParams, AssignAuthResponse }
