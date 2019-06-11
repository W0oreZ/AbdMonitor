const socketIoClient = require("socket.io-client");
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

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
});



SerialPort.list((err, ports) => {
  console.log('ports', ports);
});

const port = new SerialPort('COM3', { baudRate: 115200 });

const parser = new Readline();
port.pipe(parser);
//setInterval(()=>port.write('go'),5000);

parser.on('data', line =>{
  try{
    const data = JSON.parse(line);
    let parsedData = [];
    data.forEach(l=>{
      parsedLine = {
        ...l,
        date:Date.now().toString()
      }
      parsedData.push(parsedLine);
    })
    //console.log("sending",data);
    emit("collecting",parsedData);
  }catch(err)
  {
    console.log(err.code)
  }
})
