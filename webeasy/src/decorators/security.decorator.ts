import "reflect-metadata";
let FilterHelper = require('../helpers/filter.helper').FilterHelper;

export const SecurityAttribute = {
    permitAll:'PERMIT_ALL',
    role:'ROLE'
}

export const Security = (params:string,role?:string[]|string)=>{
    return (target:any, key:string)=>{
        let methodParams:any = Reflect.getMetadata('design:type:get',target.constructor,key);
        params = params || SecurityAttribute.permitAll;
        let filterHelper = FilterHelper.getInstance();
        switch(params){
            case SecurityAttribute.permitAll:
                filterHelper.exceptions.push(filterHelper.processUrlAsRegExp(methodParams.url));
                break;
            case SecurityAttribute.role:
                filterHelper.urlRoles[methodParams.url] = role;
                break; 
        }
    }
}