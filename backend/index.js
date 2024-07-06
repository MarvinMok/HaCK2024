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

const CONNECT_URL = "mqtts://b336487b99734211867870bc957c5a4f.s1.eu.hivemq.cloud:8883";
const MQTT_USR = "abcde";
const MQTT_PASS = "12345Qaz";
const CLIENTID = "frontend";

const client = MQTT.connect(CONNECT_URL, {
  clientId: CLIENTID,
  clean: true,
  connectTimeout: 3000,
  username: MQTT_USR,
  password: MQTT_PASS,
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

client.on('connect', async () => {
  console.log("Connected");

  client.subscribe("ultrasonic", (err) => {
    if (err) {
      console.error("Subscription error for 'ultrasonic': ", err);
    } else {
      console.log("Subscribed to 'ultrasonic'");
    }
  });

  // client.subscribe("arm", (err) => {
  //   if (err) {
  //     console.error("Subscription error for 'arm': ", err);
  //   } else {
  //     console.log("Subscribed to 'arm'");
  //   }
  // });

  // client.subscribe("direction", (err) => {
  //   if (err) {
  //     console.error("Subscription error for 'direction': ", err);
  //   } else {
  //     console.log("Subscribed to 'direction'");
  //   }
  // });
});

client.on('message', (TOPIC, payload) => {
  console.log("Received from broker:", TOPIC, payload.toString());
  io.emit('ultrasonic', payload.toString());
});

// Express Middleware
const corsOptions = {
  origin: '*'
};

APP.use(cors(corsOptions));
APP.use(express.json());

// APP.listen(8000, () => {
//   console.log('Server is running on port 8000');
// });

APP.get('/message', (req, res) => {
  res.json({ message: "Message from backend" });
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
  client.publish("arm", message.toString());
  res.status(200).json({ status: 'Message received' });
});

// WebSocket Event Handlers
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(8000, () => {
  console.log('Server is running on port 8000');
});
