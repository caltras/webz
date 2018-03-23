import { ServerRequest, ServerResponse } from "http";
import { Order, Filter } from "../decorators";
import {AbstractFilter} from './filter.abstract';

@Filter()
@Order(-2)
export class Cors extends AbstractFilter{
    private corsConfiguration:any;

    constructor(options:any){
        super();
        this.corsConfiguration = options;
    }
    doFilter(request:ServerRequest, response:ServerResponse){
        
        response.setHeader('Access-Control-Allow-Origin', this.corsConfiguration.origin);
        response.setHeader('Access-Control-Allow-Methods', this.corsConfiguration.allowMethods);
        response.setHeader('Access-Control-Allow-Headers', this.corsConfiguration.allowHeaders);
        
        if(this.corsConfiguration.origin !=='*'){
            response.setHeader('Vary', 'Origin');
        }

        if('OPTIONS' === request.method && !this.corsConfiguration.optionsUrl){
            response.statusCode = 200;
            response.end();
        }

        this.next(request,response);
    }
}