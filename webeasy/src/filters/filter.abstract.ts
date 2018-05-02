import { ServerResponse, ServerRequest } from "http";
import * as filterDebug from 'debug';
import { SessionHelper } from "../helpers/session.helper";

const debug = filterDebug("filter");

export abstract class AbstractFilter {
    protected sibling:AbstractFilter;
    
    abstract doFilter(request:ServerRequest, response:ServerResponse):void;
    protected next(request:ServerRequest, response:ServerResponse){
        debug("Filter ["+this.constructor.name+"]");
        SessionHelper.getInstance().addProperty(request,"last_visited",request.url);
        if(this.sibling!=null && !response.finished){
            this.sibling.doFilter(request,response);
        }
    }
    public setNext(s:AbstractFilter){
        this.sibling = s;
    }
}