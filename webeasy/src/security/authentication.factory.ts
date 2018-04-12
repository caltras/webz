import { AuthenticationInterface } from "./authentication.interface";
import { BasicAuthentication } from "./basic.authentication";
import { TokenAuthentication } from "./token.authentication";

export class AuthenticationFactory{
    static create(type:string,value:string):AuthenticationInterface{
        switch(type.toLowerCase()){
            case 'token':
            case 'bearer':
                return new TokenAuthentication(type,value);
            case 'basic':
                return new BasicAuthentication(type,value);
            default:
                throw new Error('Authentication type not found');
        }
    }
}