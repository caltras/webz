import { AbstractTokenAuthentication } from "webeasy/security/abstract.token.authentication";
import { User } from "webeasy/security/user";
import * as login from "../security/login";
import * as Lodash from 'lodash';
import { BasicAuthentication } from "../../../webeasy/dist/security/basic.authentication";
import * as crypto from 'crypto';
import { SessionHelper } from "webeasy/helpers/session.helper";

class TokenAuthentication extends AbstractTokenAuthentication{

    authenticateByToken(token:string):User{
        return Lodash.find(login.users,{token:token});
    }
    getUserByUserAndPassword(authInterface:BasicAuthentication):User{
        let pass:string = crypto.createHash('md5').update(authInterface.password).digest('hex');
        let user:User = Lodash.find(login.users,{user:authInterface.user,password:pass});
        if(user){
            return user;
        }else{
            return null;
        }
    }
}

module.exports = TokenAuthentication;