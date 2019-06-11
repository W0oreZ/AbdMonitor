const io = require("socket.io-client");
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const socket = io.connect('http://193.70.8.124:5010', {reconnect: true});

socket.on('connect', function (sock) {
  console.log('Connected!');
});

var com = "COM3";

SerialPort.list((err, ports) => {
  ports.forEach(port=>{
    if(port.manufacturer == 'FTDI')
    {
      com = port.comName;
    }
  })
  console.log(com)
  console.log('ports', ports);
});

const port = new SerialPort(com, { baudRate: 115200 });

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
    console.log("sending",data);
    socket.emit("collecting",parsedData);
  }catch(err)
  {
    console.log(err.code)
  }
})
