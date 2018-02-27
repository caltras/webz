export function Singleton(target:any){
    target.instance = null;
    target.getInstance = ()=>{
        if(!target.instance){
            target.instance = new target();
        }
        return target.instance;
    };
    return target;
}