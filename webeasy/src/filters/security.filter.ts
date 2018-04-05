import { SecurityInterface } from "./security.interface.filter";
import { ServerRequest, ServerResponse } from "http";
import { Order, Filter, Inject } from "../decorators";
import { ConfigurationHelper} from '../helpers/configuration.helper';
import { HtmlEngineFactory } from "../helpers/html.engine.helper";
import { SessionHelper } from "../helpers/session.helper";
import { User } from "../security/user";
import { AbstractTokenAuthentication } from '../security/abstract.token.authentication';
import * as Path from 'path';
import * as debug from 'debug';

@Filter()
@Order(-1)
export class Security extends SecurityInterface{
    
    @Inject()
    private configurationHelper:ConfigurationHelper;
    private logger = debug('security');
    
    constructor(){
        super();
    }
    doFilter(request:ServerRequest, response:ServerResponse){
        if(!super.checkSecurityexceptions(request)){
            if(!this.isAuthenticate(request,response)){
                response.writeHead(301,{
                    Location: (this.configurationHelper.getProperty("redirect").login)
                });
                response.end();
            }else{
                if(!this.isAllowed(request,response)){
                    response.statusCode = 403;
                    let engine = HtmlEngineFactory.create(this.configurationHelper.getConfiguration());
                    let errorCfg = this.configurationHelper.getProperty("error");
                    var page = engine.render((this.configurationHelper.getProperty("base_url") || __dirname),errorCfg["403"],{});
                    response.end(page);
                }
            }
        }else{
            if(request.url === this.configurationHelper.getProperty("redirect").login){
                response.writeHead(301,{
                    Location: (this.configurationHelper.getProperty("redirect").login)
                });
                response.end();
            }
        }
        this.next(request,response);
    }
    isAuthenticate(request:ServerRequest, response:ServerResponse):boolean{
        let token:any = request.headers["authorization"];
        let user:User = SessionHelper.getInstance().getAuthenticateUser(request);
        let tokenHandler = ConfigurationHelper.getInstance().getProperty('authentication').tokenHandler;
        if(!user && token && tokenHandler){
            console.log('Searching user '+token);
            try{
                let base:string = ConfigurationHelper.getInstance().getProperty('base_url');
                let Handler:any = require(Path.join(base,tokenHandler));
                let handle:AbstractTokenAuthentication = new Handler();
                user = handle.authenticate(token,request);
            }catch(e){
                return false;
            }
        }
        return !!user;
    }
    isAllowed(request:ServerRequest, response:ServerResponse):boolean{
        return true;
    }
}