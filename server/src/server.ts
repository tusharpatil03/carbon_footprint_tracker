import http from "http";
import app from "./app";
import { connect } from "./db";


const httpServer = http.createServer(app);

const SERVER_PORT = process.env.PORT;
const SERVER_HOST = process.env.HOST;

connect().then(() => {
    httpServer.listen(SERVER_PORT, () => {
        console.log(`server ready at http://${SERVER_HOST}:${SERVER_PORT}/`);
    });
});