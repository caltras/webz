import "reflect-metadata";
import * as http from "http";
import * as urlModule from "url";
import * as ControllerHelper from './helpers/controller.helper';
import * as debugModule from 'debug';
import { IncomingMessage } from "http";
import * as Lodash from 'lodash';
import { Configuration } from './config/index';
import { HtmlEngineFactory } from "./helpers/html.engine.helper";

var controllerHelper = ControllerHelper.ControllerHelper.getInstance();
var HelperUtils = ControllerHelper.HelperUtils;

const debug = debugModule('webeasy-bootstrap');
export class WebeasyBootStrap{
    
    private urlParser:any;
    private servers:any;
    private config:any = {};

    constructor(cfg:any){
        this.urlParser = urlModule;
        this.servers = {};
        Configuration.getInstance().getConfig().base_url = cfg.base_url;
        this.config = Lodash.defaultsDeep({},cfg,Configuration.getInstance().getConfig());
    }

    listen(name?:string,port?:any){
        if(!Object.keys(this.servers).length){
            debug("There is any server configured.");
            throw "There is any server configured.";
        }
        if(!name && Object.keys(this.servers).length == 1){
            let n = Object.keys(this.servers)[0];
            this.servers[n].listen(this.config.port,()=>{
                debug(`Listening server ${n} at ${this.config.port}`);
            });
        }else{
            name = name || "default";
            port = name === "default" ? this.config.port : port;
            this.servers[name].listen(port,()=>{
                debug(`Listening server ${name} at ${port}`);
            });
        }
        return this;
        
    }
    addFilters(){

    }
    loadTemplates(cfg:any){
        let files:string[] = HelperUtils.walkSync(this.config.base_url+"/"+this.config.view.base,[]);
        let engine = HtmlEngineFactory.create(cfg);
        Lodash.each(Lodash.flatMapDeep(files),(file)=>{
            engine.compile(file);
        });
    }
    async create(name?:string){
        let exists = !!this.servers.hasOwnProperty(name);
        if(name && exists){ 
            debug("Server already exists");
            throw "Server already exists";
        }
        name = name || "default";
        await controllerHelper.load(this.config);
        this.loadTemplates(this.config);
        //CORS
        //FILTERS
        //AUTHENTICATION
        //URL-PARSER
        //REQUEST-PARSER
        //ACTIONS/CONTROLLERS
        let stack:any[] = [];
        if(controllerHelper.hasFilters()){
            stack.push({class: controllerHelper, mehtod: controllerHelper.doFilter});
        }
        stack.push({ class: controllerHelper,method: controllerHelper.callRoute });
        this.servers[name] = http.createServer((req,res)=>{
            stack.forEach(s=>{
                s.method.call(s.class,req,res);
            });
        });

        //socket.io
        return this;
    }

}