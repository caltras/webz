import * as fs from 'fs';

export class BodyParameter{
    private data:any;

    setData(obj:any){
        this.data = obj;
    }
    getData():any{
        return this.data;
    }
}
export class FormParameter extends BodyParameter{
    private files:any[] = [];

    addFile(obj:any){
        this.files.push(obj);
    }
    setFiles(obj:any[]){
        this.files = this.files.concat(obj)
    }
    getFiles():any[]{
        return this.files;
    }
    copyFiles(path:string){
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        this.files.forEach((file)=>{
            if(fs.existsSync(file.path)){
                fs.copyFileSync(file.path,path+"/"+file.name);
            }
        });
    }
}