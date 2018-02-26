var SINGLETON_CLASS = require("./controller.decorator").SINGLETON_CLASS;
var CONTROLLER_KEY = require("./controller.decorator").CONTROLLER_KEY;
var Singleton = require("../patterns").Singleton;

export const Inject =(params?:any)=>{
    return function(target:any, key:string){
        let val = target.constructor[key];
        let type = Reflect.getMetadata("design:type",target,key);
        if(type.__injectable){
            function get() { 
                if(type.getInstance){
                    return type.getInstance();
                }else{
                    return new type(); 
                }
            }
            function set(value:any) { 
                val = value;
            }
            Reflect.deleteProperty(target,key);
            Reflect.defineProperty(target,key,{
                get: get,
                set: set
            });
        }
        return target;
    }
}