import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as Path from 'path';
export class EngineCache{
    protected cache:any={};
    private static instance:EngineCache;
    static getInstance(){
        if(!EngineCache.instance){
            EngineCache.instance = new EngineCache()
        }
        return EngineCache.instance;
    }
    hasTemplate(key:string){
        return this.cache.hasOwnProperty(key);
    }
    add(key:string,template:any){
        this.cache[key] = template;
    }
    get(key:string){
        return this.cache[key];
    }
}
export abstract class HtmlEngineInterface {
    protected configuration:any;
    protected c:any;
    abstract compile(path:string):any;
    abstract render(path:string,file:string,properties:any):string;
    set cache(c:EngineCache){
        this.c = EngineCache.getInstance();
    }
    get cache():EngineCache{
        return this.c;
    }
}
export class HtmlEngineFactory{
    public static create(cfg:any){
        let engine;
        switch(cfg.error.engine){
            case 'handlebars':
                engine = new HandlebarsEngine(cfg);
                break;
        }
        engine.cache = EngineCache.getInstance();
        return engine;
    }
}
export class HandlebarsEngine extends HtmlEngineInterface{
    constructor(cfg:any){
        super();
        this.configuration = cfg;
    }
    compile(path:string):any{
        let template;
        let htmlFile = fs.readFileSync(path,"utf-8");
        template =  Handlebars.compile(htmlFile);
        this.cache.add(path,template);
    }
    render(path:string,file:string,properties:any):string{
        try{
            var url:string = Path.join(path,file);
            let template;
            if(!this.cache.hasTemplate(url)){
                if(!fs.existsSync(url)){
                    url = Path.join(__dirname,"../",file);
                }
                let htmlFile = fs.readFileSync(url,"utf-8");
                template =  Handlebars.compile(htmlFile);
                this.cache.add(url,template);
            }else{
                template = this.cache.get(url);
            }
            return template(properties);
        }catch(e){
            return "Error "+e.message;
        }
    }
}
