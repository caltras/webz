import "reflect-metadata";
var http = require("http");
var _ = require('lodash');
var Helper = require('../helpers/controller.helper');
var BodyParameter = require('../controller/index').BodyParameter;
var FormParameter = require('../controller/index').FormParameter;
var Engine = require("../helpers/html.engine.helper");
var Config = require('../config/index').Configuration;
var BodyParser = require("../converters/index").BodyParser;
var Parser = require("../parsers").Parser;
var UrlToPattern = require("../parsers").UrlToPattern;

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
        if(target.prototype.actions){
            target.prototype.actions.forEach((v:string)=>{
                var url = (params.url ? params.url+v : params + v).replace("//","/");
                if(url!=="/"){
                    url = url.replace(/\/$/,"");
                }
                var pattern = UrlToPattern.convert(url);
                if(!target.patterns){
                    Object.defineProperty(target,"patterns",{value: [] });
                }
                target.patterns.push(pattern);
            });
        }
        return target;
    }
}
var processRequest = (params:any,type:any)=>{
    return function(target:any, propertyKey: string, descriptor: PropertyDescriptor){
        if(!target.actions){
            Object.defineProperty(target,"actions",{value: [] });
        }
        target.actions.push(params.url ? params.url : params);
        var classConstructor = target.constructor;
        var originalMethod = descriptor.value;

        descriptor.value = function(args:any){
            try{
                let reflectionClass = Reflect.getMetadata(SINGLETON_CLASS,target.constructor);
                let methodParams:any = Reflect.getMetadata(type,target.constructor,propertyKey);
                
                let path = reflectionClass.getPath();
                
                let request_url = ""; 
                let contentType = Helper.ContentType.HTML;
                let async:boolean = false;
                if(methodParams instanceof String){
                    request_url = path+methodParams;
                }else{
                    request_url = path+ (methodParams.url || "");
                    contentType = methodParams.responseContentType || Helper.ContentType.HTML;
                    if(methodParams.hasOwnProperty("async")){
                        async = methodParams.async;
                    }
                }
                let request = args.request;
                let response = args.response;
                let body:any;

                if(type === GET_KEY){
                    return processGet(request,response,args,type,contentType,body,originalMethod,reflectionClass,async);
                }else{
                    return process(request,response,args,type,contentType,body,originalMethod,reflectionClass,async);
                }
            }catch(e){
                args.response.statusCode = 505;
                args.response.end();
            }
        }
        Reflect.defineMetadata(type,params,classConstructor,propertyKey);
        return descriptor;        
    };
};
/* 
Due to performance
*/
function processGet(request:any,response:any,args:any,type:string, contentType:any,body:any,originalMethod:any,reflectionClass:any,async:boolean){
    return new Promise((resolve, reject)=>{
        try{
            let newArguments:any[] =[];
            newArguments = newArguments.concat([args.req,args.resp]);

            if(request.headers["content-length"]){
                //the difference
                body = BodyParser.parse(request);
                Object.defineProperty(request,"body",{ value : body.getData(), writable:true });
                newArguments.push(body);
            }
            if(async){
                let promise = originalMethod.apply(reflectionClass, newArguments);
                if(promise instanceof Promise){
                    promise.then((result:any)=>{
                            processResponse(result,response,type,contentType);
                            resolve();
                        }).catch((error:any)=>{
                            reject(error);
                        }); 
                }else{
                    processResponse(promise,response,type,contentType);
                    resolve();
                }
            }else{
                let result = originalMethod.apply(reflectionClass, newArguments);
                processResponse(result,response,type,contentType);
                resolve();
            }
        }catch(e){
            response.statusCode = 505;
            response.end();
            reject(e);
            
        }
    });
}
function process(request:any,response:any,args:any,type:string, contentType:any,body:any,originalMethod:any,reflectionClass:any,async:boolean){
    return new Promise(async (resolve, reject)=>{
        try{
            let newArguments:any[] =[];
            newArguments = newArguments.concat([args.req,args.resp]);

            if(request.headers["content-length"]){
                //the difference
                body = await BodyParser.parse(request);
                Object.defineProperty(request,"body",{ value : body.getData(), writable:true });
                newArguments.push(body);
            }
            if(async){
                let promise = originalMethod.apply(reflectionClass, newArguments);
                if(promise instanceof Promise){
                    promise.then((result:any)=>{
                            processResponse(result,response,type,contentType);
                            resolve();
                        }).catch((error:any)=>{
                            reject(error);
                        }); 
                }else{
                    processResponse(promise,response,type,contentType);
                    resolve();
                }
            }else{
                let result = originalMethod.apply(reflectionClass, newArguments);
                processResponse(result,response,type,contentType);
                resolve();
            }
        }catch(e){
            response.statusCode = 505;
            response.end();
            reject(e);
            
        }
    });
};
function processResponse(result:any,response:any,type:string,contentType:any){
    if(!response.finished){
        response.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        response.setHeader('Expires', '-1');
        response.setHeader('Pragma', 'no-cache');
        
        if([CONNECT_KEY,HEAD_KEY,PATCH_KEY].indexOf(type)===-1){
            response.writeHead(200,{'Content-type': contentType});
            response.end(Helper.parse(result,contentType));
        }else{
            response.writeHead(200);
            response.end();
        }
    }
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