import { AbstractTokenAuthentication } from "webeasy/security/abstract.token.authentication";
import { User } from "webeasy/security/user";
import * as login from "../security/login";
import * as Lodash from 'lodash';
import { BasicAuthentication } from "../../../webeasy/dist/security/basic.authentication";
import * as crypto from 'crypto';
import { SessionHelper } from "webeasy/helpers/session.helper";

class TokenAuthentication extends AbstractTokenAuthentication{

    authenticateByToken(token:string):User{5
        return Lodash.find(login.users,{token:token});
    }
    getUserByUserAndPassword(authInterface:BasicAuthentication):User{
        let credentials:any = authInterface.getCredentials();
        let pass:string = crypto.createHash('md5').update(credentials.password).digest('hex');
        let user:User = Lodash.find(login.users,{user:credentials.user,pass:pass});
        if(user){
            return user;
        }else{
            return null;
        }
    }
}

module.exports = TokenAuthentication;