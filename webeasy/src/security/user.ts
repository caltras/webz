import { ConfigurationHelper } from "../helpers/configuration.helper";

export class User{
    public token:string;
    public user:string;
    private pass:string;
    public roles:string[]=[];

    constructor(data?:any){
        if(data){
            this.user = data.user;
            this.password = data.password;
            this.roles = data.roles;
            this.token = data.token;
        }
    }
    
    get password(){
        return "*****";
    }
    set password(p:string){
        this.pass = p;
    }
    isValid(){
        return !!this.user && !!this.pass && this.checkPasswordRole();
    }
    checkPasswordRole(){
        let role:RegExp = ConfigurationHelper.getInstance().getProperty('authentication').passwordRole;
        if(role){
            return role.test(this.pass);
        }else{
            return true;
        }
    }
}