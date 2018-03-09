export class MethodWrapper{
    private clazz:any;
    private req:any;
    private resp:any;
    constructor(clazz:any,request:any,response:any){
        this.clazz = clazz;
        this.req = request;
        this.resp = response;
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