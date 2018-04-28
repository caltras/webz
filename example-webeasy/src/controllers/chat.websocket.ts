import {WebSocket,On} from 'webeasy/decorators/websocket.decorator';

@WebSocket("/chat",true)
class ChatWebSocket{

    @On("message")
    public onMessage(message:any,socket:any,namespace:any){
        console.log(message);
    }
    @On("join")
    public onJoin(message:any,socket:any,namespace:any):void{
        socket.broadcast.emit('joined',socket.id+' joined! #socket'); 
    }
    @On('disconnect')
    public onDisconnect(socket:any,namespace:any):void{
        namespace.emit('leaved',socket.id+' leaved! #socket');
    }
}
module.exports = ChatWebSocket;