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
        try{
            if(!fs.existsSync(path)){
                fs.mkdirSync(path);
            }
            this.files.forEach((file)=>{
                if(fs.existsSync(file.path)){
                    fs.copyFileSync(file.path,path+"/"+file.name);
                }
            });
        }catch(e){
            throw new Error("IOException: "+e.message);
        }
    }
    copyFilesAsync(path:string){
        let self = this;
        return new Promise((resolve,reject)=>{
            try{
                self.copyFiles(path);
                resolve();
            }catch(e){
                reject(e);
            }
        });
        
    }
}