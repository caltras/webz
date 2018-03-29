import {BaseController} from './base.controller';
import {Controller, Inject, Get, Post} from '../decorators'
import { ServerRequest, ServerResponse } from 'http';
import { FormParameter } from '.';
import { LogindHelper } from '../security/login.handler';

@Controller("/login")
export class LoginController extends BaseController{

    @Get({ url: "/"})
    public login(request:ServerRequest,response:ServerResponse){
        return this.render("view/login.html");
    }
    @Post({url:"/", async:true})
    public postLogin(request:ServerRequest,response:ServerResponse,body:FormParameter){
       return LogindHelper.login(request,response,body.getData());
    }
    @Post({url:"/signup"})
    public signup(request:ServerRequest,response:ServerResponse,body:FormParameter){
        this.redirect("/",response);
    }
    @Post({url:"/recovery"})
    public recovery(request:ServerRequest,response:ServerResponse,body:FormParameter){
        this.redirect("/",response);
    }
}