export function Filter(params:any){
    return function(target:any){
        return target;
    }
}
export function Order(param:number){
    return function(target:any){
        target.constructor.order = param;
    }
}