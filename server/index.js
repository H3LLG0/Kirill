require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routers/router');
const sequelize = require('../server/database/database');
const expressFileUploud = require('express-fileupload')
const models = require('./database/models/models');
const path = require('path')

const PORT = process.env.PORT;

const app = express();


app.use(cors(corsOptions));

const corsOptions = {
    origin: 'https://excellently-spruce-flycatcher.cloudpub.ru',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200
  };
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://excellently-spruce-flycatcher.cloudpub.ru');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(expressFileUploud({}))
app.use(express.json());
app.use('/api', router);

const serve = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {console.log(`server start on port ${5000}`)});
    } catch(e) {
        console.log(e);
    }
}


serve();