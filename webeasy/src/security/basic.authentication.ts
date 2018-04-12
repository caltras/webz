import { AuthenticationInterface } from "./authentication.interface";

export class BasicAuthentication implements AuthenticationInterface{
    type:string;
    value:string;
    user:string;
    password:string;

    constructor(type:string,value:string){
        this.type = type;
        this.value = value;

    }
    getCredentials():any{
        let credentialArray =  new Buffer(this.value,'base64').toString('binary').split(":");
        this.user = credentialArray[0];
        this.password = credentialArray[1];
        return {user:this.user,password:this.password};
    }

}