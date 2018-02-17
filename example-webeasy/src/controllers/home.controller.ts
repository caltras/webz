import { BaseController } from "webeasy/controller";
import {Controller, Get} from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';

@Controller("/home")
class HomeController extends BaseController{

    @Get("/")
    public hello(request:IncomingMessage,response:ServerResponse){
        return {text:"Hello", url:this.path};
    }
}

module.exports = HomeController;