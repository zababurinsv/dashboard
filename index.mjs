import fs from "fs";
import path from "path";
let __dirname = path.dirname(process.argv[1]);
import express from "express";
import cors from "cors";
import Enqueue from "express-enqueue";
import compression from "compression";
import formidableMiddleware from "express-formidable";
import {promisify} from "util";
import dotenv from "dotenv"
import template from './templates/default.mjs'
dotenv.config()
const highWaterMark =  2;
let app = express();
app.use(compression())
app.use(cors({ credentials: true }));
const queue = new Enqueue({
    concurrentWorkers: 4,
    maxSize: 200,
    timeout: 30000
});
console.log('~~~~~~~~~test~~~~~~~~~~~~~~~~')
app.use(queue.getMiddleware());
let whitelist = ['https://web3-monopoly.web.app','http://localhost:8886','http://localhost:8887','http://localhost:8888','https://xart-3e938.firebaseapp.com','https://xart-3e938.web.app','https://universitykids.ru','https://vashi-faili.web.app','https://vashi-faili.web.app',  'https://www.universitykids.ru', 'https://tuning-fork.firebaseapp.com','http://localhost:8888', 'https://jainagul-tezekbaeva.firebaseapp.com','https://tezekbaeva.firebaseapp.com']
const account = `/3N8n4Lc8BMsPPyVHJXTivQWs7ER61bB7wQn`
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(formidableMiddleware());
app.options('/auth', cors(corsOptions))
app.post('/auth', async (req, res) => {

    console.log('~~~~~~~~~test~~~~~~~~~~~~~~~~', req)
    res.send(await template());
})
app.use( express.static('public'));
app.use( express.static('static'));
app.options('/*', cors(corsOptions))
app.get('/*', async (req, res) => {
    res.sendFile('/public/index.html', { root: __dirname });
})
app.use(queue.getErrorMiddleware())
export default app

