import {WebSocket, On} from 'webeasy/decorators/websocket.decorator';

@WebSocket("/chat")
class ChatWebSocket{
    @On("/")
    public onMessage(message:any){
        console.log(message);
    }
}
module.exports = ChatWebSocket;