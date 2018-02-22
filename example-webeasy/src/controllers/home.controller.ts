import { BaseController, BodyParameter, FormParameter } from "webeasy/controller";
import { ContentType } from "webeasy/helpers/controller.helper";
import { Controller, Get, Post } from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';
import * as fs from 'fs';

@Controller("/home")
class HomeController extends BaseController{

    @Get({ url: "/"})
    public hello(request:IncomingMessage,response:ServerResponse){
        return this.render("home.html",{text:"Hello", url:this.path});
    }
    @Get({ url: "/json", contentType : ContentType.APPLICATION_JSON} )
    public json(request:IncomingMessage,response:ServerResponse){
        return {text:"Hello", url:this.path};
    }
    @Post({ url: "/", contentType : ContentType.APPLICATION_JSON})
    public save(request:IncomingMessage,response:ServerResponse, body:FormParameter){
        body.copyFiles(__dirname);       
        return body.getData();
    }
}

module.exports = HomeController;