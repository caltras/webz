import { SecurityInterface } from "./security.interface.filter";
import { ServerRequest, ServerResponse } from "http";
import { Order, Filter, Inject } from "../decorators";
import { ConfigurationHelper} from '../helpers/configuration.helper';
import { HtmlEngineFactory } from "../helpers/html.engine.helper";

@Filter()
@Order(-1)
export class Security extends SecurityInterface{
    
    @Inject()
    private configurationHelper:ConfigurationHelper;
    
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
        }
        this.next(request,response);
    }
    isAuthenticate(request:ServerRequest, response:ServerResponse):boolean{
        return true;
    }
    isAllowed(request:ServerRequest, response:ServerResponse):boolean{
        return true;
    }
}