import { Filter } from ".";
import { ServerRequest, ServerResponse } from "http";

export abstract class SecurityInterface extends Filter{
    abstract isAuthenticate():boolean;
}