function createWebSocket(): WebSocket {
    const roomName = "testroom";
    const url = "ws://127.0.0.1:8000/chat/channel/" + roomName + '/'
    return new WebSocket(url);
}

export default createWebSocket();
