

const cors = require("cors")
const express = require("express")
const http = require('http')
const MQTT = require('mqtt')
const APP = express()
const server = http.createServer(APP);
const { Server } = require("socket.io")


const io = new Server(server);
const HOST = "2d99e9a882c2434786c1cdb39f29154b.s1.eu.hivemq.cloud"
const PORT = 8883
const CLIENTID = "frontend"
const CONNECTURL = "mqtts://2d99e9a882c2434786c1cdb39f29154b.s1.eu.hivemq.cloud:8883"
const TOPIC = "test1";
const client = MQTT.connect(CONNECTURL, {
  CLIENTID ,
  clean: true,
  connectTimeout: 3000,
  username: "frontend",
  password: "Picow123",
  reconnectPeriod: 10000,

})

var latest = {};

client.on("error", function(error){console.log("can't connect: "+error)})

const corsOptions = {
  origin: '*'
}

APP.use(cors(corsOptions))

io.on('connection', function(scoket){
  console.log("a user connected");
  socket.on('Client', (message) => {
    console.log(message)
  })
  console.log('Emitting')
  setInterval(function() {
    console.log('Echo', latest.value);
  }, 3000);
  createSocket.on("disconnect", () => console.log("Client Disconnected"))
})

client.on('connect', async () => {
  console.log("connected")
  client.subscribe([TOPIC], () => {
    console.log('Echo', "Subscribed");
  })
})

client.on('message', (TOPIC, payload) => {
  console.log("recieved: ", TOPIC, payload.toString())
  latest = payload.toString()
})

server.listen(80, () => console.log("server started"))