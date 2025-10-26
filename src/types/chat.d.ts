interface wsMsg {
    msg: string
}

interface FriendRequestResponse<T> {
    state: number
    msg: string
    data: T
}

interface FriendRequestData {
    sender_avatar: null | string
    sender_id: number
    sender_time: string
    sender_username: string
}

interface FriendListResponse<T> {
    state: number
    msg: string
    data: T
}

interface FriendData {
    avatar: string
    user_id: number
    username: string
}

export {
    wsMsg,
    FriendRequestData,
    FriendRequestResponse,
    FriendListResponse,
    FriendData
}
