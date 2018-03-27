import {BaseController} from './base.controller';
import {Controller, Inject, Get} from '../decorators'
import { ServerRequest, ServerResponse } from 'http';

@Controller("/login")
export class LoginController extends BaseController{

    @Get({ url: "/"})
    public login(request:ServerRequest,response:ServerResponse){
        return this.render("view/login.html");
    }
}