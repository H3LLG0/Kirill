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
const corsOptions = {
    origin: 'https://excellently-spruce-flycatcher.cloudpub.ru/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
    maxAge: 86400
  };

app.use(cors(corsOptions));
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(expressFileUploud({}))
app.use(express.json());
app.use('/api', router)



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