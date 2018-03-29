import {LoginHandlerAbstract} from 'webeasy/security/login.handler';
import { ServerRequest, ServerResponse } from 'http';
import { User } from 'webeasy/security/user';
import * as Lodash from 'lodash';

let users:Array<User> = new Array<User>();
let u = new User();
u.password='123';
u.user = 'abc'
users.push(u);

export class Login extends LoginHandlerAbstract{
    
    login(request:ServerRequest,response:ServerResponse,user:User):Promise<User>{
        return new Promise<User>((resolve,reject)=>{
            let u = Lodash.find(users,{'user':user.user});
            if(!!u){
                resolve(u);
            }else{
                reject(null);
            }
        })
    }
    signup(request:ServerRequest,response:ServerResponse,user:User):Promise<User>{
        return new Promise<User>((resolve,reject)=>{
            users.push(user);
            resolve(user);
        })
    }
}