import * as Handlebars from 'handlebars';
import * as fs from 'fs';

export abstract class HtmlEngineInterface {
    protected configuration:any;
    abstract render(file:string,properties:any):string;
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
    render(file:string,properties:any):string{
        let htmlFile = fs.readFileSync(file,"utf-8");
        let template =  Handlebars.compile(htmlFile);
        return template(properties);
    }
}
