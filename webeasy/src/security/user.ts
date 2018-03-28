export class User{
    public token:string;
    public user:string;
    private pass:string;
    public roles:string[];
    
    get password(){
        return "*****";
    }
    set password(p:string){
        this.pass = p;
    }
}