import "reflect-metadata";
let FilterHelper = require('../helpers/filter.helper').FilterHelper;

export const SecurityAttribute = {
    permitAll:'PERMIT_ALL',
    role:'ROLE'
}

export const Security = (params:string,role?:string[]|string)=>{
    return (target:any, key:string)=>{
        let methodParams:any = Reflect.getMetadata('design:type:get',target.constructor,key);
        try{

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
        }catch(e){
            throw new Error(`
The HTTP verb should be defined before the security decorator.
In : ${target.constructor.name} => ${key}

Example: 
@Security(SecurityAttribute.permitAll)
@Get({ url: "/"})
public method(){}                           
            `);
        }
    }
}