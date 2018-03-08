import { SecurityInterface } from "./security.interface.filter";
import { ServerRequest, ServerResponse } from "http";

export class Security extends SecurityInterface{
    constructor(){
        super();
    }
    doFilter(request:ServerRequest, response:ServerResponse){
        console.log("#"+this.order+" - Security Filter");
        this.next(request,response);
    }
    isAuthenticate():boolean{
        return true;
    }
}