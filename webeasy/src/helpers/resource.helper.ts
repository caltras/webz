import { ServerRequest, ServerResponse } from "http";
import * as fs from 'fs';
import * as Path from 'path';

export class ResourceHelper{
    private static instance:ResourceHelper;
    private resources:string[];
    public static getInstance():ResourceHelper{
        if(!ResourceHelper.instance){
            ResourceHelper.instance = new ResourceHelper();
        }
        return ResourceHelper.instance;
    }
    public setResources(resources:string[]){
        this.resources = resources;
    }
    public getResources():string[]{
        return this.resources;
    }
    public isResource(url:string):boolean{
        let valid = false;
        for(var i=0;i<this.resources.length;i++){
            if(url.indexOf(this.resources[i]) > -1){
                valid = true;
                break;
            }
        }
        return valid;
    }
    public checkIsAllowResource(rsc:string):boolean{
        return this.resources.indexOf(rsc) > -1;
    }
    public doFilter(req:ServerRequest,resp:ServerResponse,config:any){
        if(this.isResource(req.url)){
            let filePathFramework = Path.join(__dirname,"../",req.url);
            let filePath = Path.join(config.base_url,req.url);
            if(fs.existsSync(filePath)){
                resp.statusCode = 200;
                resp.end(fs.readFileSync(filePath,"utf-8").toString());
            }else{
                if(fs.existsSync(filePathFramework)){
                    resp.statusCode = 200;
                    resp.end(fs.readFileSync(filePathFramework,"utf-8").toString());
                }else{
                    resp.statusCode = 404;
                    resp.end("It wasn't possible find the resource "+filePath);
                }
            }
        }
    }
}