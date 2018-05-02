import { Injectable, Inject } from 'webeasy/decorators';

@Injectable()
export class ChildService{
    
    public hello(){
        return "Hello!!";
    }
}

@Injectable()
export class Service{
    
    @Inject() child:ChildService;

    public execute(){
        return "Executed "+this.child.hello();
    }
}


@Injectable({singleton:false})
export class NoSingletonService{
    public execute(){
        return "no singleton";
    }
}
