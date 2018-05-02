import { AbstractFilter } from "webeasy/filters";
import {Filter, Order} from "webeasy/decorators/index";
import { ServerRequest, ServerResponse } from "http";

@Filter()
@Order(10)
export class TestFilter extends AbstractFilter{
    constructor(){
        super();
    }
    doFilter(request:ServerRequest,response:ServerResponse){
        this.next(request,response);
    }
}