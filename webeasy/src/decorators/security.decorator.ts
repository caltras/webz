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
        switch(params){
            case SecurityAttribute.permitAll:
                FilterHelper.getInstance().exceptions.push(FilterHelper.getInstance().processUrlAsRegExp(methodParams.url));
        }
    }
}