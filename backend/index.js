// import the dependencies
const express = require('express');
const cors = require('cors');
const router = require('./router');
// build the app
const app = express();
app.use(cors());
app.use(express.json());
app.use();

// build the https server:

// (1) ssl certificate info
const fs = require('fs');
const options = {
  cert: fs.readFileSync('/opt/bitnami/apache/conf/api.bigdevdog.com.crt'),
  key: fs.readFileSync('/opt/bitnami/apache/conf/api.bigdevdog.com.key')
};

// (2) start server to use app
const https = require('https');
const httpsServer = https.createServer(options, app);
const httpsPort = 4043;
httpsServer.listen(httpsPort, () => {
  console.log(`https app listening at port ${httpsPort}`);
});
