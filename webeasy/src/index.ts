import * as http from "http";
import * as urlModule from "url";
import * as ControllerHelper from './helpers/controller.helper';
import * as debugModule from 'debug';
import { IncomingMessage } from "http";
import * as Lodash from 'lodash';

var controllerHelper = ControllerHelper.ControllerHelper.getInstance();
const debug = debugModule('webeasy-bootstrap');
export class WebeasyBootStrap{
    
    private urlParser:any;
    private servers:any;
    private config:any = {};

    constructor(cfg:any){
        this.urlParser = urlModule;
        this.servers = {};
        let c = require('./config/index');
        this.config = Lodash.defaultsDeep({},cfg,c.default);
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
    create(name?:string){
        let exists = !!this.servers.hasOwnProperty(name);
        if(name && exists){ 
            debug("Server already exists");
            throw "Server already exists";
        }
        name = name || "default";
        this.servers[name] = http.createServer(async (req,res)=>{
            //CORS
            //FILTERS
            //AUTHENTICATION
            //URL-PARSER
            //REQUEST-PARSER
            //ACTIONS/CONTROLLERS
            
            await controllerHelper.load(this.config,req, res);
            await controllerHelper.callRoute(req,res);

        });
        return this;
    }

}