import { SINGLETON_CLASS, CONTROLLER_KEY, GET_KEY, POST_KEY, PUT_KEY, DELETE_KEY } from "../decorators/controller.decorator";
import { HtmlEngineFactory } from "./html.engine.helper";
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
export function parse(result:any,contentType:ContentType){
    if(contentType=== ContentType.APPLICATION_JSON){
        return JSON.stringify(result);
    }
    return result;
}
export enum ContentType{
    APPLICATION_JSON ="application/json",
    HTML="text/html"
}
export class ControllerHelper{
    private registeredClass:any;
    private registeredUrls:any;
    private ready:boolean;
    static instance:ControllerHelper;
    private route:any = { "GET":{}, "POST":{}, "PUT":{}, "DELETE":{}, "OPTION":{}, "HEAD":{}};
    private cfg:any;
    private filters:any[] = [];

    constructor(){
        this.registeredUrls = {};
        this.registeredClass={};
    }

    private walkSync(dir:any, filelist:any = []):any{
        return fs.readdirSync(dir)
            .filter(file => file.indexOf(".map") === -1 && file.indexOf(".d.ts") === -1)
            .map(file => {
                return fs.statSync(path.join(dir, file)).isDirectory()
                        ? this.walkSync(path.join(dir, file), filelist)
                        : filelist.concat(path.join(dir, file))[0]
                });
    }
    private getListFileController(cfg:any):string[]{
        return _.flatMapDeep(this.walkSync(cfg.base_url+"/"+cfg.controllers, []));
    }
    public async load(cfg:any){
        ControllerHelper.instance.cfg = cfg;

        let controllers:string[] = this.getListFileController(cfg);
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
                this.route[k.toUpperCase()][url] = {class: target.name, method: method[m].method,name:method[m].name, target:target};
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
        [{key:GET_KEY,name:"GET"},{key:POST_KEY,name:"POST"},{key:PUT_KEY,name:"PUT"},{key:DELETE_KEY,name:"DELETE"}].forEach((type)=>{

            fns.forEach((prop:any)=>{
                let methods:any = Reflect.getMetadata(type.key,target,prop);
                if(methods){
                    removeFns.push(prop);
                    let url = methods.url;
                    if(typeof(url) !="string"){
                        url=url.url;
                    }
                    url = (instance.path+url).replace("//","/");
                    let method = {target: target, method: instance[prop], name:prop, decorator_params:methods,url:url };
                    decorator.methods = decorator.methods || {};
                    decorator.methods[type.name] = decorator.methods[type.name] || {};
                    decorator.methods[type.name][url] = method;
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
    public async callRoute(req:any,resp:any){
        try{
            if(!Object.keys(this.route[req.method]).length){
                throw Error(`Page not found - ${req.method} - ${req.url}`);
            }else{
                if(!this.route[req.method].hasOwnProperty(req.url)){
                    throw Error(`Page not found - ${req.method} - ${req.url}`);
                }else{
                    let controller = this.route[req.method][req.url];
                    let instanceClazz = Reflect.getMetadata(SINGLETON_CLASS,controller.target);
                    instanceClazz[controller.name].call(instanceClazz,req,resp);
                }
            }
        }catch(e){
            resp.statusCode = 404;
            resp.writeHead(404,{'Content-type':ContentType.HTML});
            resp.end(HtmlEngineFactory.create(this.cfg).render(this.cfg.base_url,this.cfg.error["404"],e));
        }
    }
    get filter(){
        return this.filters;
    }
    hasFilters():boolean{
        return this.filters.length>0;
    }
    public addFilter(filter:any|any[]){
        if(filter instanceof Array){
            this.filters = this.filters.concat(filter);
        }else{
            this.filters.push(filter);
        }
    }
    public async doFilter(req:any,resp:any){
        console.log("call filters")
    }
}
