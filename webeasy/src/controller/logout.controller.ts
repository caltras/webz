import {BaseController} from './base.controller';
import {Controller, Inject, Get} from '../decorators'
import { ServerRequest, ServerResponse } from 'http';

@Controller("/logout")
export class LogoutController extends BaseController{

    @Get({ url: "/"})
    public logout(request:ServerRequest,response:ServerResponse){
        this.redirect("/login/",response);
    }
}