const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const defaults = require("./routes/api/defaults");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use("/api", defaults);

const Httpport = process.env.PORT || 5001;
app.listen(Httpport, () => console.log(`Express web Server Running on ${Httpport}`));

const server = http.createServer(app);
server.listen(5010, () => console.log("Socket server listning on port 5010 "));
const io = socketIo(server);

let clients = [];

io.on("connection", socket => {
  console.log(`Client ${socket.id} CONNECTED`);
  clients.push(socket);
  
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    newClients = clients.filter(client=>{return client.id !== socket.id});
    clients = newClients;
  });

  socket.on('Reply', handleClientReply);
  socket.on('collecting',handleLoggerMessage)
});


const handleClientReply = (data)=>{
  try {
    console.log('incomming message ', data);
    clients.forEach(client=>{
      client.emit("test",data)
    })
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
}

const handleLoggerMessage = (data) => {
  try {
    clients.forEach(client=>{
      client.emit("serialdata",data)
    })
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
}
