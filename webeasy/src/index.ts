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
import { ResourceHelper } from './helpers/resource.helper';
import * as Path from 'path';
import { Cors } from "./filters/cors";
import { AbstractFilter } from "./filters";
import { ConfigurationHelper } from "./helpers/configuration.helper";
import * as sessions from 'client-sessions';
import {OptionsSession, SessionHelper} from './helpers/session.helper';
import { LoginHandlerAbstract, LoginHelper } from "./security/login.handler";


var controllerHelper = ControllerHelper.ControllerHelper.getInstance();
var HelperUtils = ControllerHelper.HelperUtils;
var filterHelper = FilterHelper.getInstance();
var resourceHelper = ResourceHelper.getInstance();

const debug = debugModule('webeasy-bootstrap');
export class WebeasyBootStrap{
    
    private urlParser:any;
    private servers:any;
    private config:any = {};

    constructor(cfg:any){
        this.urlParser = urlModule;
        this.servers = {};
        Configuration.getInstance().getConfig().base_url = cfg.base_url;
        cfg.filter = cfg.filter || {};
        cfg.filter.filters = Lodash.map(cfg.filter.filters,(f:string)=>{
            return Path.join(cfg.base_url,f);
        });
        cfg.filter.filters = Lodash.map(Configuration.getInstance().getConfig().filter.filters,(f:string)=>{
            return Path.join(__dirname,f);
        }).concat(cfg.filter.filters);

        this.config = Lodash.defaultsDeep({},cfg,Configuration.getInstance().getConfig());
        this.config.filter.exceptions = this.config.filter.exceptions.concat(this.config.filter.security.exceptions);
        ConfigurationHelper.getInstance().setConfiguration(this.config);
    }
    addLoginHandler(handler:LoginHandlerAbstract){
        LoginHelper.getInstance().setHandle(handler);
    }
    addFilters(filter:AbstractFilter|AbstractFilter[]){
        filterHelper.addFilter(filter);
        filterHelper.sortingFilters();
    }
    loadFilters(){     
        filterHelper.load(this.config.filter.filters);
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
        filterHelper.securityFilter = this.config.filter.security;

        filterHelper.exceptions = filterHelper.exceptions.concat(this.config.filter.security.exceptions.map(filterHelper.processUrlAsRegExp));

        this.cors();
        this.loadFilters();
        this.loadTemplates();
        let stack:any[] = [];
        if(filterHelper.hasFilters() && this.config.filter.enabled){
            stack.push({class: filterHelper, method: filterHelper.doFilter});
        }
        resourceHelper.setResources(this.config.resources);
        stack.push({ class: resourceHelper, method: resourceHelper.doFilter})
        stack.push({ class: controllerHelper,method: controllerHelper.callRoute });

        SessionHelper.getInstance().options = new OptionsSession();
        SessionHelper.getInstance().session = sessions(SessionHelper.getInstance().options);

        this.servers[name] = http.createServer((req,res)=>{
            //URL-PARSER
            let executeStack = ()=>{
                stack.forEach(s=>{
                    if(!res.finished){
                        s.method.call(s.class,req,res,this.config);
                    }
                });
            }
            debug("HTTP/"+req.httpVersion+" - "+req.method+" : "+req.url);
            if(this.config.session.enabled && (this.config.filter.enabled || this.config.authentication.enabled)){
                SessionHelper.getInstance().session(req,res,executeStack);
            }else{
                executeStack();
            }
            
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

process
    .on('unhandledRejection',(reason,p)=>{
        console.warn("Finishing the program");
        console.error(reason.message);
        process.exit();
    })
    .on('uncaughtException',(err)=>{
        console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
        console.error(err.stack)
        process.exit();
    });