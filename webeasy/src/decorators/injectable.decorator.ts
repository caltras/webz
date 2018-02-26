var Singleton = require('../patterns').Singleton;

export function Injectable(params?:any){
    return function(target:any){
        let singleton = true;
        target.__injectable = true;
        let type = Reflect.getMetadata("design:type",target);

        if(params && params.hasOwnProperty("singleton")){
            singleton = params["singleton"];
        }
        if(singleton){
            Singleton(target);
        }

        Reflect.defineMetadata("design:type",params,target.constructor);

        return target;
    }
}