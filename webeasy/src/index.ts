import "reflect-metadata";
import * as http from "http";
import * as urlModule from "url";
import * as ControllerHelper from './helpers/controller.helper';
import * as debugModule from 'debug';
import { IncomingMessage } from "http";
import * as Lodash from 'lodash';
import { Configuration } from './config/index';
import { HtmlEngineFactory } from "./helpers/html.engine.helper";
import { FilterHelper } from './helpers/filter.helper';
import * as Path from 'path';
import { Cors } from "./filters/cors";
import { AbstractFilter } from "./filters";

var controllerHelper = ControllerHelper.ControllerHelper.getInstance();
var HelperUtils = ControllerHelper.HelperUtils;
var filterHelper = FilterHelper.getInstance();

const debug = debugModule('webeasy-bootstrap');
export class WebeasyBootStrap{
    
    private urlParser:any;
    private servers:any;
    private config:any = {};

    constructor(cfg:any){
        this.urlParser = urlModule;
        this.servers = {};
        Configuration.getInstance().getConfig().base_url = cfg.base_url;
        cfg.filters = cfg.filters || [];
        cfg.filters = Lodash.map(cfg.filters,(f:string)=>{
            return Path.join(cfg.base_url,f);
        });
        cfg.filters = Lodash.map(Configuration.getInstance().getConfig().filters,(f:string)=>{
            return Path.join(__dirname,f);
        }).concat(cfg.filters);

        this.config = Lodash.defaultsDeep({},cfg,Configuration.getInstance().getConfig());
    }
    
    addFilters(filter:AbstractFilter|AbstractFilter[]){
        filterHelper.addFilter(filter);
        filterHelper.sortingFilters();
    }
    loadFilters(){     
        filterHelper.load(this.config.filters);
    }
    loadTemplates(){
        let files:string[] = HelperUtils.walkSync(this.config.base_url+"/"+this.config.view.base,[]);
        let engine = HtmlEngineFactory.create(this.config);
        Lodash.each(Lodash.flatMapDeep(files),(file)=>{
            engine.compile(file);
        });
    }
    cors(){
        if(this.config.cors.enabled){
            this.addFilters(new Cors(this.config.cors));
        }
    }
    async create(name?:string){
        let exists = !!this.servers.hasOwnProperty(name);
        if(name && exists){ 
            debug("Server already exists");
            throw "Server already exists";
        }
        name = name || "default";
        await controllerHelper.load(this.config);
        this.cors();
        this.loadFilters();
        this.loadTemplates();
        //AUTHENTICATION
        //URL-PARSER
        let stack:any[] = [];
        if(filterHelper.hasFilters() && this.config.enabledFilters){
            stack.push({class: filterHelper, method: filterHelper.doFilter});
        }
        stack.push({ class: controllerHelper,method: controllerHelper.callRoute });
        this.servers[name] = http.createServer((req,res)=>{
            stack.forEach(s=>{
                if(!res.finished){
                    s.method.call(s.class,req,res);
                }
            });
        });

        //socket.io
        return this;
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

}