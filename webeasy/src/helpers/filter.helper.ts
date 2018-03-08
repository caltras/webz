import * as fs from 'fs';
import * as Path from 'path';
import { Filter } from '../filters';
export class FilterNotFoundException extends Error{
    constructor(e:any){
        super("Filter not Found: "+e.message);
    }
}
export class FilterHelper{
    private static instance:FilterHelper;
    public filters:any[] = [];
    public rootFilter:Filter;
    public static getInstance():FilterHelper{
        if(!FilterHelper.instance){
            FilterHelper.instance = new FilterHelper();
        }
        return FilterHelper.instance;
    }
    
    public load(files:string[]){
        let lastFilter:Filter;
        try{
            files.forEach((f:string)=>{
                let file = require(Path.relative(__dirname,f));
                Object.keys(file).forEach((clazz:any)=>{
                    let filter = new file[clazz]();
                    if(lastFilter){
                        lastFilter.setNext(filter);
                    }
                    if(!this.rootFilter){
                        this.rootFilter = filter;
                    }
                    lastFilter = filter;
                    this.filters.push(lastFilter);
                })
            });
        }catch(e){
            throw new FilterNotFoundException(e.message);
        }
    }
    get filter(){
        return this.filters;
    }
    hasFilters():boolean{
        return this.filters.length>0;
    }
    public addFilter(filter:any|any[]){
        if(filter instanceof Array){
            this.filters = this.filters.concat(filter);
        }else{
            this.filters.push(filter);
        }
    }
    public async doFilter(req:any,resp:any){
        this.rootFilter.doFilter(req,resp);
    }
}