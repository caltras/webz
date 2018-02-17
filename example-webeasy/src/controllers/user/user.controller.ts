import {BaseController} from 'webeasy/controller';
import {Controller, Get} from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';

@Controller("/user")
class UserController extends BaseController{

    @Get("/:id")
    public find(request:IncomingMessage,response:ServerResponse){
        return {text:"User", url:this.path};
    }
}

module.exports = UserController;