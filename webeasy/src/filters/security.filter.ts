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
import { FilterHelper } from "../helpers/filter.helper";

export class SecurityException extends Error{
    constructor(msg:string){
        super(msg);
    }
};
export class NotAllowedException extends SecurityException{
    constructor(){
        super("User doesn't have permission to access the page");
    }
}
export class NotAuthenticateException extends SecurityException{
    constructor(){
        super("User isn't authenticate");
    }
}
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
        try{
            if(!super.checkSecurityexceptions(request)){
                this.isAuthenticate(request,response);
                this.isAllowed(request,response);
            }else{
                if(request.url === this.configurationHelper.getProperty("redirect").login){
                    response.writeHead(301,{
                        Location: (this.configurationHelper.getProperty("redirect").login)
                    });
                    response.end();
                    return;
                }
            }
            this.next(request,response);
        }catch(e){
            if(e instanceof NotAllowedException){
                response.statusCode = 403;
                let engine = HtmlEngineFactory.create(this.configurationHelper.getConfiguration());
                let errorCfg = this.configurationHelper.getProperty("error");
                var page = engine.render((this.configurationHelper.getProperty("base_url") || __dirname),errorCfg["403"],{});
                response.end(page);
                return;
            }
            if(e instanceof NotAuthenticateException){
                response.writeHead(301,{
                    Location: (this.configurationHelper.getProperty("redirect").login)
                });
                response.end();
                return;
            }
            response.statusCode = 500;
            let engine = HtmlEngineFactory.create(this.configurationHelper.getConfiguration());
            let errorCfg = this.configurationHelper.getProperty("error");
            var page = engine.render((this.configurationHelper.getProperty("base_url") || __dirname),errorCfg["500"],{});
            response.end(page);
            return;
        }
    }
    isAuthenticate(request:ServerRequest, response:ServerResponse):boolean{
        let token:any = request.headers["authorization"];
        let user:User = SessionHelper.getInstance().getAuthenticateUser(request);
        let tokenHandler = ConfigurationHelper.getInstance().getProperty('authentication').tokenHandler;
        if(!user && token && tokenHandler){
            this.logger('Searching user '+token);
            try{
                let base:string = ConfigurationHelper.getInstance().getProperty('base_url');
                let Handler:any = require(Path.join(base,tokenHandler));
                let handle:AbstractTokenAuthentication = new Handler();
                user = handle.authenticate(token,request);
            }catch(e){
                throw new NotAuthenticateException();
            }
        }
        if(!user){
            throw new NotAuthenticateException();
        }
        return !!user;
    }
    checkNegativeRoles(url:string, userRoles:string[]):boolean{
        let allowed =true;
        //[!MANAGER]
        let negativeRolesInUrl = FilterHelper.getInstance().urlRoles[url].filter((r:string)=>{
            return r.indexOf("!") > -1;
        }).map((r:string)=>{
            return r.replace("!","");
        });
        if(negativeRolesInUrl.length>0){
            //[MANAGER]
            userRoles.forEach((r:string,index:number)=>{
                if(allowed && negativeRolesInUrl.indexOf(r) > -1){
                    allowed=false;
                    return true;
                }else{
                    return false;
                }
            });    
        }
        return allowed;
    }
    checkPositive(url:string,userRoles:string[]):boolean{
        let allowed:boolean = false;
        userRoles.forEach((r:string,index:number)=>{
            if(!allowed){
                allowed = FilterHelper.getInstance().urlRoles[url].indexOf(r) > -1;
                return true;
            }else{
                return false;
            }
        });
        return allowed;
    }
    isAllowed(request:ServerRequest, response:ServerResponse):boolean{
        let user:User = SessionHelper.getInstance().getAuthenticateUser(request);
        let allowed=true;
        if(FilterHelper.getInstance().urlRoles[request.url]){
            allowed = this.checkPositive(request.url,user.roles) && this.checkNegativeRoles(request.url,user.roles);
            if(!allowed){
                throw new NotAllowedException();
            }
        }
        return allowed;
    }
}