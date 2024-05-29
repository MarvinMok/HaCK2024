

const cors = require("cors")
const express = require("express")
const http = require('http')
const MQTT = require('mqtt')
const APP = express()
const server = http.createServer(APP);
const { Server } = require("socket.io")


// const io = new Server(server);
const HOST = "378861656db74bd1becac997eb01cb13.s1.eu.hivemq.cloud";
const PORT = "8883";
const CLIENTID = "frontend";
const CONNECTURL = `mqtts://${HOST}:${PORT}`;
const TOPIC = "topic1";
const client = MQTT.connect(CONNECTURL, {
  CLIENTID ,
  clean: true,
  connectTimeout: 3000,
  username: "node-server",
  password: "Node-server1",
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
  client.subscribe([TOPIC], () => {
    console.log('Echo', "Subscribed");
  })
  // client.publish(TOPIC, 'Hello there motherfucker')
})

client.on('message', (TOPIC, payload) => {
  console.log("recieved:", TOPIC, payload.toString())
  latest = payload.toString()
})

//MQTT LISTEN
// server.listen(80, () => console.log("server started"))

APP.listen(8000, () => {
  console.log('Server is running on port 8000');
})

APP.get('/message', (req, res) => {
  res.json({ message: "Hello from server!" });
});

APP.post('/send-message', (req, res) => {
  const { message } = req.body;
  console.log('Received message from frontend:', message);

  // You can now publish this message to your MQTT broker if needed
  // client.publish(TOPIC, message);

  res.status(200).json({ status: 'Message received' });
});