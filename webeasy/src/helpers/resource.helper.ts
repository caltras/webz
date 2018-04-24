import { ServerRequest, ServerResponse, Server } from "http";
import * as fs from 'fs';
import * as Path from 'path';
import { ContentType, ContentTypeHelper } from "./controller.helper";

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
                resp.writeHead(200,{'Content-type': this.defineContentType(req)});
                resp.end(fs.readFileSync(filePath,"utf-8").toString());
            }else{
                if(fs.existsSync(filePathFramework)){
                    resp.writeHead(200,{'Content-type': this.defineContentType(req)});
                    resp.end(fs.readFileSync(filePathFramework,"utf-8").toString());
                }else{
                    resp.statusCode = 404;
                    resp.end("It wasn't possible find the resource "+filePath);
                }
            }
        }
    }
    public defineContentType(req:ServerRequest):string{
        let parts = req.url.split(".");
        return ContentTypeHelper.getContentTypeBySufix(parts[parts.length-1]);
    }
}