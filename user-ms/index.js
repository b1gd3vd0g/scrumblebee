const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// 0. Create express app.

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

// 1.1: create the http server (for testing purposes)

const httpServer = require('http').createServer(app);
const httpPort = 4044;
httpServer.listen(httpPort, () => {
  console.log(
    `scrumblebee-user-microservice: http listening on port ${httpPort}.`
  );
});

// 1.2: create the https server (for production)

// const fs = require('fs');
// const options = {
//   cert: fs.readFileSync(process.env.CERT_PATH),
//   key: fs.readFileSync(process.env.KEY_PATH)
// };
// const httpsServer = require('https').createServer(options, app);
// const httpsPort = 4045;
// httpsServer.listen(httpsPort, () => {
//   console.log(
//     `scrumblebee-user-microservice: https listening on port ${httpsPort}.`
//   );
// });
