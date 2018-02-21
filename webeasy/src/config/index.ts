import * as Lodash from 'lodash';

var config = {
    port: 3000,
    base_url:'../',
    controllers: 'controllers',
    view:{
        engine: 'handlebars',
        base:"view"
    },
    error: {
        engine: 'handlebars',
        "404": 'view/error/404.page.html'
    }
};
var cfg = {};
config = Lodash.defaultsDeep({},cfg,config);

export class Configuration{
    public static instance:Configuration;
    private config:any;

    constructor(c:any){
        this.config = c;
    }
    public static getInstance():Configuration{
        if(!Configuration.instance){
            Configuration.instance = new Configuration(config);
        }
        return Configuration.instance;
    }
    public getConfig():any{
        return this.config;
    }
}
