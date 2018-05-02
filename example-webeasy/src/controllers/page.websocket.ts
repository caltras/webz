import {WebSocket,On} from 'webeasy/decorators/websocket.decorator';

@WebSocket("/page",true)
class PageWebSocket{
    nsp:any;

    @On("message")
    public onMessage(message:any,socket:any,namespace:any){
        namespace.emit('update',new Date().toUTCString());
    }
    @On('disconnect')
    public onDisconnect(socket:any,namespace:any):void{
        namespace.emit('leaved',socket.id+' leaved! #socket');
    }
}
module.exports = PageWebSocket;