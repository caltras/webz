import {RequestHandler,SessionOptions} from 'client-sessions';
import { ServerRequest } from 'http';
import { User } from '../security/user';
export class SessionHelper{
    
    private static instance:SessionHelper;
    public session:RequestHandler;
    public options:SessionOptions;
    public properties:string[] = [];

    static getInstance():SessionHelper{
        if(!SessionHelper.instance){
            SessionHelper.instance = new SessionHelper();
        }
        return SessionHelper.instance;
    }
    setUser(request:any,user:User){
        this.properties.push("user");
        return request[this.options.cookieName].user = user;
    }
    getAuthenticateUser(request:any):User{
        return request[this.options.cookieName].user;
    }
    invalidateSession(request:any){
        this.properties.forEach((p)=>{
            delete request[this.options.cookieName][p];
        });
    }
    addProperty(request:any,p:string,value:any){
        if(this.properties.indexOf(p) ==-1){
            this.properties.push(p);
        }
        request[this.options.cookieName][p] = value;
    }
    getProperty(request:any,p:string){
        return request[this.options.cookieName][p];
    }
}
export class OptionsSession implements SessionOptions{
    secret = 'QEviN7VGszXX';
    cookieName = 'webZSession';
    //duration = Number(24*60*60*1000);
    duration = Number(60*1000);
}