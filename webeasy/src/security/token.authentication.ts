import { User } from './user';

export abstract class AbstractTokenAuthentication{
    
    abstract getUserByToken(token:string):User;
    abstract authenticate(token:string,request:any):User;

}