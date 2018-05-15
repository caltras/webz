import { IncomingMessage } from "http";
import { Socket } from "net";

export class Request extends IncomingMessage{
    public parameters:any;
    public query:any;
    public session:any;

    constructor(socket:Socket){
        super(socket);
    }
}