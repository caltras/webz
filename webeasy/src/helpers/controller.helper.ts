import { ReflectionDecorator } from "../decorators/controller.decorator";
import { HtmlEngineFactory } from "./html.engine.helper";
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
export enum ContentType{
    APPLICATION_JSON ="application/json",
    HTML="text/html"
}
export class ControllerHelper{
    private registeredClass:any;
    private registeredUrls:any;
    private ready:boolean;
    static instance:ControllerHelper;
    private route:any = { "GET":{}, "POST":{}};
    private cfg:any;
    

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
    public async load(cfg:any,req:any,resp:any){
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
            console.log(decorator.decorator_params+method.decorator_params);
            this.route[method.type.toUpperCase()][decorator.decorator_params+method.decorator_params] = {class: target.name, method: method.method};
        });
    }
    private getDecorators(target:any){
        return ReflectionDecorator.getMetada(target.name);
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
                    let instanceClazz = ReflectionDecorator.getMetadaStartWith(controller.class);
                    let clzz = instanceClazz.class;
                    clzz[controller.method].call(clzz,req,resp);
                }
            }
        }catch(e){
            resp.statusCode = 404;
            resp.writeHead(404,{'Content-type':ContentType.HTML});
            resp.end(HtmlEngineFactory.create(this.cfg).render(this.cfg.base_url+"/"+this.cfg.error["404"],e));
        }

    }
}
