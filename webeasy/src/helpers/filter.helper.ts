import * as fs from 'fs';
import * as Path from 'path';
import { AbstractFilter } from '../filters';
import * as filterDebug from 'debug';
import { ServerRequest, ServerResponse } from 'http';
import * as Lodash from 'lodash';
import { SessionHelper } from './session.helper';
import { UrlToPattern } from '../parsers';

const debug = filterDebug("filter");

export class FilterNotFoundException extends Error{
    constructor(e:any){
        super("Filter not Found: "+e.message);
    }
}
export class FilterHelper{
    private static instance:FilterHelper;
    public filters:any[] = [];
    public rootFilter:AbstractFilter;
    public exceptions:any = [];
    private urlExceptions:any = {}
    public securityFilter:any = {};
    public urlRoles:any = {};

    public static getInstance():FilterHelper{
        if(!FilterHelper.instance){
            FilterHelper.instance = new FilterHelper();
        }
        return FilterHelper.instance;
    }
    
    public load(files:string[]){
        let order:number = 1;
        try{
            files.forEach((f:string)=>{
                let file = require(Path.relative(__dirname,f));
                Object.keys(file).forEach((clazz:any)=>{
                    let filter = new file[clazz]();
                    if(filter.constructor.__isFilter){
                        if(!filter.constructor.hasOrder){
                            filter.constructor__order = order;
                        }
                        this.filters.push(filter);
                        order++;
                    }
                    
                })
            });
            this.sortingFilters();
            
        }catch(e){
            throw new FilterNotFoundException(e.message);
        }
    }
    sortingFilters(){
        this.rootFilter = null;
        let lastFilter:AbstractFilter;
        this.filters.sort((a:any,b:any)=>{ 
            if(!a.constructor.__order){
                return 1;
            }
            return a.constructor.__order >= b.constructor.__order? 1: -1;
        }).forEach((f:AbstractFilter)=>{
            if(!lastFilter){
                lastFilter = f;
                this.rootFilter=f;
            }else{
                lastFilter.setNext(f);
                lastFilter = f;
            }
        });
    }
    get filter(){
        return this.filters;
    }
    hasFilters():boolean{
        return this.filters.length>0;
    }
    public addFilter(filter:AbstractFilter|AbstractFilter[]){
        if(filter instanceof Array){
            this.filters = this.filters.concat(filter);
        }else{
            this.filters.push(filter);
        }
    }
    public async doFilter(req:ServerRequest,resp:ServerResponse,config:any){
        if(!this.checkExceptions(req.url)){
            debug("Starting process filter...");
            this.rootFilter.doFilter(req,resp);
            debug("Finishing process filter.");
        }else{
            let redirect = config.redirect.login;
            if(redirect!=="/"){
                redirect = redirect.replace(/\/$/,"");
            }
            let isLogin:boolean = UrlToPattern.convert(redirect).regexp.test(req.url);
            if(isLogin && !!SessionHelper.getInstance().getAuthenticateUser(req)){
                resp.writeHead(301,{
                    Location: (config.redirect.welcome)
                });
                resp.end();
            }else{
                debug("%s is exception to filter",req.url);
            }
        }
    }
    public processUrlAsRegExp(e:string){
        let characters = {
            "[*]":"(.*)?",
        }
        let isNotAnyCharacterStart = e.charAt(0) !== "*";
        let isNotAnyCharacterFinal = e.charAt(e.length-1) !== "*";
        if(isNotAnyCharacterStart){
            e ="^"+e;
        }
        if(isNotAnyCharacterFinal){
            e+="$"; 
        }
        Lodash.each(characters,(v,k)=>{
            let expression = new RegExp(k,"g");
            e = e.replace(expression,v);
        });
        return e;
    }
    public checkExceptions(url:string){
        if(this.urlExceptions.hasOwnProperty(url)){ 
            return this.urlExceptions[url];
        }
        
        let isException = false;

        for(let i=0;i<this.exceptions.length;i++){
            debug("Testing %s to url %s",this.exceptions[i],url);
            isException = new RegExp(this.exceptions[i]).test(url);
            this.urlExceptions[url] = isException;
            if(isException){              
                return isException;
            }
        }
        return isException;    
    }
}