require('dotenv').config();
const fs = require('fs');
const cors = require("cors");
const express = require("express");
const http = require('http');
const MQTT = require('mqtt');
const APP = express();
const server = http.createServer(APP);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const CLIENTID = "frontend";

const client = MQTT.connect(process.env.CONNECT_URL, {
  clientId: CLIENTID,
  clean: true,
  connectTimeout: 3000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 10000,
  debug: true,
  rejectUnauthorized: false // Add this line for testing, should be removed in production
});

// Used for debugging 

client.on("error", function (error) {
  console.error("Connection error: ", error);
});

client.on("close", function () {
  console.log("Connection closed");
});

client.on("offline", function () {
  console.log("Client went offline");
});

client.on("reconnect", function () {
  console.log("Attempting to reconnect...");
});

// MQTT Connection

client.on('connect', async () => {
  console.log("Connected");

  client.subscribe("ultrasonic", (err) => {
    if (err) {
      console.error("Subscription error for 'ultrasonic': ", err);
    } else {
      console.log("Subscribed to 'ultrasonic'");
    }
  });

  client.subscribe("temp", (err) => {
    if (err) {
      console.error("Subscription error for 'temp': ", err);
    } else {
      console.log("Subscribed to 'temp'");
    }
  });
});

client.on('message', (TOPIC, payload) => {
  console.log("Received from broker:", TOPIC, payload.toString());
  if( TOPIC === 'temp' ) {
    latestTemp = payload.toString();
  }
  else if ( TOPIC === 'ultrasonic' ) {
    latestUltrasonic = payload.toString();
  }
});




const corsOptions = {
  origin: '*'
};

APP.use(cors(corsOptions));
APP.use(express.json());

APP.listen(8000, () => {
  console.log('Server is running on port 8000');
});

// Readings from sensors 
let latestTemp = null;
let latestUltrasonic = null;

// APP.get('/temp', (req, res) => {
//   res.json({ temp: {latestTemp} });
// });
// APP.get('/ultrasonic', (req, res) => {
//   res.json({ ultrasonic: {latestUltrasonic} });
// });


// Sending to PICO 

APP.post('/send-direction', (req, res) => {
  const { message } = req.body;
  console.log('Received message from frontend:', message);
  client.publish("direction", message);
  res.status(200).json({ status: 'Message received' });
});

APP.post('/send-arm-value', (req, res) => {
  const { message } = req.body;
  console.log('Received message from frontend:', message);
  client.publish("arm", message.toString());
  res.status(200).json({ status: 'Message received' });
});




io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
