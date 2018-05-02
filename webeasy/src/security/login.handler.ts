import { User } from "./user";
import { ServerRequest, ServerResponse } from "http";
import { SessionHelper } from '../helpers/session.helper';
import { ConfigurationHelper } from "../helpers/configuration.helper";

export abstract class LoginHandlerAbstract{
    abstract login(request:ServerRequest,response:ServerResponse,user:User):Promise<any>;
    abstract signup(request:ServerRequest,response:ServerResponse,user:User):Promise<any>;

    success(request:ServerRequest,response:ServerResponse,user:User):void{
        SessionHelper.getInstance().setFlashMessage(request,'','error');
        SessionHelper.getInstance().setUser(request,user);
        response.writeHead(301,{
            Location: ConfigurationHelper.getInstance().getProperty("redirect").welcome
        });
        response.end();
    }
    failure(request:ServerRequest,response:ServerResponse,msg:string):void{
        SessionHelper.getInstance().setFlashMessage(request,msg,'error');
        response.writeHead(301,{
            Location: ConfigurationHelper.getInstance().getProperty("redirect").login
        });
        response.end(msg);
    }
    successSignup(request:ServerRequest,response:ServerResponse,user:User):void{
        SessionHelper.getInstance().setFlashMessage(request,'','error');
        SessionHelper.getInstance().setUser(request,user);
        response.writeHead(301,{
            Location: ConfigurationHelper.getInstance().getProperty("redirect").welcome
        });
        response.end();
    }
    failureSignup(request:ServerRequest,response:ServerResponse,msg:string):void{
        SessionHelper.getInstance().setFlashMessage(request,msg,'error');
        response.writeHead(301,{
            Location: ConfigurationHelper.getInstance().getProperty("redirect").login
        });
        response.end(msg);
    }
}

export class LoginHelper{
    private static instance:LoginHelper;
    public handle:LoginHandlerAbstract;
    
    public static getInstance():LoginHelper{
        if(!LoginHelper.instance){
            LoginHelper.instance = new LoginHelper();
        }
        return LoginHelper.instance;
    }
    getHandle():LoginHandlerAbstract{
        return this.handle;
    }
    setHandle(h:LoginHandlerAbstract){
        this.handle = h;
    }
    static login(request:ServerRequest,response:ServerResponse,user:User):Promise<any>{
        return LoginHelper.getInstance().handle.login(request,response, user).then((result)=>{
            LoginHelper.getInstance().handle.success(request,response,result);
        }).catch((error:string)=>{
            LoginHelper.getInstance().handle.failure(request,response,error);
        });
    }
    static signup(request:ServerRequest,response:ServerResponse,user:User):Promise<any>{
        return LoginHelper.getInstance().handle.signup(request,response,user).then((result)=>{
            LoginHelper.getInstance().handle.successSignup(request,response,result);
        }).catch((error:string)=>{
            LoginHelper.getInstance().handle.failureSignup(request,response,error);
        });
    }
}