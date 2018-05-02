import {BaseController} from './base.controller';
import {Controller, Inject, Get} from '../decorators'
import { ServerRequest, ServerResponse } from 'http';
import { SessionHelper } from '../helpers/session.helper';
import { ConfigurationHelper } from '../helpers/configuration.helper';

@Controller("/logout")
export class LogoutController extends BaseController{

    @Get({ url: "/"})
    public logout(request:ServerRequest,response:ServerResponse){
        SessionHelper.getInstance().invalidateSession(request);
        response.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        response.setHeader('Expires', '-1');
        response.setHeader('Pragma', 'no-cache');
        this.redirect(ConfigurationHelper.getInstance().getProperty("redirect").login,response);
    }
}