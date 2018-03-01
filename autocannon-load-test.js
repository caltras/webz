'use strict'

const autocannon = require('autocannon');

autocannon({
  url: 'http://localhost:3002',
  connections: 100, //default
  pipelining: 10, // default
  duration: 40 // default
}, console.log)