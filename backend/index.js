
const dotenv = require('dotenv').config()
const cors = require("cors")
const express = require("express")
const http = require('http')
const MQTT = require('mqtt')
const APP = express()
const server = http.createServer(APP);
const { Server } = require("socket.io")


const io = new Server(server);
const CLIENTID = "frontend"
const client = MQTT.connect(process.env.CONNECT_URL, {
  CLIENTID,
  clean: true,
  connectTimeout: 3000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PWD,
  reconnectPeriod: 10000,
})


var latest = {};

client.on("error", function(error){console.log("can't connect: "+error)})

const corsOptions = {
  origin: '*'
}

// Starting server
APP.use(cors(corsOptions));
APP.use(express.json());

// io.on('connection', function(socket){
//   console.log("a user connected");
//   socket.on('Client', (message) => {
//     console.log(message)
//   })
//   console.log('Emitting')
//   setInterval(function() {
//     console.log('Echo', latest.value);
//   }, 3000);
//   createSocket.on("disconnect", () => console.log("Client Disconnected"))
// })

client.on('connect', async () => {
  console.log("connected")
  client.subscribe("ultrasonic", () => {
    console.log("Subscribed to direction")
  })
  // client.publish(TOPIC, 'Hello there motherfucker')
})

client.on('message', (TOPIC, payload) => {
  console.log("recieved:", TOPIC, payload.toString())
  latest = payload.toString()
})


APP.listen(8000, () => {
  console.log('Server is running on port 8000');
})

APP.get('/message', (req, res) => {
  res.json({ message: "Fuck you frontend" });
});

APP.post('/send-direction', (req, res) => {
  const { message } = req.body;
  console.log('Received message from frontend:', message);
  client.publish("direction", message);

  res.status(200).json({ status: 'Message received' });
});

APP.post('/send-arm-value', (req, res) => {
  const { message } = req.body;
  console.log('Received message from frontend:', message);
  client.publish("arm", message);

  res.status(200).json({ status: 'Message received' });
})
