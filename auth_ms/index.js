const express = require('express');
const cors = require('cors');
2;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', require('./base_router'));

const httpServer = require('http').createServer(app);
const httpPort = 4042;
httpServer.listen(httpPort, () => {
  console.log(
    `scrumblebee-auth-microservice: http server is listening on port ${httpPort}.`
  );
});
