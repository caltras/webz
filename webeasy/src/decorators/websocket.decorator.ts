import "reflect-metadata";
var webSocketHelper = require('../helpers/websocket.helper').WebSocketHelper;
var securityHelper = require('../helpers/security.helper').SecurityHelper.getInstance();
var _ = require('lodash');

export function WebSocket(value:any,security:boolean=false){
    console.log("@WebSocket");
    return function<T extends { new(...args:any[]):{}}>(constructor:T) {
        console.log("@WebSocket - inside");
        return class extends constructor {
            namespace:string;
            io:any;
            nsp:any;
            group:any;
            numberUser:number=0;
            listeners:any;
            rooms:any;
            constructor(...args:any[]){
                super();
                this.io = args[0];
                this.namespace = value;
                this.nsp = this.io.of(value);
                this.nsp.on('connection',(socket:any)=>{
                    //CHECK SECURITY
                    try{
                        let user:any;
                        if(security){
                            let user:any = securityHelper.authenticate(socket.handshake.query.token);
                            webSocketHelper.instance.users[user.token] = webSocketHelper.instance.users[user.token] || []; 
                            webSocketHelper.instance.users[user.token].push(socket);
                        }
                        socket.on('disconnect',()=>{
                            this.numberUser--;
                            if(this.listeners.disconnect){
                                this.listeners.disconnect.call(this,socket,this.nsp);
                                if(socket.handshake.query.token){
                                    _.remove(webSocketHelper.instance.users[socket.handshake.query.token.split(" ")[1]],(s:any)=>{
                                        return s.id === socket.id;
                                    });
                                }
                            }
                        });
                        /*Object.keys(this.rooms).forEach(r=>{
                            console.log(r);
                            console.log(socket.join(r));
                            Object.keys(this.rooms[r]).forEach(d=>{

                            });
                        })*/
                        Object.keys(this.listeners).forEach(l=>{
                            socket.on(l,(data:any)=>{
                                this.listeners[l].call(this,data,socket,this.nsp)
                            });
                        });
                        this.numberUser++;
                        socket.emit('welcome',`Welcome ${socket.id}`);
                        this.nsp.emit("stats",this.numberUser);
                    }catch(e){
                        this.nsp.to(socket.id).emit('error',e.message);
                        socket.disconnect();
                    }
                });
            }
        }
    }
}

export function On(event:string,room?:string){
    return function(target:any, key:string,descriptor:PropertyDescriptor){
        if(room){
            target.rooms  = target.rooms || { };
            target.rooms[room] = target.rooms[room] || { listeners : {} };
            target.rooms[room].listeners  = target.rooms[room].listeners || {};
            target.rooms[room].listeners[event]  = descriptor.value;
        }else{
            target.listeners  = target.listeners || {};
            target.listeners[event] = descriptor.value;
        }
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