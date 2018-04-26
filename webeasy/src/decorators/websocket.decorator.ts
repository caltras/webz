import "reflect-metadata";
var webSocketHelper = require('../helpers/websocket.helper').WebSocketHelper;

export function WebSocket(value:any){
    console.log("@WebSocket");
    return function<T extends { new(...args:any[]):{}}>(constructor:T) {
        console.log("@WebSocket - inside");
        return class extends constructor {
            namespace:string;
            io:any;
            nsp:any;
            group:any;
            numberUser:number=0;
            constructor(...args:any[]){
                super();
                this.io = args[0];
                this.namespace = value;
                this.nsp = this.io.of(value);
                this.nsp.on('connection',(socket:any)=>{
                    socket.emit('welcome',`Welcome ${socket.id}`);
                    socket.on('message chat',(data:any)=>{
                        constructor.prototype["onMessage"].call(this,data,socket);
                    });
                    socket.on('disconnect',()=>{
                        this.numberUser--;
                    });
                    this.numberUser++;
                    Object.keys(this.nsp.sockets).map(s=>{
                        this.nsp.sockets[s].emit("stats",this.numberUser);
                    });
                });
            }
        }
    }
}

export function On(group:string){
    console.log("@On");
    return function(target:any, key:string,descriptor:PropertyDescriptor){
        console.log(target);
        console.log("@On - inside");
    }
}
/*export function WebSocket(namespace:any){
    return function(target:any){
        console.log("@WebSocket");
        //Object.defineProperty(target,"namespace",{value: namespace, writable:true });

        //Reflect.defineMetadata("design:type",namespace,target);

        return target;
    }
};
export function On(group?:any){
    return function(target:any, key:string,descriptor:PropertyDescriptor){
        console.log("@On");
        //console.log(descriptor);
        //console.log(Reflect.getMetadata("design:type",target));
        //console.log(webSocketHelper.instance);
        //console.log(group)
        //console.log(target[key]);
        return target;
    }
};*/