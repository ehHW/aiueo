import { defineStore } from 'pinia'

import { getMessageListApi } from '@/api/friend';
import type { MessageItem, MsgCache, WSReadReceiptData } from '@/types/chat';
import { reactive } from 'vue';
import { useUserStore } from './useUser';


export const useMessageStore = defineStore(
    'message',
    () => {
        const cache = reactive(new Map<number, MsgCache>())
        /* 获取或创建缓存壳子 */
        const ensureCache = (convId: number): MsgCache => {
            if (!cache.has(convId)) {
                cache.set(convId, {
                    list: [],
                    newestId: null,
                    oldestId: null,
                    noMore: false,
                    pulling: false
                })
            }
            return cache.get(convId)!
        }
        /* 首次进入会话：拉最新 limit 条 */
        const pullLatest = async (convId: number, limit = 50) => {
            const node = ensureCache(convId)
            // if (node.list.length) return
            if (node.pulling) return
            node.pulling = true
            try {
                const res = await getMessageListApi({ conv_id: convId, limit })
                if (res.data.state === 200) {
                    const arr = res.data.data as MessageItem[]
                    node.list = arr
                    node.oldestId = arr[0]?.id ?? null
                    node.newestId = arr[arr.length - 1]?.id ?? null
                    node.noMore = arr.length < limit
                }
            } finally {
                node.pulling = false
            }
        }
        /* 上拉加载历史 */
        const pullHistory = async (convId: number, limit = 50) => {
            const node = ensureCache(convId)
            if (node.noMore || node.pulling) return
            const lastMsgId = node.oldestId! - 1   // 后端 id<last_msg_id
            node.pulling = true
            try {
                const res = await getMessageListApi({ conv_id: convId, last_msg_id: lastMsgId, limit })
                if (res.data.state === 200) {
                    const arr = res.data.data as MessageItem[]
                    console.log(arr);
                    node.list.unshift(...arr)
                    node.oldestId = arr[0]?.id ?? node.oldestId
                    node.noMore = arr.length < limit
                }
            } finally {
                node.pulling = false
            }
        }
        /* 设置消息已读 */
        const userStore = useUserStore()
        const updateReadReceipt = (data: WSReadReceiptData) => {
            const node = ensureCache(data.conv_id)
            const msg = node.list.find(msg => msg.id === data.msg_id)
            if (msg) {
                msg.is_read_by_other = true
                msg.readers.push({
                    user_id: userStore.userInfo.user_id,
                    username: userStore.userInfo.username,
                })
            }
        }
        /* 清空某个会话（退出群/被踢） */
        const dropCache = (convId: number) => cache.delete(convId)

        return {
            cache,
            ensureCache,
            pullLatest,
            pullHistory,
            dropCache,
            updateReadReceipt
        }
    },
    {
        persist: true,
    },
)
