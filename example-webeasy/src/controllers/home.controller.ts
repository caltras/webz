import { BaseController, BodyParameter, FormParameter, Request, Response } from "webeasy/controller";
import { ContentType } from "webeasy/helpers/controller.helper";
import { Controller, Get, Post, Put, Delete, Options, Inject } from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';
import { Service, NoSingletonService } from '../service';
import * as fs from 'fs';
import * as Path from 'path';
import {SessionHelper} from 'webeasy/helpers/session.helper';
import { User } from 'webeasy/security/user';
import { Security, SecurityAttribute } from 'webeasy/decorators/security.decorator';

@Controller("/")
class HomeController extends BaseController{

    @Inject() public service:Service;
    @Inject() public noSingleton:NoSingletonService;
    @Inject() public session:SessionHelper;

    @Security(SecurityAttribute.permitAll)
    @Get({ url: "/hello"})
    public hello2(request:IncomingMessage,response:ServerResponse){
        return 'hello';
    }
    @Security(SecurityAttribute.role,['ADMIN'])
    @Get({ url: "/admin"})
    public admin(request:IncomingMessage,response:ServerResponse){
        return 'Admin';
    }
    @Security(SecurityAttribute.role,['MANAGER'])
    @Get({ url: "/manager"})
    public manager(request:IncomingMessage,response:ServerResponse){
        return 'manager';
    }
    @Security(SecurityAttribute.role,['ABC'])
    @Get({ url: "/manager2"})
    public manager2(request:IncomingMessage,response:ServerResponse){   
        return 'manager [ABC]';
    }
    @Get({ url: "/"})
    public hello(request:IncomingMessage,response:ServerResponse){
        let user:User = this.session.getAuthenticateUser(request);
        return "Hello "+user.user;
    }
    @Get({ url: "/html"})
    public html(request:IncomingMessage,response:ServerResponse){
        return this.render("home.html",{text:"Hello", url:this.path});
    }
    @Get({ url: "/json", responseContentType : ContentType.APPLICATION_JSON} )
    public json(request:IncomingMessage,response:ServerResponse){
        let r = this.service.execute();
        return {text:"Hello",response:r, url:this.path};
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

    @Options("/")
    public customOption(request:IncomingMessage,response:ServerResponse){
        console.log("OPTIONS");
        response.setHeader("X-Test","true");
    }

    @Get("/:id")
    public homeParameters(request:Request,response:ServerResponse){
        return request.parameters.id;
    }
    @Get("/:id/message/:name")
    public homeParameters2(request:Request,response:ServerResponse){
        return "Hello "+request.parameters.name+" #"+request.parameters.id;
    }
}

module.exports = HomeController;