const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socket_io = require("socket.io");
const server = http.createServer(app);
const io = socket_io(server);


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id: socket.id, ...data});
    });
    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id)
    });
    console.log("connection established...");
})

app.get('/', (req, res)=>{
    res.render("index");
})

server.listen(8001);

