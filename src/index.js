import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';

import appApi from "./api/index.js";
import database from "./config/index.js";

// CORS options
const corsOptions = {
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}


// app port number
const port = process.env.PORT || 3000;

const app = express();

database.once('open', () => {
    console.log('Successfully connected to database');
})

database.on('close', () => {
    database.removeAllListeners();
})

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())
app.use(compression())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Chinos backend says hi')
})

// Use Routes
app.use("/api", appApi);


app.listen(port, async (error) => {
    if(error){
        console.log(`Error starting app in port ${ port }`);
    }
    console.log(`server running on port ${port}`);
})

let connections = [];

app.on('connection', (connection) => {
    connections.push(connection);
    // eslint-disable-next-line no-return-assign
    connection.on('close', () => connection = connections.filter(current => current != connection));
    console.log(`${connections.length} connections`);
});

export default app;
// module.exports = app;
