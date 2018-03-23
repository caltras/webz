import { AbstractFilter } from "./filter.abstract";
import { ServerRequest, ServerResponse } from "http";

export abstract class SecurityInterface extends AbstractFilter{
    abstract isAuthenticate():boolean;
}