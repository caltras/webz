import {BaseController} from './base.controller';
import {Controller, Inject, Get, Post} from '../decorators'
import { ServerRequest, ServerResponse } from 'http';
import { FormParameter } from '.';

@Controller("/login")
export class LoginController extends BaseController{

    @Get({ url: "/"})
    public login(request:ServerRequest,response:ServerResponse){
        return this.render("view/login.html");
    }
    @Post({url:"/"})
    public postLogin(request:ServerRequest,response:ServerResponse,body:FormParameter){
        this.redirect("/",response);
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