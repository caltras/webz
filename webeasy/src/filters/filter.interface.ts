import { ServerResponse, ServerRequest } from "http";

export abstract class Filter {
    public order:Number=1;
    protected sibling:Filter;
    
    abstract doFilter(request:ServerRequest, response:ServerResponse):void;
    protected next(request:ServerRequest, response:ServerResponse){
        if(this.sibling!=null){
            this.sibling.doFilter(request,response);
        }
    }
    public setNext(s:Filter){
        this.sibling = s;
    }
}