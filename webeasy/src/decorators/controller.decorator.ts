var http = require("http");

var Helper = require('../helpers/controller.helper');
var BodyParameter = require('../controller/index').BodyParameter;
var FormParameter = require('../controller/index').FormParameter;
var Engine = require("../helpers/html.engine.helper");
var Config = require('../config/index').Configuration;
var BodyParser = require("../converters/index").BodyParser;

export class ReflectionDecorator{
    
    private static metadata:any = {};

    public static setMetadata(key:string,target:any,parameters?:any){
        if(!ReflectionDecorator.metadata.hasOwnProperty(key)){
            ReflectionDecorator.metadata[key] = { class : target, decorator_params: parameters};
        }else{
            ReflectionDecorator.metadata[key].class.setPath(parameters);
            ReflectionDecorator.metadata[key].class.setTemplate(target.template);
            ReflectionDecorator.metadata[key].class.setConfiguration(target.config);
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
        let instance = new target(params,Engine.HtmlEngineFactory.create(Config.getInstance().getConfig()));
        instance.setConfiguration(Config.getInstance().getConfig());
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
            let request_url = ""; 
            let contentType = Helper.ContentType.HTML;
            if(params instanceof String){
                request_url = reflectionClass.class.getPath()+params;
            }else{
                request_url = reflectionClass.class.getPath()+params.url;
                contentType = params.contentType || Helper.ContentType.HTML;
            }

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
            response.writeHead(200,{'Content-type': contentType});
            response.end(Helper.parse(result,contentType));
            return result;
        }
        ReflectionDecorator.setMetadataMethod(target.constructor.name,new classConstructor(target.path),propertyKey,descriptor.value,params,"GET");
        return descriptor;        
    }
};
export function Post(params:any){
    return function(target:any, propertyKey: string, descriptor: PropertyDescriptor){
        var classConstructor = target.constructor;
        var originalMethod = descriptor.value;
        descriptor.value = async function(...args:any[]){
            let reflectionClass = ReflectionDecorator.getMetada(target.constructor.name);
            let request_url = ""; 
            let contentType = Helper.ContentType.HTML;
            if(params instanceof String){
                request_url = reflectionClass.class.getPath()+params;
            }else{
                request_url = reflectionClass.class.getPath()+params.url;
                contentType = params.reponseContentType || Helper.ContentType.HTML;
            }

            let response = { end : (param:any)=>{}, writeHead: (...args:any[])=>{}};
            let request = new http.IncomingMessage();
            let body:any;
            args.forEach((param, index)=>{
                if(param instanceof http.IncomingMessage){
                    param.request_url = request_url;
                    request = param;
                } 
                if(param instanceof http.ServerResponse){
                    response = param;
                }
                if(param instanceof BodyParameter){
                    body = param;
                }
            });
            body = await BodyParser.parse(request);
            
            let newArguments:any[] =[];
            newArguments = newArguments.concat(args);
            newArguments.push(body);

            var result = originalMethod.apply(reflectionClass.class, newArguments);
            response.writeHead(200,{'Content-type': contentType});
            response.end(Helper.parse(result,contentType));
            
            return;
        }
        ReflectionDecorator.setMetadataMethod(target.constructor.name,new classConstructor(target.path),propertyKey,descriptor.value,params,"POST");
        return descriptor;        
    }
};