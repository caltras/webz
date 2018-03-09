export function Filter(params?:any){
    return function(target:any){
        target.prototype.__isFilter =true;
        return target;
    }
}
export function Order(param:number){
    return function(target:any){
        target.prototype.__order=param;
        target.prototype.hasOrder = true;
        return target;
    }
}