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

interface GetOrCreatePrivateParams {
    target_id: number
}

interface GetOrCreatePrivateResponse {
    state: number
    msg: string
    data: GetOrCreatePrivateResponseData
}

interface GetOrCreatePrivateResponseData {
    conversation_id: number
}

interface GetSessionListResponse {
    state: number
    msg: string
    data: SessionData[]
}

interface SessionData {
    created_at: number
    id: number
    last_msg_id: number | null
    last_time: number | null
    title: string
    type: "private" | "group"
    unread: number
}

interface CreateGroupParams {
    name: string
    member_ids: string
}

interface CreateGroupResponse {
    data: CreateGroupResponseData,
    msg: string
    state: number
}

interface CreateGroupResponseData {
    conversation_id: number
}

interface GetMessageListParams {
    conversation_id: number
    last_msg_id?: number
    limit: number
}

interface GetMessageListResponse {
    state: number
    msg: string
    data: Message[]
}

interface Message {
    id: number
    content: string
    sender_id: number
    sender_username: string
    parent_id: number
    is_recalled: boolean
    timestamp: number
}

export {
    wsMsg,
    FriendRequestData,
    FriendRequestResponse,
    FriendListResponse,
    FriendData,
    GetOrCreatePrivateParams,
    GetOrCreatePrivateResponse,
    GetSessionListResponse,
    SessionData,
    CreateGroupParams,
    CreateGroupResponse,
    GetMessageListParams,
    GetMessageListResponse,
    Message
}
