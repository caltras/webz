import { BaseController, BodyParameter, FormParameter } from "webeasy/controller";
import { ContentType } from "webeasy/helpers/controller.helper";
import { Controller, Get, Post, Put, Delete, Inject } from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';
import { Service } from '../service';
import * as fs from 'fs';
import * as Path from 'path';

@Controller("/")
class HomeController extends BaseController{

    @Inject() public test:Service;

    @Get({ url: "/"})
    public hello(request:IncomingMessage,response:ServerResponse){
        return this.render("home.html",{text:"Hello", url:this.path});
    }
    @Get({ url: "/json", responseContentType : ContentType.APPLICATION_JSON} )
    public json(request:IncomingMessage,response:ServerResponse){
        this.test = "Novo valor";
        return {text:"Hello",test:this.test, url:this.path};
    }
    @Post({ url: "/", responseContentType : ContentType.APPLICATION_JSON})
    public save(request:IncomingMessage,response:ServerResponse, body:FormParameter){
        body.copyFiles(Path.join(__dirname,"../upload"));       
        return body.getData();
    }
    @Put({ url: "/", responseContentType : ContentType.APPLICATION_JSON})
    public update(request:IncomingMessage,response:ServerResponse, body:FormParameter){
        body.copyFiles(Path.join(__dirname,"../upload"));       
        return body.getData();
    }
    @Delete({ url: "/", responseContentType : ContentType.APPLICATION_JSON})
    public delete(request:IncomingMessage,response:ServerResponse, body:BodyParameter){
        return body.getData();
    }
}

module.exports = HomeController;