import { Injectable } from 'webeasy/decorators';

@Injectable()
export class Service{
    public execute(){
        return "Executed";
    }
}