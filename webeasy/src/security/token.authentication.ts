import { AuthenticationInterface } from "./authentication,interface";

export class TokenAuthentication implements AuthenticationInterface{
    type:string;
    value:string;
    token:string;

    constructor(type:string,value:string){
        this.type = type;
        this.value = value;
    }
    getCredentials():any{
        return this.value;
    }

}