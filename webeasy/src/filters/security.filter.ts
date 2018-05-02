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
import { I18nHelper } from "../i18n/i18n.helper";
import { SecurityHelper } from "../helpers/security.helper";

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
    @Inject() 
    private securityHelper:SecurityHelper;

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
                var page = engine.render((this.configurationHelper.getProperty("base_url") || __dirname),errorCfg["403"],{error: I18nHelper.getProperty("error")["403"]});
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
            var page = engine.render((this.configurationHelper.getProperty("base_url") || __dirname),errorCfg["500"],{message:e.message, error: I18nHelper.getProperty("error")["500"]});
            response.end(page);
            return;
        }
    }
    isAuthenticate(request:ServerRequest, response:ServerResponse):boolean{
        return this.securityHelper.isAuthenticate(request,response);
    }
    isAllowed(request:ServerRequest, response:ServerResponse):boolean{
        return this.securityHelper.isAllowed(request,response);
    }
}