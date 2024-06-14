// import the dependencies
const express = require('express');
const cors = require('cors');
const router = require('./router');
// build the app
const app = express();
app.use(cors());
app.use(express.json());
app.use();

app.listen(httpsPort);
