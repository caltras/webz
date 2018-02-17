export class BaseController{
    protected path:string;
    constructor(p:string){
        this.path = p;
    }
    setPath(p:string){
        this.path = p;
    }
    getPath():string{
        return this.path;
    }
}