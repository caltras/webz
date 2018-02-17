var base_url = __dirname;
import { WebeasyBootStrap } from 'webeasy';
import {default as config} from './config';
config.base_url = base_url;

var web = new WebeasyBootStrap(config);

web.create()
    .listen();