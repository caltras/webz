import { AbstractFilter } from "./filter.abstract";
import { ServerRequest, ServerResponse } from "http";
import {FilterHelper} from '../helpers/filter.helper';
import { Server } from "tls";

export abstract class SecurityInterface extends AbstractFilter{
    abstract isAuthenticate(request:ServerRequest, response:ServerResponse):boolean;
    abstract isAllowed(request:ServerRequest,response:ServerResponse):boolean;
    checkSecurityexceptions(request:ServerRequest){
        let helperInstance = FilterHelper.getInstance();
        return helperInstance.checkExceptions(request.url);
    }
}