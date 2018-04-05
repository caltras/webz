import {LoginHandlerAbstract} from 'webeasy/security/login.handler';
import { ServerRequest, ServerResponse } from 'http';
import { User } from 'webeasy/security/user';
import * as Lodash from 'lodash';
import * as crypto from 'crypto';
import { I18nHelper } from 'webeasy/i18n/i18n.helper';

let users:Array<User> = new Array<User>();
let u = new User();
u.password = crypto.createHash('md5').update('123').digest('hex');
u.user = 'abc'
u.token = crypto.randomBytes(64).toString('hex');
users.push(u);

export { users }

export class Login extends LoginHandlerAbstract{
    
    login(request:ServerRequest,response:ServerResponse,user:User):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            if(user.isValid()){
                let u = Lodash.find(users,{'user':user.user});
                if(!!u){
                    resolve(u);
                }else{
                    reject(I18nHelper.getProperty('authorization').userPasswordWrong);
                }
            }else{
                reject(I18nHelper.getProperty('authorization').invalid);
            }
        })
    }
    signup(request:ServerRequest,response:ServerResponse,user:User):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            if(user.isValid()){
                let u = Lodash.find(users,{'user':user.user});
                if(!u){
                    user.password = this.cryptoPassword(user.password);
                    user.token = this.generateToken();
                    users.push(user);
                    resolve(user);
                }else{
                    reject(I18nHelper.getProperty('authorization').userExists);
                }
            }else{
                reject(I18nHelper.getProperty('authorization').invalid);
            }
            
        })
    }
    private cryptoPassword(pass:string){
        return crypto.createHash('md5').update(pass).digest('hex');
    }
    private generateToken(){
        return crypto.randomBytes(64).toString('hex');
    }
}