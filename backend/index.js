
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
const TOPIC = "test1";
const client = MQTT.connect(process.env.CONNECT_URL, {
  CLIENTID ,
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function demo() {
  for (let i = 0; i < 5; i++) {
      console.log(`Waiting ${i} seconds...`);
      client.publish('test2', 'Hello, pico!');
      await sleep(1000);

  }
}

demo();

