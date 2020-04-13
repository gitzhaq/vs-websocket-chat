# vs-websocket-chat

All of the following commands should be executed in the app root directory.

##Installation
Install npm server and client packages:

`yarn install && cd client && yarn install`

##Start
###Development
Start Express.js server and WebSocket server (both on port 3001):

`yarn start`

Start React.js client development server (on port 3000):

`cd client && yarn start`

Now you can access the app here: http://localhost:3000

###Production
Build static React.js files for Express.js server:

`cd client && yarn run build`

Start Express.js server (if no environment variable PORT is given then 3001 is used again):

`yarn start`

Now you can access the app here: http://localhost:3001

It is not necessary to start a React.js development server because in production the Express.js server serves React
.js' static build files.

In production it is recommended to set the environment variable NODE_ENV to "production".