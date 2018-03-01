import { IncomingMessage } from "http";
import { BodyParameter, FormParameter } from "../controller";
import * as Formidable from 'formidable';
import * as Lodash from 'lodash';

interface Parser{
    convert(request:IncomingMessage):any;
}
class TextParser implements Parser{
    async convert(request:IncomingMessage){
        let parameter:any = new BodyParameter();
        return new Promise((resolve,reject)=>{
            let body="";
            request.on('data',(chunk:any)=>{
                body+=chunk;
            });
            request.on('end',()=>{
                parameter.setData(body);
                resolve(parameter);
            });
        });
    }
}
class JSONParser implements Parser{
    async convert(request:IncomingMessage){
        let parameter:any = new BodyParameter();
        return new Promise((resolve,reject)=>{
            let body="";
            request.on('data',(chunk:any)=>{
                body+=chunk;
            });
            request.on('end',()=>{
                if(body){
                    parameter.setData(JSON.parse(body));
                }
                resolve(parameter);
            });
        });
    }
}
class FormParser implements Parser{
    async convert(request:IncomingMessage){
        let parameter:FormParameter = new FormParameter();
        let form = new Formidable.IncomingForm();
        form.multiples=true;
        return new Promise((resolve,reject)=>{
            form.parse(request,(err,fields,files)=>{
                if(err){
                    reject();
                }
                parameter.setData(fields);
                Lodash.each(files,(item:any)=>{
                    if(item instanceof Array){
                        parameter.setFiles(item);
                    }else{
                        parameter.addFile(item);
                    }
                });
                resolve(parameter);
            });
        });
    }
}
export class BodyParser{

    static async parse(request:IncomingMessage){
        let bodyParser:BodyParser = new BodyParser();
        let headers = request.headers;
        
        if(!headers["content-type"] || headers["content-type"].indexOf("text/plain") > -1){
            if(request.headers["content-length"]){
                return await bodyParser.convertToText(request);
            }else{
                return null;
            }
        }
        if(headers["content-type"].indexOf("application/json")>-1){
            return await bodyParser.convertToJSON(request);
        }
        if(headers["content-type"].indexOf("multipart/form-data") > -1 || headers["content-type"].indexOf("application/x-www-form-urlencoded") > -1){
            return await bodyParser.convertToForm(request);
        }
        
        return;
        
    }
    async convertToText(request:IncomingMessage){
        return await new TextParser().convert(request);
    }
    async convertToJSON(request:IncomingMessage){
        return await new JSONParser().convert(request);
    }
    async convertToForm(request:IncomingMessage){
        return await new FormParser().convert(request);
    }
}