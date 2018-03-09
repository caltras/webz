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

        let order:number = 1;
        try{
            files.forEach((f:string)=>{
                let file = require(Path.relative(__dirname,f));
                Object.keys(file).forEach((clazz:any)=>{
                    let filter = new file[clazz]();
                    if(filter.__isFilter){
                        if(!filter.hasOrder){
                            filter.__order = order;
                        }
                        this.filters.push(filter);
                        order++;
                    }
                    
                })
            });

            this.filters.sort((a:any,b:any)=>{ 
                return a.__order >= b.__order? 1: -1;
            }).forEach((f:Filter)=>{
                if(!lastFilter){
                    lastFilter = f;
                    this.rootFilter=f;
                }else{
                    lastFilter.setNext(f);
                    lastFilter = f;
                }
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