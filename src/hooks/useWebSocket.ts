// # ---------------------------------socketio-client------------------------------------
// import { io } from "socket.io-client";
// const socket = io('http://localhost:8000', {
//     path: '/socket.io/',
//     transports: ['websocket']
// });
// socket.on("connect", () => {
//     console.log("连接成功");
// });

// socket.on("disconnect", () => {
//     console.log("连接断开");
// });

// const sendMessage = (msg: string) => {
//     socket.emit("chat_msg", { msg });
// }

// socket.on("chat_msg", (msg: string) => {
//     msgList.value.push(msg);
// });


// import socket from "@/utils/webSocket";
// const socket = new WebSocket("ws://127.0.0.1:8000/chat/channel/");
// 1）binaryType：使用二进制的数据类型连接；
// 2）bufferedAmount（只读）：未发送至服务器的字节数；
// 3）extensions（只读）：服务器选择的扩展；
// 4）onclose：用于指定连接关闭后的回调函数；
// 5）onerror：用于指定连接失败后的回调函数；
// 6）onmessage：用于指定当从服务器接受到信息时的回调函数；
// 7）onopen：用于指定连接成功后的回调函数；
// 8）protocol（只读）：用于返回服务器端选中的子协议的名字；
// 9）readyState（只读）：返回当前 WebSocket 的连接状态，共有 4 种状态：
//     - CONNECTING — 正在连接中，对应的值为 0；
//     - OPEN — 已经连接并且可以通讯，对应的值为 1；
//     - CLOSING — 连接正在关闭，对应的值为 2；
//     - CLOSED — 连接已关闭或者没有连接成功，对应的值为 3
// 10）url（只读）：返回值为当构造函数创建 WebSocket 实例对象时 URL 的绝对路径。

// socket.onopen = () => {
//     console.log("连接成功");
// }

// socket.onclose = () => {
//     console.log("连接断开");
// }

// socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     console.log("收到消息", data);
// }

// socket.onerror = (event) => {
//     console.error("WebSocket错误", event);
// }

// export default function() {
//     function sendMessage(msg: string) {
//         if (socket.readyState === WebSocket.OPEN) {
//             socket.send(JSON.stringify({ msg }));
//         } else {
//             console.error("WebSocket未连接");
//         }
//     }

//     async function receiveMessage() {
//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             return data.msg;
//         }
//     }

//     return {
//         sendMessage,
//         receiveMessage,
//     };
// }
