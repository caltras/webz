#!/bin/bash
#npm run load-test
autocannon -c 100 -d 60 -p 10 -H Authorization=abc123 http://localhost:3002/