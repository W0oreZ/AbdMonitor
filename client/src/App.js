import React from 'react';
import socketIOClient from "socket.io-client";
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      connected:false,
      socket:socketIOClient("192.168.1.199:5010"),
      sensors:[]
    }
  }

  componentDidMount() {
    const { socket } = this.state;

    socket.on("serialdata", data =>{
      //const newsensors = JSON.parse(data);
      this.setState({
        sensors : data
      })
      console.log(data);
    });

    //socket.on("message", data => this.setState({ response2: data }));
  }

  SendData() {
    const { socket } = this.state;
    socket.emit("Reply", "this is a dummy data");
  }

  componentWillUnmount() {
    this.state.socket.close();
    this.setState({ socket: null });
  }

  render(){
    const bullets = this.state.sensors.map(sensor=>{
      return(
        <div class="col-6 col-sm-3 placeholder">
            <img src="data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200"/>
            <h4>{sensor.name}</h4>
            <div class="text-muted">{sensor.value}</div>
        </div>
      )
    })

    const logs = this.state.sensors.map(sensor=>{
      return(
        <tr>
          <td>{sensor.date}</td>
          <td>{sensor.name}</td>
          <td>{sensor.model}</td>
          <td>{sensor.value}</td>
          <td>{sensor.message}</td>
        </tr>
      )
    })
  return (
    <div className="App">
    <div class="container-fluid">
      <div class="row">
        <nav class="col-sm-3 col-md-2 hidden-xs-down bg-faded sidebar">
          <ul class="nav nav-pills flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="#">Overview <span class="sr-only">(current)</span></a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" href="#">Export</a>
            </li>
          </ul>
        </nav>

        <main class="col-sm-9 offset-sm-3 col-md-10 offset-md-2 pt-3">
          <h1>Dashboard</h1>

          <section class="row text-center placeholders">
            {bullets}
          </section>
          <h2>Graphs</h2>
          <div className="container">
            
          </div>
          <h2>Logs</h2>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Name</th>
                  <th>Sensor</th>
                  <th>Value</th>
                  <th>Resolve</th>
                </tr>
              </thead>
              <tbody>
                {logs.length>0 ? logs:"No Sensor DATA Received"}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
    </div>
  )}
}

export default App;
