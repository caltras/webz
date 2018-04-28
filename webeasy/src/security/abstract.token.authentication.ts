import { User } from './user';
import { AuthenticationInterface } from "./authentication.interface";
import { NotAuthenticateException } from '../filters';
import { TokenAuthentication } from './token.authentication';
import { BasicAuthentication } from './basic.authentication';
import { SessionHelper } from '../helpers/session.helper';
import { AuthenticationFactory } from './authentication.factory';

export abstract class AbstractTokenAuthentication{
    
    protected tokenSessions:any={};
    abstract getUserByUserAndPassword(authInterface:BasicAuthentication):User;
    abstract authenticateByToken(token:string):User;
    
    getUserByToken(authInterface:TokenAuthentication):User{
        if(this.tokenSessions.hasOwnProperty(authInterface.token)){
            return this.tokenSessions[authInterface.token];
        }else{
            let user:User = this.authenticateByToken(authInterface.token);
            if(user){
                return user;
            }else{
                throw new NotAuthenticateException();
            }
        }
    }
    getUser(authInterface:AuthenticationInterface):User{
        if(authInterface instanceof TokenAuthentication){
            return this.getUserByToken(authInterface);
        }else{
            if(authInterface instanceof BasicAuthentication){
                return this.getUserByUserAndPassword(authInterface);
            }
        }
        return null;
    }
    authenticate(token:string,request:any):User{
        let session:SessionHelper = SessionHelper.getInstance();
        let user:User = this.getUser(this.defineAuthentication(token));
        if(user){
            if(request){
                session.setUser(request,user);
                this.tokenSessions[user.token] = session.getSession(request);
            }else{
                console.warn("Request is null. User won't be put in session");
            }
            return user;
        }else{
            throw new NotAuthenticateException();
        }  
    }
    defineAuthentication(token:string):AuthenticationInterface{
        let splitToken:string[] = token.split(" ");
        let tokenObject:AuthenticationInterface  = AuthenticationFactory.create(splitToken[0],splitToken[1]);
        return tokenObject;
    }

}