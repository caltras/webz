import "reflect-metadata";
var http = require("http");

var Helper = require('../helpers/controller.helper');
var BodyParameter = require('../controller/index').BodyParameter;
var FormParameter = require('../controller/index').FormParameter;
var Engine = require("../helpers/html.engine.helper");
var Config = require('../config/index').Configuration;
var BodyParser = require("../converters/index").BodyParser;

export const SINGLETON_CLASS = "design:singleton";
export const CONTROLLER_KEY = "design:class";
export const GET_KEY = "design:type:get";
export const DELETE_KEY = "design:type:delete";
export const POST_KEY = "design:type:post";
export const PUT_KEY = "design:type:put";
export const PATCH_KEY = "design:type:patch";
export const HEAD_KEY = "design:type:head";
export const OPTIONS_KEY = "design:type:options";
export const CONNECT_KEY = "design:type:connect";
export const PARAMS_KEY = "design:paramType";

export function Controller(params:any){
    return function(target:any){
        let instance = new target(params,Engine.HtmlEngineFactory.create(Config.getInstance().getConfig()));
        instance.setConfiguration(Config.getInstance().getConfig());
        
        Reflect.defineMetadata(CONTROLLER_KEY,params,target);
        Reflect.defineMetadata(SINGLETON_CLASS,instance,target);
        
        return target;
    }
}
var processRequest = (params:any,type:any)=>{
    return function(target:any, propertyKey: string, descriptor: PropertyDescriptor){
        var classConstructor = target.constructor;
        var originalMethod = descriptor.value;
        descriptor.value = async function(...args:any[]){
            let path = Reflect.getMetadata(CONTROLLER_KEY,target.constructor);
            let methodParams = Reflect.getMetadata(type,target.constructor,propertyKey);

            let reflectionClass = Reflect.getMetadata(SINGLETON_CLASS,target.constructor);
            let request_url = ""; 
            let contentType = Helper.ContentType.HTML;
            if(methodParams instanceof String){
                request_url = path+methodParams;
            }else{
                request_url = path+ (methodParams.url || "");
                contentType = methodParams.responseContentType || Helper.ContentType.HTML;
            }
            let request = new http.IncomingMessage();
            let response = new http.ServerResponse(request);
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

            var result = originalMethod.apply(reflectionClass, newArguments);
            if(type!==CONNECT_KEY && type!==HEAD_KEY && type!==PATCH_KEY){
                response.writeHead(200,{'Content-type': contentType});
                response.end(Helper.parse(result,contentType));
            }else{
                response.writeHead(200);
                response.end();
            }
            return result;
        }
        Reflect.defineMetadata(type,params,classConstructor,propertyKey);
        return descriptor;        
    };
};


export function Get(params:any){
    return processRequest(params,GET_KEY);
};
export function Delete(params:any){
    return processRequest(params,DELETE_KEY);
};
export function Post(params:any){
    return processRequest(params,POST_KEY);
};
export function Put(params:any){
    return processRequest(params,PUT_KEY);
};
export function Patch(params:any){
    return processRequest(params,PATCH_KEY);
};
export function Connect(params:any){
    return processRequest(params,CONNECT_KEY);
};
export function Head(params:any){
    return processRequest(params,HEAD_KEY);
};
export function Options(params:any){
    return processRequest(params,OPTIONS_KEY);
};