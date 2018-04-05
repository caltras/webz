import { AbstractTokenAuthentication } from "webeasy/security/abstract.token.authentication";
import { User } from "webeasy/security/user";
import * as login from "../security/login";
import * as Lodash from 'lodash';
import { SessionHelper } from "webeasy/helpers/session.helper";

class TokenAuthentication extends AbstractTokenAuthentication{

    getUserByToken(token:string):User{
        return Lodash.find(login.users,{token:token});
    }
    authenticate(token:string,request:any):User{
        let user:User = SessionHelper.getInstance().getAuthenticateUser(request);
        if(!user){
            let user:User = this.getUserByToken(token);
            if(user){
                SessionHelper.getInstance().setUser(request,user);
                return user;
            }else{
                return null;
            }
        }else{
            return user;
        }    
    }
}

module.exports = TokenAuthentication;