import { ServerResponse, ServerRequest } from "http";
import * as filterDebug from 'debug';

const debug = filterDebug("filter");

export abstract class AbstractFilter {
    protected sibling:AbstractFilter;
    
    abstract doFilter(request:ServerRequest, response:ServerResponse):void;
    protected next(request:ServerRequest, response:ServerResponse){
        debug("Filter ["+this.constructor.name+"]");
        if(this.sibling!=null && !response.finished){
            this.sibling.doFilter(request,response);
        }
    }
    public setNext(s:AbstractFilter){
        this.sibling = s;
    }
}