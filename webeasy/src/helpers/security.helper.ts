import { ServerRequest, ServerResponse } from "http";
import { SessionHelper, ConfigurationHelper, FilterHelper } from ".";
import { User } from "../security/user";
import { AbstractTokenAuthentication } from "../security/abstract.token.authentication";
import { NotAuthenticateException, NotAllowedException } from "../filters/security.filter";
import * as Path from 'path';
import * as debug from 'debug';
import { Injectable } from "../decorators";

@Injectable()
export class SecurityHelper{
    
    private logger = debug('security.helper');
    authenticate(token:string){
        let tokenHandler = ConfigurationHelper.getInstance().getProperty('authentication').tokenHandler;
        try{
            let base:string = ConfigurationHelper.getInstance().getProperty('base_url');
            let Handler:any = require(Path.join(base,tokenHandler));
            let handle:AbstractTokenAuthentication = new Handler();
            let user:User = handle.authenticate(token,null);
            return user;
        }catch(e){
            throw new NotAuthenticateException();
        }
    }
    isAuthenticate(request:ServerRequest, response:ServerResponse):boolean{
        let token:any = request.headers["authorization"];
        let user:User = SessionHelper.getInstance().getAuthenticateUser(request);
        let tokenHandler = ConfigurationHelper.getInstance().getProperty('authentication').tokenHandler;
        if(!user && token && tokenHandler){
            this.logger('Searching user '+token);
            try{
                let base:string = ConfigurationHelper.getInstance().getProperty('base_url');
                let Handler:any = require(Path.join(base,tokenHandler));
                let handle:AbstractTokenAuthentication = new Handler();
                user = handle.authenticate(token,request);
            }catch(e){
                throw new NotAuthenticateException();
            }
        }
        if(!user){
            throw new NotAuthenticateException();
        }
        return !!user;
    }
    checkNegativeRoles(url:string, userRoles:string[]):boolean{
        let allowed =true;
        //[!MANAGER]
        let negativeRolesInUrl = FilterHelper.getInstance().urlRoles[url].filter((r:string)=>{
            return r.indexOf("!") > -1;
        }).map((r:string)=>{
            return r.replace("!","");
        });
        if(negativeRolesInUrl.length>0){
            //[MANAGER]
            userRoles.forEach((r:string,index:number)=>{
                if(allowed && negativeRolesInUrl.indexOf(r) > -1){
                    allowed=false;
                    return true;
                }else{
                    return false;
                }
            });    
        }
        return allowed;
    }
    checkPositive(url:string,userRoles:string[]):boolean{
        let allowed:boolean = false;
        userRoles.forEach((r:string,index:number)=>{
            if(!allowed){
                allowed = FilterHelper.getInstance().urlRoles[url].indexOf(r) > -1;
                return true;
            }else{
                return false;
            }
        });
        return allowed;
    }
    isAllowed(request:ServerRequest, response:ServerResponse):boolean{
        let user:User = SessionHelper.getInstance().getAuthenticateUser(request);
        let allowed=true;
        if(FilterHelper.getInstance().urlRoles[request.url]){
            allowed = this.checkPositive(request.url,user.roles) && this.checkNegativeRoles(request.url,user.roles);
            if(!allowed){
                throw new NotAllowedException();
            }
        }
        return allowed;
    }
}