import "reflect-metadata";
var webSocketHelper = require('../helpers/websocket.helper').WebSocketHelper;

export function WebSocket(value:any){
    console.log("@WebSocket");
    return function<T extends { new(...args:any[]):{}}>(constructor:T) {
        console.log("@WebSocket - inside");
        return class extends constructor {
            namespace=value;
            io:any;
            nsp:any;
            constructor(...args:any[]){
                super();
                this.io = args[0];
                this.nsp = this.io.of(this.namespace);
                this.nsp.on('connection',()=>{
                    console.log('Connected to '+this.namespace);
                    //let fn:Function = <Function>this['onMessage'];
                    //this.nsp.on('message',fn);
                })
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