var ReflectionDecorator = require('./controller.decorator').ReflectionDecorator;
export function Inject(params?:any){
    return function(target:any, key:string){
        //console.log("Inject");
        //console.log(target, key);
        //var classConstructor = target.constructor;
        //ReflectionDecorator.setMetadataMethod(target.constructor.name,new classConstructor(target.path),key,key,params,"INJECT");
        //let reflectionClass = ReflectionDecorator.getMetada(target.constructor.name);
        //console.log(reflectionClass);
        return target;
    }
}