import { User } from "./user";
import { ServerRequest, ServerResponse } from "http";
import { SessionHelper } from '../helpers/session.helper';
import { ConfigurationHelper } from "../helpers/configuration.helper";

export abstract class LoginHandlerAbstract{
    abstract login(request:ServerRequest,response:ServerResponse,user:User):Promise<User>;
    abstract signup(request:ServerRequest,response:ServerResponse,user:User):Promise<User>;

    success(request:ServerRequest,response:ServerResponse,user:User):void{
        SessionHelper.getInstance().setUser(request,user);
        console.log(ConfigurationHelper.getInstance().getProperty("redirect").welcome);
        response.writeHead(301,{
            Location: ConfigurationHelper.getInstance().getProperty("redirect").welcome
        });
        response.end();
    }
    failure(response:ServerResponse):void{
        response.writeHead(301,{
            Location: ConfigurationHelper.getInstance().getProperty("redirect").login
        });
        response.end();
    }
}

export class LogindHelper{
    private static instance:LogindHelper;
    public handle:LoginHandlerAbstract;
    
    public static getInstance():LogindHelper{
        if(!LogindHelper.instance){
            LogindHelper.instance = new LogindHelper();
        }
        return LogindHelper.instance;
    }
    getHandle():LoginHandlerAbstract{
        return this.handle;
    }
    setHandle(h:LoginHandlerAbstract){
        this.handle = h;
    }
    static login(request:ServerRequest,response:ServerResponse,user:User):Promise<any>{
        return LogindHelper.getInstance().handle.login(request,response, user).then((result)=>{
            LogindHelper.getInstance().handle.success(request,response,result);
        }).catch(()=>{
            LogindHelper.getInstance().handle.failure(response);
        });
    }
}