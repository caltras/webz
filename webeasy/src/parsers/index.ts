export class UrlToPattern{
    static convert = (map:any)=>{
        var pattern:any = {
            regexp:null,
            fields:[],
        };
        var pieces=map.split("/");
    
        pieces.forEach((p:string)=>{
            arrayPattern+="/";
            if(/:([a-zA-Z0-9]+)/.test(p)){
                var field = p.replace(":","");
                pattern.fields.push(field);
            }
        });
        var arrayPattern = "^"+map.replace(/:([a-zA-Z0-9]+)/g,"([a-zA-Z0-9]+)")+"(((\\/$|\\?|\\/\\?).*)?)$";
        pattern.regexp = new RegExp(arrayPattern);
        return pattern;
    }
}
export class Parser{
    private url:string="";
    private params:any = null;
    private fields:any = null;
    private pattern:any=null;

    constructor(){
        this.url="";
        this.params = null;
        this.fields = null;
        this.pattern=null;
    }
    parse(url:string,pattern:any){
        this.url = url;
        if(pattern){
            this.pattern = pattern;
        }else{
            console.warn("The pattern should be /<domain>/<?:id>, for instance: /users/1. ? is optional.")
            this.params = {};
            var cont = 1;
            var strPattern = "^";
            url.replace(/\?.*$/,"").split("/").forEach((value,index)=>{
                if(index>0){
                    strPattern+="/";
                    if(index%2===0){
                        this.params["field"+cont] = value;
                        cont++;
                        strPattern+="([a-zA-Z0-9]+)";
                    }else{
                        strPattern+=value;
                    }
                }
            });
            strPattern = strPattern+"(((\\/$|\\?|\\/\\?).*)?)$";
            this.pattern = {fields:Object.keys(this.params), regexp: new RegExp(strPattern)};
        }
        
        return this;
    }
    parameters(){
        if(!this.params){
            this.params = {};
            var cont=1;
            var matches = this.url.match(this.pattern.regexp);
            if(matches){
                for(var i=0;i<this.pattern.fields.length;i++){
                    this.params[this.pattern.fields[i]] = matches[cont];
                    cont++;
                }
            }
            
        }
        return this.params;
    }
    queryString(){
        if(!this.fields){
            this.fields ={};
            var q=this.url.split("?");
            if(q.length>1){
                var keyValue = q[1].split("&");
                keyValue.forEach((k)=>{
                    var fieldsValues = k.split("=");
                    if(fieldsValues.length>0){
                        for(var i=0;i<fieldsValues.length;i=i+2){
                            this.fields[fieldsValues[i]] = fieldsValues[i+1];
                        }
                    }
                })
                
            }
        }
        return this.fields;
    }
}