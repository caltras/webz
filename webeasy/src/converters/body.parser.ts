import { IncomingMessage } from "http";
import { BodyParameter, FormParameter } from "../controller";
import * as Formidable from 'formidable';
import * as Lodash from 'lodash';

interface Parser{
    convert(request:IncomingMessage):any;
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
                parameter.setData(JSON.parse(body));
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
        if(headers["content-type"].indexOf("application/json")>-1){
            return await bodyParser.convertToJSON(request);
        }else{
            if(headers["content-type"].indexOf("multipart/form-data") > -1){
                return await bodyParser.convertToForm(request);
            }
        }
        
        return;
        
    }
    async convertToJSON(request:IncomingMessage){
        return await new JSONParser().convert(request);
    }
    async convertToForm(request:IncomingMessage){
        return await new FormParser().convert(request);
    }
}