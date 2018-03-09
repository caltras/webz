import { SecurityInterface } from "./security.interface.filter";
import { ServerRequest, ServerResponse } from "http";
import { Order, Filter } from "../decorators";

@Filter()
@Order(-1)
export class Security extends SecurityInterface{
    constructor(){
        super();
    }
    doFilter(request:ServerRequest, response:ServerResponse){
        this.next(request,response);
    }
    isAuthenticate():boolean{
        return true;
    }
}