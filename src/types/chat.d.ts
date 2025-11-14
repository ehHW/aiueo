interface wsMsg {
    msg: string
}

interface FriendRequestResponse<T> {
    state: number
    msg: string
    data: T
}

interface FriendRequestData {
    avatar: null | string
    user_id: number
    username: string
    status: "pending" | "accepted" | "declined"
    created_at: string
    direction: "in" | "out"
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
    dissolved: boolean
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
    conv_id?: number
    content: string
    sender_id: number
    sender_username: string
    parent_id: number
    is_recalled: boolean
    timestamp: number
}

interface SessionMessageItem {
    conv_id: number
    noMore: boolean
    msgList: Message[]
}

interface MessageItem {
    id: number
    sender_id: number
    sender_username: string
    content: string
    timestamp: number
    is_recalled: boolean
    parent_id: number
}

interface MsgCache {
    list: MessageItem[]          // 已缓存的消息（始终按时间升序）
    oldestId: number | null      // 当前已加载的最旧一条 id（用于再上拉）
    newestId: number | null      // 当前已加载的最新一条 id（用于接收 socket 新消息去重）
    noMore: boolean              // 已经到头（没有更旧的了）
    pulling: boolean
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
    Message,
    SessionMessageItem,
    MessageItem,
    MsgCache
}
