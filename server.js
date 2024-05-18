const http = require("http");
const app = require("./index");

const server = http.createServer(app);

server.listen(8080, (err) => {
    if (err) console.log("error in starting server : ", err);
    console.log(`server is running on http://localhost:8080`);
});