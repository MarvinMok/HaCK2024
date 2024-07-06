import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import Chart from "react-apexcharts";
import SliderComponent from "./SliderComponent";
import "./App.css";

const socket = io('http://localhost:8000');

const App = () => {
  const [ultrasonicData, setUltrasonicData] = useState([]);
  const [temp, setTemp] = useState([]);
  // const [ultrasonic, setUltrasonic] = useState("-1");
  // const [temp, setTemp] = useState("-1");
  const keydown = useRef(false);
  const [value, setValue] = useState(1500);
  // constand changing slider value
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  // Slider change once released
  const sendArmValue = async (newValue) => {
    try {
      const response = await fetch('http://localhost:8000/send-arm-value', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: "arm", message: newValue }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const appendData = (dataPoint) => {
    const pacificTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const dateInPT = new Date(pacificTime);
    setUltrasonicData(prevData => {
      const newData = [...prevData, { x: dateInPT.getTime(), y: parseFloat(dataPoint) }];
      if (newData.length > 20) {
        newData.shift(); // Keep only the last 20 data points
      }
      return newData;
    });
  };

  // For Receving Message
  // Will be used for sensor data
  useEffect(() => {
    // fetch("http://localhost:8000/message")
    // .then((res) => res.json())
    // .then((data) => setMessageReceived(data.message));
    
    socket.on('ultrasonic', (data) => {
      console.log('Received ultrasonic data:', data);
      appendData(data);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
    });

    return () => {
      socket.off('ultrasonic');
    };
  }, []);

  useEffect(() => {
    // when any key is pressed handleKeyDown is pressed 
    console.log("key Pressed")
    const handleKeyDown = (event) => {
      try {
        if (event.key === 'a' && keydown.current === false) {
          sendLeft(); // Set interval to send message every 0.5 seconds
          keydown.current = true;
        }
        else if (event.key === 'd' && keydown.current === false) {
          sendRight(); 
          keydown.current = true;
        }
        else if (event.key === 'w' && keydown.current === false) {
          sendForward(); 
          keydown.current = true;
        }
        else if (event.key === 's' && keydown.current === false) {
          sendBackward(); 
          keydown.current = true;
        }
      }
      catch (error) {
        console.log(`Error handling keydown: {event.key}`)
      }
    }
  
    const handleKeyUp = (event) => {
      if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd' 
      // || event.key === 'ArrowUp' || event.key === 'ArrowDown'
      ) {
        sendStop();
        keydown.current = false;
      }   
    };
  
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
  }, []);



  // Functions to send message to broker thru server

  const sendStop = async () => {
    try {
      const response = await fetch('http://localhost:8000/send-direction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: "direction", message: "stop" }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendLeft = async () => {
    try {
      const response = await fetch('http://localhost:8000/send-direction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: "direction", message: "left" }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  const sendRight = async () => {
    try {
      const response = await fetch('http://localhost:8000/send-direction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: "direction", message: "right" }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendBackward = async () => {
    try {
      const response = await fetch('http://localhost:8000/send-direction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: "direction", message: "backward" }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendForward = async () => {
    try {
      const response = await fetch('http://localhost:8000/send-direction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: "direction", message: "forward" }),
      });
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const series = [
    {
      name: 'Ultrasonic Sensor',
      data: ultrasonicData
    }
  ];

  const options = {
    chart: {
      id: 'realtime',
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: true
      }
    },
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Ultrasonic Sensor Data',
      align: 'left'
    },
    markers: {
      size: 2
    },
    xaxis: {
      type: 'datetime',
      tickAmount: 10,
      tickPlacement: 'on',
      labels: {
        formatter: function(value) {
          return new Date(value).toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles" });
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100
    }
  };

  return (
    <div className="App">
      <div className>
        <h1>Arm Slider</h1>
        <SliderComponent
          value={value}
          onChange={handleChange}
          onAfterChange={sendArmValue}
        />
      </div>
      {/* <h3>{messageReceived}</h3> */}
      <h1>Control Rover</h1>
      <div>
        <p>W</p>
        <p> A  D </p>
        <p>S</p>
      </div>
      <div>
        <iframe 
        src="http://192.168.1.108/"
        title="camera"
        width="1000"
        height="750"
          style={{ border: '1px solid black' }}
        ></iframe>
      </div>
      <div>
        <h1>Ultrasonic Sensor Data</h1>
        <Chart series={series} options={options} height={350} />
      </div>
      {/* <div className="sensor-reading">
          <h4>Temp: {temp}</h4>
          <h4>Distance: {ultrasonic}</h4>
      </div> */}
    </div>
  );
};

export default App;

