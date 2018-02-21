import { BaseController } from "webeasy/controller";
import { ContentType } from "webeasy/helpers/controller.helper";
import { Controller, Get } from 'webeasy/decorators';
import { IncomingMessage, ServerResponse, ServerRequest } from 'http';

@Controller("/home")
class HomeController extends BaseController{

    @Get({ url: "/"})
    public hello(request:IncomingMessage,response:ServerResponse){
        return this.render("home.html",{text:"Hello", url:this.path});
    }
    @Get({ url: "/json", contentType : ContentType.APPLICATION_JSON} )
    public json(request:IncomingMessage,response:ServerResponse){
        return {text:"Hello", url:this.path};
    }
}

module.exports = HomeController;