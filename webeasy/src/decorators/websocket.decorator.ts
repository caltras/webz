import "reflect-metadata";
var webSocketHelper = require('../helpers/websocket.helper').WebSocketHelper;

export function WebSocket(namespace:any){
    return function(target:any){

        Object.defineProperty(target,"namespace",{value: namespace, writable:true });

        Reflect.defineMetadata("design:type",namespace,target);

        return target;
    }
};
export function On(group?:any){
    return function(target:any, key:string){
        console.log(Reflect.getMetadata("design:type",target));
        console.log(Object.keys(target));
        console.log(webSocketHelper.instance);
        console.log(group)
        return target;
    }
};