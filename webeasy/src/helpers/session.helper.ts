import {RequestHandler,SessionOptions} from 'client-sessions';
import { ServerRequest } from 'http';
import { User } from '../security/user';
import { ConfigurationHelper } from './configuration.helper';
export class SessionHelper{
    
    private static instance:SessionHelper;
    public session:RequestHandler;
    public options:SessionOptions;
    public properties:string[] = [];
    public enabled:boolean = ConfigurationHelper.getInstance().getConfiguration().session.enabled;

    static getInstance():SessionHelper{
        if(!SessionHelper.instance){
            SessionHelper.instance = new SessionHelper();
        }
        return SessionHelper.instance;
    }
    setUser(request:any,user:User){
        this.properties.push("user");
        if(this.enabled){
            return request[this.options.cookieName].user = user;
        }
    }
    getAuthenticateUser(request:any):User{
        if(this.enabled){
            return request[this.options.cookieName].user;
        }else{
            return null;
        }
    }
    invalidateSession(request:any){
        this.properties.forEach((p)=>{
            delete request[this.options.cookieName][p];
        });
        request[this.options.cookieName].reset(); 
    }
    addProperty(request:any,p:string,value:any){
        if(this.enabled){
            if(this.properties.indexOf(p) ==-1){
                this.properties.push(p);
            }
            request[this.options.cookieName][p] = value;
        }
    }
    getProperty(request:any,p:string){
        if(this.enabled){
            return request[this.options.cookieName][p];
        }else{
            return null;
        }
    }
    setFlashMessage(request:any,msg:string,type:string='info'){
        if(this.enabled){
            request[this.options.cookieName].flash = request[this.options.cookieName].flash || {};
            request[this.options.cookieName].flash[type]=msg;
        }
    }
    static getFlashMessage(request:any,type?:string){
        if(SessionHelper.getInstance().enabled){
            request[SessionHelper.getInstance().options.cookieName].flash = request[SessionHelper.getInstance().options.cookieName].flash || {};
            if(type){
                return request[SessionHelper.getInstance().options.cookieName].flash[type];
            }else{
                return request[SessionHelper.getInstance().options.cookieName].flash;
            }
        }else{
            return null;
        }
    }
    getSession(request:any){
        return request[this.options.cookieName];
    }
}
export class OptionsSession implements SessionOptions{
    config = ConfigurationHelper.getInstance().getConfiguration();
    secret = this.config.session.secret;
    cookieName = this.config.session.name;
    duration = this.config.session.duration;
    isEnabled(){
        return this.config.session.enabled;
    }
}