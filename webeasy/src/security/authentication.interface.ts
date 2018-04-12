export interface AuthenticationInterface{
    type:string;
    value:string;

    getCredentials():any;
}