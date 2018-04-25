import { Injectable } from "../decorators";
import * as socketIo from 'socket.io';
import * as debugModule from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

const debug = debugModule('webeasy-bootstrap');

@Injectable()
export class WebSocketHelper{
    
    private websockets:Map<string,socketIo.Server> = new Map();
    private config:any;

    public configuration(cfg:any){
        this.config = cfg;
        return this;
    }
    public create(server:any,name:string="default",port:number=3000){
        debug("Websocket: "+(this.config.websocket.enabled? "ENABLED":"DISABLED"));
        if(this.config.websocket.enabled){
            let io = socketIo(server);
            io.on('connect',(socket:any)=>{
                debug(`${socket.id} Socket connect on server ${name} on port ${port}`);
                socket.on('message',(m:any)=>{
                    console.log(m);
                });
                socket.on('disconnect',()=>{
                    debug(`Client ${socket.id} disconnected`); 
                });
            });
            this.websockets.set(name,io);
            this.loadEndpoints(name);
            debug(`Websocket on server ${name} on port ${port}`);
        }
    }
    public loadEndpoints(serverName:any){
        let endPoints:string[] = WebSocketHelper.getListEndpoint(this.config);
        endPoints.forEach(e=>{
            let Clazz = require(e);
            let instance = new Clazz(this.websockets.get(serverName));
            console.log(instance);
        })
    }
    private static walkSync(dir:any, filelist:any = []):any{
        return fs.readdirSync(dir)
            .filter(file => file.indexOf(".map") === -1 && file.indexOf(".d.ts") === -1)
            .map(file => {
                return fs.statSync(path.join(dir, file)).isDirectory()
                        ? WebSocketHelper.walkSync(path.join(dir, file), filelist)
                        : (file.indexOf(".websocket.") > -1 ? filelist.concat(path.join(dir, file))[0] : "")
                }).filter( p => p !== "");
    }
    private static getListEndpoint(cfg:any):string[]{
        return _.flatMapDeep(WebSocketHelper.walkSync(cfg.base_url+"/", []));
    }
}