import { Filter } from "webeasy/filters/filter.interface";
import { ServerRequest, ServerResponse } from "http";

export class TestFilter extends Filter{
    constructor(){
        super();
    }
    doFilter(request:ServerRequest,response:ServerResponse){
        console.log("#"+this.order+" - Test Filter")
        this.next(request,response);
        //response.end("Parou");
    }
}