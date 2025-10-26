type WSState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

interface ReconnectingWebSocketOptions {
    maxRetries?: number;          // 默认 10
    initialDelay?: number;        // 默认 2000
    maxDelay?: number;            // 默认 30000
    heartbeatInterval?: number;   // 默认 30000，≤0 关闭心跳
    heartbeatTimeout?: number;    // 默认 10000
}
export default class ReconnectingWebSocket {
    private url: string;
    private ws: WebSocket | null = null;
    private forcedClose = false;
    private retries = 0;
    private readonly maxRetries: number;
    private readonly initialDelay: number;
    private readonly maxDelay: number;
    private readonly heartbeatInterval: number;
    private readonly heartbeatTimeout: number;

    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    private pongTimer: ReturnType<typeof setTimeout> | null = null;

    /* ---- 对外事件槽 ---- */
    public onopen: ((ev: Event) => void) | null = null;
    public onclose: ((ev: CloseEvent) => void) | null = null;
    public onmessage: ((ev: MessageEvent<string>) => void) | null = null;
    public onerror: ((ev: Event) => void) | null = null;

    constructor(url: string, opts: ReconnectingWebSocketOptions = {}) {
        this.url = url;
        this.maxRetries = opts.maxRetries ?? 10;
        this.initialDelay = opts.initialDelay ?? 2000;
        this.maxDelay = opts.maxDelay ?? 30000;
        this.heartbeatInterval = opts.heartbeatInterval ?? 30000;
        this.heartbeatTimeout = opts.heartbeatTimeout ?? 10000;
        this._connect();
    }

    /* ----------------- 心跳 ----------------- */
    private startHeartbeat(): void {
        if (this.heartbeatInterval <= 0) return;
        this.heartbeatTimer = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('__ping__');
            this.pongTimer = setTimeout(() => {
            console.warn('[ws] pong timeout -> close & reconnect');
            this.ws?.close();
            }, this.heartbeatTimeout);
        }
        }, this.heartbeatInterval);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer)
            this.heartbeatTimer = null
        }
        if (this.pongTimer) {
            clearTimeout(this.pongTimer)
            this.pongTimer = null
        }
    }

    /* ----------------- 连接 ----------------- */
    private _connect(): void {
        if (this.forcedClose) return;
        this.ws = new WebSocket(this.url);
        const localWs = this.ws; // 捕获当前实例，防止闭包拿到旧 ws

        localWs.onopen = (e) => {
            this.retries = 0;
            this.startHeartbeat();
            this.onopen?.(e);
        };

        localWs.onmessage = (e: MessageEvent<string>) => {
            if (e.data === '__pong__') {
                if (this.pongTimer) {
                    clearTimeout(this.pongTimer)
                    this.pongTimer = null
                }
                return;
            }
            this.onmessage?.(e);
        };

        localWs.onclose = (e) => {
        this.stopHeartbeat();
        this.onclose?.(e);
        if (this.forcedClose) return;
            const delay = Math.min(this.initialDelay * 1.5 ** this.retries, this.maxDelay);
            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null;
                if (++this.retries <= this.maxRetries) this._connect();
                else console.error('[ws] max retries reached');
            }, delay);
        };

        localWs.onerror = (e) => {
            this.onerror?.(e);
            localWs.close();
        };
    }

    /* ----------------- 公共 API ----------------- */
    public get readyState(): WSState {
        return this.ws
        ? ((['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'] as const)[this.ws.readyState] as WSState)
        : 'CLOSED';
    }

    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(data);
        else console.warn('[ws] send while closed');
    }

    public close(code = 1000, reason?: string): void {
        this.forcedClose = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
        this.stopHeartbeat();
        this.ws?.close(code, reason);
    }
}

