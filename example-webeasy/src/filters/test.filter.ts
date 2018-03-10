import { Filter } from "webeasy/filters/filter.abstract";
import * as Decorator from "webeasy/decorators/index";
import { ServerRequest, ServerResponse } from "http";

@Decorator.Filter()
@Decorator.Order(10)
export class TestFilter extends Filter{
    constructor(){
        super();
    }
    doFilter(request:ServerRequest,response:ServerResponse){
        this.next(request,response);
    }
}