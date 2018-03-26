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
        if(!super.checkSecurityexceptions(request)){
            console.log("check security");
            if(!this.isAuthenticate(request,response)){
                response.statusCode = 403;
                response.end();
            }
        }
        this.next(request,response);
    }
    isAuthenticate(request:ServerRequest, response:ServerResponse):boolean{
        return true;
    }
}