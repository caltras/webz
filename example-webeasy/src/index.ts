var base_url = __dirname;
import { WebeasyBootStrap } from 'webeasy';
import {default as config} from './config';
import * as cluster from 'cluster';
import * as os from 'os';

config.base_url = base_url;
var web = new WebeasyBootStrap(config);
(async ()=> {
    await web.create();
    web.listen();
})();
    
/*if(cluster.isMaster){
    console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}else{
    var web = new WebeasyBootStrap(config);

    web.create()
        .listen();

    console.log(`Worker ${process.pid} started`);
}*/
