import * as Path from 'path';
export class I18nHelper{
    public static defaultLanguage:string = 'en-US';
    private static maps:any = {};

    static loadLanguage(language:string):any{
        let l = language || I18nHelper.defaultLanguage;
        let m = I18nHelper.maps[l] || require('./'+l);
        if(m){
            I18nHelper.maps[l] = m;
            return m;
        }else{
            return null;
        }
    }
    static addLanguage(language:string,properties:any){
        I18nHelper.maps[language] = I18nHelper.maps[language] || {};
        I18nHelper.maps[language] = Object.assign({},I18nHelper.maps[language],properties);
    }
    static getProperty(p:string,language?:string):any{
        return this.loadLanguage(language || I18nHelper.defaultLanguage)[p];
    }
    static setDefaultLanguage(p:string){
        I18nHelper.defaultLanguage = p;
    }

}