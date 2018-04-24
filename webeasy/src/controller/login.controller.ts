import {BaseController} from './base.controller';
import {Controller, Inject, Get, Post} from '../decorators'
import { ServerRequest, ServerResponse } from 'http';
import { FormParameter } from '.';
import { LoginHelper } from '../security/login.handler';
import { User } from '../security/user';
import { SessionHelper } from '../helpers/session.helper';

@Controller("/login")
export class LoginController extends BaseController{

    @Get({ url: "/"})
    public login(request:ServerRequest,response:ServerResponse){
        let message = {flashMessage:SessionHelper.getFlashMessage(request)};
        return this.render("view/login.html",message);
    }
    @Post({url:"/", async:true})
    public postLogin(request:ServerRequest,response:ServerResponse,body:FormParameter){
       return LoginHelper.login(request,response,new User(body.getData()));
    }
    @Post({url:"/signup",async:true})
    public signup(request:ServerRequest,response:ServerResponse,body:FormParameter){
        return LoginHelper.signup(request,response,new User(body.getData()));
    }
    @Post({url:"/recovery"})
    public recovery(request:ServerRequest,response:ServerResponse,body:FormParameter){
        this.redirect("/",response);
    }
}