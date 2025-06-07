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

app.use(cors());
// app.use(function(req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//   });
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