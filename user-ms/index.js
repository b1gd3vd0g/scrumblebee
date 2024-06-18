const express = require('express');
const cors = require('cors');

// 0. Create express app.

const app = express();
// Make app use JSON instead of strings.
app.use(express.json());
// Enable cross-origin resource sharing.
app.use(cors());
// Define http methods and routes.
const router = require('./base_router');
app.use('/', router);

// 1. Create an https server to serve app.

const https = require('https');
const fs = require('fs');
// ssl certificate and private key
const options = {
  cert: fs.readFileSync(''),
  key: fs.readFileSync('')
};
const httpsServer = https.createServer(options, app);

// 2. Start the app listening for requests.

const httpsPort = 4043;
httpsServer.listen(httpsPort, () => {
  console.log(`scrumblebee-user-microservice listening on port ${httpsPort}.`);
});
