import * as _ from 'lodash';
import { Parser } from '../parsers';
import { Request, Response } from '../controller';

export class MethodWrapper{
    private clazz:any;
    private req:any;
    private resp:any;
    private pattern:any;
    constructor(clazz:any,request:any,response:any,pattern:any){
        this.clazz = clazz;
        this.req = request as Request;
        this.resp = response as Response;
        this.pattern = pattern;
        let p:Parser = new Parser().parse(this.req.url,this.pattern);
        this.req.parameters = p.parameters();
        this.req.query = p.queryString();
    }
    get response(){
        return this.resp;
    }
    get request(){
        return this.req;
    }
    get target(){
        return this.clazz;
    }
}