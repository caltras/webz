import {BaseController} from 'webeasy/controller';
import {Controller, Get} from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';
import { ContentType } from 'webeasy/helpers/controller.helper';

@Controller("/user")
class UserController extends BaseController{

    @Get({ url: "/", responseContentType : ContentType.HTML})
    public find(request:IncomingMessage,response:ServerResponse){
        return this.render("user/user.html",{text:"User", url:this.path});
    }
}

module.exports = UserController;