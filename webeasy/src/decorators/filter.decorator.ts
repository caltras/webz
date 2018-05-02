export function Filter(params?:any){
    return function(target:any){
        var get = function(){ return true; }
        var set = function(__isFilter:boolean){ target.__isFilter = true; }
        Object.defineProperty(target,"__isFilter", {
            get: get,
            set: set,
        });
        return target;
    }
}
export function Order(param:number){
    return function(target:any){
        var getHasOrder = function(){ return true }
        var setHasOrder = function(hasOrder:boolean){ target.hasOrder = true; }
        Object.defineProperty(target,"hasOrder", {
            get: getHasOrder,
            set: getHasOrder,
        });
        var getOrder = function(){ return param; }
        var setOrder = function(order:number){ target.hasOrder = param; }
        Object.defineProperty(target,"__order", {
            get: getOrder,
            set: setOrder,
        });
        return target;
    }
}