var http = require("http");

import { ContentType } from '../helpers/controller.helper';
//var Helper = require("../helpers/controller.helper");

export class ReflectionDecorator{
    
    private static metadata:any = {};

    public static setMetadata(key:string,target:any,parameters?:any){
        if(!ReflectionDecorator.metadata.hasOwnProperty(key)){
            ReflectionDecorator.metadata[key] = { class : target, decorator_params: parameters};
        }else{
            ReflectionDecorator.metadata[key].class.setPath(parameters);
            ReflectionDecorator.metadata[key].decorator_params = parameters;
        }
    }
    public static getAllMetadatas():any{
        return this.metadata;
    }
    public static getMetada(key:string):any{
        return this.metadata[key] || {};
    }

    public static setMetadataMethod(key:string,target:any,propertyKey:string,method:any,parameters:any,type:string){
        ReflectionDecorator.setMetadata(key,target);
        ReflectionDecorator.metadata[key].methods = ReflectionDecorator.metadata[key].methods || {};
        ReflectionDecorator.metadata[key].methods[propertyKey] = { 
            "method" : propertyKey, 
            "decorator_params" : parameters, 
            "type": type
        };
    }
    public static getMetadataMethod(key:string,method:string){
        if(ReflectionDecorator.metadata.hasOwnProperty(key) && ReflectionDecorator.metadata[key].methods.hasOwnProperty(method)){
            return ReflectionDecorator.metadata[key].methods[method];
        }
        return null;
        
    }
    public static getMetadaStartWith(target:string):any{
        var metadata = null;
        Object.keys(ReflectionDecorator.metadata).forEach((v)=>{
            if(v.indexOf(target)>-1){
                metadata = ReflectionDecorator.metadata[v];
            }
        })
        return metadata;
    }
};

export function Controller(params:any){
    return function(target:any){
        //target.prototype.path = params;
        let instance = new target(params);
        ReflectionDecorator.setMetadata(target.name,instance,params);
        return target;
    }
}

export function Get(params:any){
    return function(target:any, propertyKey: string, descriptor: PropertyDescriptor){
        var classConstructor = target.constructor;
        var originalMethod = descriptor.value;
        descriptor.value = function(...args:any[]){
            let reflectionClass = ReflectionDecorator.getMetada(target.constructor.name);
            let request_url = reflectionClass.class.getPath()+params;
            let response = { end : (param:any)=>{}, writeHead: (...args:any[])=>{}};
            args.forEach((param, index)=>{
                if(param instanceof http.IncomingMessage){
                    param.request_url = request_url;
                } 
                if(param instanceof http.ServerResponse){
                    response = param;
                }
            });
            var result = originalMethod.apply(reflectionClass.class, args);
            response.writeHead(200,{'Content-type': ContentType.APPLICATION_JSON});
            response.end(JSON.stringify(result));
            return result;
        }
        ReflectionDecorator.setMetadataMethod(target.constructor.name,new classConstructor(target.path),propertyKey,descriptor.value,params,"GET");
        return descriptor;        
    }
}