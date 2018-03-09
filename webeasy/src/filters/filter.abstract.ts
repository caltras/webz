import { ServerResponse, ServerRequest } from "http";
import * as filterDebug from 'debug';

const debug = filterDebug("filter");

export abstract class Filter {
    protected sibling:Filter;
    
    abstract doFilter(request:ServerRequest, response:ServerResponse):void;
    protected next(request:ServerRequest, response:ServerResponse){
        console.log("#"+this+" - "+this.constructor.name);
        if(this.sibling!=null && !response.finished){
            this.sibling.doFilter(request,response);
        }
    }
    public setNext(s:Filter){
        this.sibling = s;
    }
}