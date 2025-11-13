import type {
    CreateGroupParams,
    CreateGroupResponse,
    FriendData,
    FriendListResponse,
    FriendRequestData,
    FriendRequestResponse,
    GetMessageListParams,
    GetMessageListResponse,
    GetOrCreatePrivateParams,
    GetOrCreatePrivateResponse,
    GetSessionListResponse,
} from '@/types/chat'
import instance from '@/utils/requests'

export const getFriendListApi = () => {
    return instance.get<FriendListResponse<FriendData[]>>('/chat/friends/')
}

export const addFriendApi = (receiver_id: number) => {
    return instance.post('/chat/friends/request/add/', {
        'receiver_id': receiver_id
    })
}

export const handleFriendRequestApi = (action: 'accept' | 'decline', sender_id: number) => {
    return instance.post('/chat/friends/request/handle/', {
        'action': action,
        'sender_id': sender_id
    })
}

export const getFriendRequestListApi = (type: 'in' | 'out' | 'all' = 'all') => {
    return instance.get<FriendRequestResponse<FriendRequestData[]>>('/chat/friends/request/list/', {
        params: {
            type
        }
    })
}

export const getSessionListApi = () => {
    return instance.get<GetSessionListResponse>('/chat/conversations/')
}

export const getOrCreatePrivateApi = (data: GetOrCreatePrivateParams) => {
    return instance.post<GetOrCreatePrivateResponse>('/chat/conversations/private/', data)
}

export const createGroupApi = (data: CreateGroupParams) => {
    return instance.post<CreateGroupResponse>('/chat/conversations/group/', data)
}

export const getMessageListApi = (data: GetMessageListParams) => {
    return instance.get<GetMessageListResponse>('/chat/messages/', {
        params: data
    })
}

export const delFriendOrQuitGroupApi = (conv_id: number) => {
    return instance.delete(`/chat/friends/request/del/${conv_id}/`)
}

export const changeGroupNameApi = (conv_id: number, name: string) => {
    return instance.post(`/chat/conversations/change_group_name/${conv_id}/`, {name})
}

export const isGroupCreatorApi = (conv_id: number) => {
    return instance.post(`/chat/conversations/is_group_creator/${conv_id}/`)
}

export const delGroupApi = (conv_id: number) => {
    return instance.delete(`/chat/conversations/del/${conv_id}/`)
}
