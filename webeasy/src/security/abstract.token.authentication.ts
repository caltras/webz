import { User } from './user';
import { AuthenticationInterface } from "./authentication,interface";

export abstract class AbstractTokenAuthentication{
    
    abstract getUserByToken(token:string):User;
    abstract authenticate(token:string,request:any):User;
    abstract defineAuthentication(token:string):AuthenticationInterface;

}