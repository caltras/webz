import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as Path from 'path';

export abstract class HtmlEngineInterface {
    protected configuration:any;
    abstract render(path:string,file:string,properties:any):string;
}
export class HtmlEngineFactory{
    public static create(cfg:any){
        let engine;
        switch(cfg.error.engine){
            case 'handlebars':
                engine = new HandlebarsEngine(cfg);
                break;
        }
        return engine;
    }
}
export class HandlebarsEngine extends HtmlEngineInterface{
    constructor(cfg:any){
        super();
        this.configuration = cfg;
    }
    render(path:string,file:string,properties:any):string{
        try{
            var url:string = Path.join(path,file);
            if(!fs.existsSync(url)){
                url = Path.join(__dirname,"../",file);
            }
            let htmlFile = fs.readFileSync(url,"utf-8");
            let template =  Handlebars.compile(htmlFile);
            return template(properties);
        }catch(e){
            return "Error "+e.message;
        }
    }
}
