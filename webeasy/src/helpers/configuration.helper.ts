import { Injectable } from "../decorators";

@Injectable()
export class ConfigurationHelper{
    private static instance:ConfigurationHelper;
    private configuration:any;
    
    public static getInstance():ConfigurationHelper{
        if(!ConfigurationHelper.instance){
            ConfigurationHelper.instance = new ConfigurationHelper();
        }
        return ConfigurationHelper.instance;
    }

    public setConfiguration(cfg:any){
        this.configuration = cfg;
    }
    public getProperty(p:string):any{
        return this.configuration[p];
    }
    public getConfiguration():any{
        return this.configuration;
    }
}