interface MenuListData<T> {
    auth_id: number
    auth_name: string
    auth_pid: number
    auth_pname: string
    children: T[]
    component: string
    created_at: string
    icon: string
    keep_alive: number
    path: string
    sort: number
    type: number
    updated_at: string
}

interface MenuListChildren {
    auth_id: number
    auth_name: string
    auth_pid: number
    auth_pname: string
    component: string
    created_at: string
    icon: string
    keep_alive: number
    path: string
    sort: number
    type: number
    updated_at: string
}

interface GetMenuPramas {
    role_id: string | number
}

export type { MenuListData, MenuListChildren, GetMenuPramas }
