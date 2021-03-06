import { SINGLETON_CLASS, CONTROLLER_KEY, GET_KEY, POST_KEY, PUT_KEY, DELETE_KEY, OPTIONS_KEY } from "../decorators/controller.decorator";
import { HtmlEngineFactory } from "./html.engine.helper";
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import { MethodWrapper } from './method.wrapper';
import { LoginController } from '../controller/login.controller';
import { LogoutController } from '../controller/logout.controller';
import { I18nHelper } from "../i18n/i18n.helper";
import { UrlToPattern } from "../parsers";

export function parse(result:any,contentType:ContentType){
    if(contentType=== ContentType.APPLICATION_JSON){
        return JSON.stringify(result);
    }
    return result;
}
export enum ContentType{
    APPLICATION_JSON ="application/json",
    APPLICATION_JAVASCRIPT="application/javascript",
    APPLICATION_OCTET_STREAM="application/octet-stream",
    APPLICATION_OGG="application/ogg",
    APPLICATION_PDF="application/pdf",
    APPLICATION_XHTML="application/xhtml+xml",
    APPLICATION_XML="application/xml",
    APPLICATION_ZIP="application/zip",
    
    AUDIO_MPEG="audio/mpeg",
    AUDIO_WMA="audio/x-ms-wma",
    AUDIO_REALAUDIO="audio/vnd.rn-realaudio",
    AUDIO_WAV="audio/x-wav",

    IMAGE_GIF="image/gif",
    IMAGE_JPEG="image/jpeg",
    IMAGE_PNG="image/png",
    IMAGE_TIFF="image/tiff",
    IMAGE__ICON="image/x-icon",
    IMAGE_SVG="image/svg+xml",

    MULTIPART_MIXED="multipart/mixed",

    TEXT_CSS="text/css",
    TEXT_CSV="text/csv",
    TEXT_XML="text/xml",
    HTML="text/html",
    TEXT_PLAIN="text/plain",

    VIDEO_MPEG="video/mpeg",
    VIDEO_MP4="video/mp4",
    VIDEO_QUICKTIME="video/quicktime",
    VIDEO_WMV="video/x-ms-wmv",
    VIDEO_WEBM="video/webm"
    
}
export class ContentTypeHelper {

    static getContentTypeBySufix(suffix:string):string{
        let content:any = ContentType;
        let type:string = ContentType.HTML;
        Object.keys(content).forEach((key)=>{
            if(content[key].indexOf(suffix) > -1){
                type = content[key];
            }
        });
        return type ;
    }
}
export class HelperUtils{
    public static walkSync(dir:any, filelist:any = []):any{
        return fs.readdirSync(dir)
            .filter(file => file.indexOf(".map") === -1 && file.indexOf(".d.ts") === -1)
            .map(file => {
                return fs.statSync(path.join(dir, file)).isDirectory()
                        ? HelperUtils.walkSync(path.join(dir, file), filelist)
                        : (file.indexOf(".controller.") > -1 ? filelist.concat(path.join(dir, file))[0] : "")
                }).filter( p => p !== "");
    }
    public static getListFileController(cfg:any):string[]{
        return _.flatMapDeep(HelperUtils.walkSync(cfg.base_url+"/"+cfg.controllers, []));
    }
}
export class ControllerHelper{
    private registeredClass:any;
    private registeredUrls:any;
    private ready:boolean;
    static instance:ControllerHelper;
    private route:any = { "GET":{}, "POST":{}, "PUT":{}, "DELETE":{}, "OPTIONS":{}, "HEAD":{}};
    private cfg:any;

    constructor(){
        this.registeredUrls = {};
        this.registeredClass={};
    }
    
    public async load(cfg:any){
        ControllerHelper.instance.cfg = cfg;

        let controllers:string[] = HelperUtils.getListFileController(cfg);
        if(!cfg.authentication.custom){
            this.registeredClass["login.controller"] = new LoginController("/login",HtmlEngineFactory.create(this.cfg));
            this.mappingRoute(LoginController);
            this.registeredClass["logout.controller"] = new LogoutController("/logout",HtmlEngineFactory.create(this.cfg));
            this.mappingRoute(LogoutController);
        }

        controllers.forEach(async (path)=>{
            var name_path:string = _.findLast(path.split("/")).replace(/(\.js|\.ts)/,"");
            if(!this.isReady() || !this.registeredClass.hasOwnProperty(name_path)){
                let Clazz = require(path);
                this.registeredClass[name_path] = new Clazz();
                this.mappingRoute(Clazz);
            }
        });
        this.setReady(true);
    }
    private mappingRoute(target:any){
        let decorator:any = this.getDecorators(target);
         Object.keys(decorator.methods).forEach((k:any)=>{
            let method = decorator.methods[k];
            Object.keys(method).forEach((m:any)=>{
                let url = method[m].url;
                if(typeof(url) !="string"){
                    url=url.url;
                }
                //this.route[k.toUpperCase()][url] = {class: target.name, method: method[m].method,name:method[m].name, target:target};
                //let key = method[m].pattern.regexp.toString();
                //let id = key.substr(1,key.toString().length-2);
                this.route[k.toUpperCase()][m] = {class: target.name, method: method[m].method,name:method[m].name, target:target};
            });
         });
    }
    private getDecorators(target:any):any{
        let decorator:any = {};
        let instance = Reflect.getMetadata(SINGLETON_CLASS,target);
        let controller = Reflect.getMetadata(CONTROLLER_KEY,target);
        let fns = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter((prop)=>{
            return typeof(instance[prop])=="function" && prop !=="constructor";
        });
        let removeFns:any[] = [];
        [{key:GET_KEY,name:"GET"},{key:POST_KEY,name:"POST"},{key:PUT_KEY,name:"PUT"},{key:DELETE_KEY,name:"DELETE"},{key:OPTIONS_KEY,name:"OPTIONS"}].forEach((type)=>{

            fns.forEach((prop:any)=>{
                let methods:any = Reflect.getMetadata(type.key,target,prop);
                if(methods){
                    removeFns.push(prop);
                    let url = methods;
                    if(typeof(url) !="string"){
                        url=url.url;
                    }
                    url = (instance.path+url).replace("//","/");
                    if(url!=="/"){
                        url = url.replace(/\/$/,"");
                    }
                    let method = {target: target, method: instance[prop], name:prop, decorator_params:methods,url:url, pattern: UrlToPattern.convert(url)};
                    decorator.methods = decorator.methods || {};
                    decorator.methods[type.name] = decorator.methods[type.name] || {};
                    let key = method.pattern.regexp.toString();
                    let id = key.substr(1,key.toString().length-2);
                    decorator.methods[type.name][id] = method;
                    //decorator.methods[type.name][url] = method;
                }              
            });

            _.remove(fns,(item)=>{
                return removeFns.indexOf(item) > -1;
            });
        });
        
        return decorator;
    }
    public static getInstance():ControllerHelper{
        if(!ControllerHelper.instance){
            ControllerHelper.instance = new ControllerHelper();
        }
        return ControllerHelper.instance;
    }
    public isReady():boolean{
        return this.ready;
    }
    public setReady(is:boolean){
        this.ready = is;
    }
    private checkUrlPattern(method:any,urlRequest:string):string{
        let key:string=null;
        let cont:number=0;
        var keys = Object.keys(this.route[method]).sort().reverse();
        _.forEach(keys,(k)=>{
            let regexp = new RegExp(k);
            if(regexp.test(urlRequest)){
                key = k;
                return false;
            }else{
                key=null;
                regexp=null;
            }
        });
        return key;
    }
    public callRoute(req:any,resp:any, config?:any){
        new Promise((resolve,reject)=>{
            try{
                if(!Object.keys(this.route[req.method]).length){
                    throw Error(`Page not found - ${req.method} - ${req.url}`);
                }else{
                    let key:string = this.checkUrlPattern(req.method,req.url);
                    if(!key){
                        throw Error(`Page not found - ${req.method} - ${req.url}`);
                    }else{
                        let controller = this.route[req.method][key];
                        let pattern = _.find(controller.target.patterns,(v)=> { 
                            return v.regexp.toString().substr(1,v.regexp.toString().toString().length-2) === key; 
                        });                     
                        let param = new MethodWrapper(controller.target,req,resp,pattern);
                        controller.method.call(controller.target,param);
                    }
                }
            }catch(e){
                resp.statusCode = 404;
                resp.writeHead(404,{'Content-type':ContentType.HTML});
                resp.end(HtmlEngineFactory.create(this.cfg).render(this.cfg.base_url,this.cfg.error["404"],{message:e.message,error:I18nHelper.getProperty("error")["404"]}));
            }
            resolve();
        });
    }
}
