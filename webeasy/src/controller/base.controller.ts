import { HtmlEngineInterface } from "../helpers/html.engine.helper";
import * as Path from 'path';

export class BaseController{
    protected config:any;
    protected path:string;
    protected template:HtmlEngineInterface;

    constructor(p:string,template:HtmlEngineInterface){
        this.path = p;
        this.template = template;
    }
    setPath(p:string){
        this.path = p;
    }
    getPath():string{
        return this.path;
    }
    setTemplate(t:HtmlEngineInterface){
        this.template = t;
    }
    getTemplate():HtmlEngineInterface{
        return this.template;
    }
    setConfiguration(cfg:any){
        this.config = cfg;
    }
    getConfiguration():any{
        return this.config;
    }
    render(file:string,data?:any):string{
        return this.template.render(Path.join(this.config.base_url,this.config.view.base),file,data);
    }
}