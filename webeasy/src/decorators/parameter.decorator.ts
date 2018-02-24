var SINGLETON_CLASS = require("./controller.decorator").SINGLETON_CLASS;
var CONTROLLER_KEY = require("./controller.decorator").CONTROLLER_KEY;

export const Inject =(params?:any)=>{
    return function(target:any, key:string){
        let val = target.constructor[key];
        let type = Reflect.getMetadata("design:type",target,key);
        console.log(type);
        function get() { return new type(); }
        function set(value:any) { 
            val = value;
        }
        Reflect.deleteProperty(target,key);
        Reflect.defineProperty(target,key,{
            get: get,
            set: set
        });
        return target;
    }
}