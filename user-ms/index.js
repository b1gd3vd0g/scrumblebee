const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// 1. Create the express app!

const app = express();
// Make app use JSON instead of strings.
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
// Enable cross-origin resource sharing.
app.use(cors());
// Define http methods and routes.
const router = require('./base_router');
app.use('/', router);

// 2. Start the servers!

const mode = process.env.MODE;
const host = process.env.HOST;
const port = process.env.USER_PORT;

// Now, based on the mode, we're going to do a couple things differently
switch (mode) {
  // DEV mode - localhost, http server.
  case 'DEV':
    const httpServer = require('http').createServer(app);
    httpServer.listen(port, () => {
      console.log(
        `${host}:${port} is listening for the scrumblebee-user-microservice`
      );
    });
    break;

  // PROD mode - hosted on www.api.bigdevdog.com, https server.
  case 'PROD':
    const fs = require('fs');
    const options = {
      cert: fs.readFileSync(process.env.CERT_PATH),
      key: fs.readFileSync(process.env.KEY_PATH)
    };
    const httpsServer = require('https').createServer(options, app);
    httpsServer.listen(port, () => {
      console.log(
        `${host}:${port} is listening for the scrumblebee-user-microservice`
      );
    });
    break;

  // This should not happen.
  default:
    console.log('Check configuration file - MODE is undefined or invalid.');
}
