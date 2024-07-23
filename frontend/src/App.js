import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import Chart from "react-apexcharts";
import SliderComponent from "./SliderComponent";
import "./App.css";

const socket = io('http://localhost:8000');

const App = () => {
  const [ultrasonicDataRight, setUltrasonicDataRight] = useState([]);
  const [ultrasonicDataLeft, setUltrasonicDataLeft] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [humidData, setHumidData] = useState([]);
  const [latestUltrasonicRight, setLatestUltrasonicRight] = useState(null);
  const [latestUltrasonicLeft, setLatestUltrasonicLeft] = useState(null);
  const [latestTemp, setLatestTemp] = useState(null);
  const [latestHumid, setLatestHumid] = useState(null);
  const keydown = useRef(false);
  const [value, setValue] = useState(1700);
  const [pinchValue, setPinchValue] = useState(600)
  // constand changing slider value
  // const handleArmChange = (newValue) => {
  //   setValue(newValue);
  // };
  // const handlePinchChange = (newValue) => {
  //   setPinchValue(newValue);
  // };

  const handleArmChange = (newValue) => {
    setValue(newValue);
    socket.emit('send-arm-value', newValue);
  };
  
  const handlePinchChange = (newValue) => {
    setPinchValue(newValue);
    socket.emit('send-pinch-value', newValue);
  };

  const appendUltrasonicDataRight = (dataPoint) => {
    const pacificTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const dateInPT = new Date(pacificTime);
    setUltrasonicDataRight(prevData => {
      const newData = [...prevData, { x: dateInPT.getTime(), y: parseFloat(dataPoint) }];
      if (newData.length > 20) {
        newData.shift();
      }
      return newData;
    });
    setLatestUltrasonicRight(dataPoint);
  };

  const appendUltrasonicDataLeft = (dataPoint) => {
    const pacificTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const dateInPT = new Date(pacificTime);
    setUltrasonicDataLeft(prevData => {
      const newData = [...prevData, { x: dateInPT.getTime(), y: parseFloat(dataPoint) }];
      if (newData.length > 20) {
        newData.shift();
      }
      return newData;
    });
    setLatestUltrasonicLeft(dataPoint);
  };

  const appendTempData = (dataPoint) => {
    const pacificTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const dateInPT = new Date(pacificTime);
    setTempData(prevData => {
      const newData = [...prevData, { x: dateInPT.getTime(), y: parseFloat(dataPoint) }];
      if (newData.length > 20) {
        newData.shift();
      }
      return newData;
    });
    setLatestTemp(dataPoint);
  };

  const appendHumidData = (dataPoint) => {
    const pacificTime = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    const dateInPT = new Date(pacificTime);
    setHumidData(prevData => {
      const newData = [...prevData, { x: dateInPT.getTime(), y: parseFloat(dataPoint) }];
      if (newData.length > 20) {
        newData.shift();
      }
      return newData;
    });
    setLatestHumid(dataPoint);
  };

  useEffect(() => {
    socket.on('ultrasonic_right', (data) => {
      console.log('Received right ultrasonic data:', data);
      appendUltrasonicDataRight(data);
    });
  
    socket.on('ultrasonic_left', (data) => {
      console.log('Received left ultrasonic data:', data);
      appendUltrasonicDataLeft(data);
    });

    socket.on('temp', (data) => {
      console.log('Received temperature data:', data);
      appendTempData(data);
    });

    socket.on('humid', (data) => {
      console.log('Received humidity data:', data);
      appendHumidData(data);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
    });

    return () => {
      socket.off('ultrasonic_right');
      socket.off('ultrasonic_left');
      socket.off('temp');
      socket.off('humid');
    };
  }, []);

  const sendDirection = (direction) => {
    socket.emit('send-direction', direction);
  };

  const sendArmValue = (value) => {
    socket.emit('send-arm-value', value);
  };

  const sendPinchValue = (value) => {
    socket.emit('send-pinch-value', value);
  }

  useEffect(() => {
    // when any key is pressed handleKeyDown is pressed 
    console.log("key Pressed")
    const handleKeyDown = (event) => {
      try {
        if (event.key === 'a' && keydown.current === false) {
          // sendLeft(); 
          sendDirection('left');
          keydown.current = true;
        }
        else if (event.key === 'd' && keydown.current === false) {
          // sendRight(); 
          sendDirection('right');
          keydown.current = true;
        }
        else if (event.key === 'w' && keydown.current === false) {
          // sendForward(); 
          sendDirection('forward');
          keydown.current = true;
        }
        else if (event.key === 's' && keydown.current === false) {
          // sendBackward();
          sendDirection('backward');
          keydown.current = true;
        }
      } catch (error) {
        console.log(`Error handling keydown: ${event.key}`);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'w' || 
          event.key === 'a' || 
          event.key === 's' || 
          event.key === 'd' 
      ) {
        sendDirection('stop');
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

  const ultrasonicSeriesRight = [
    {
      name: 'Right Ultrasonic Sensor',
      data: ultrasonicDataRight
    }
  ];
  
  const ultrasonicSeriesLeft = [
    {
      name: 'Left Ultrasonic Sensor',
      data: ultrasonicDataLeft
    }
  ];

  const tempSeries = [
    {
      name: 'Temperature Sensor',
      data: tempData
    }
  ];

  const humidSeries = [
    {
      name: 'Humidity Sensor',
      data: humidData
    }
  ];

  const chartOptions = {
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
      <div>
        <h1>Arm Slider</h1>
        <SliderComponent
          min={950}
          max={1600}
          value={value}
          onChange={handleArmChange}
          // onAfterChange={sendArmValue}
        />
      </div>
      <div >
        <h1>Pinch Slider</h1>
        <SliderComponent
          min={600}
          max={1800}
          value={pinchValue}
          onChange={handlePinchChange}
          // onAfterChange={sendPinchValue}
        />
      </div>
      <h1>Control Rover</h1>
      <div>
        <p>W</p>
        <p>A  D</p>
        <p>S</p>
      </div>
      <div>
        <iframe 
          src="http://192.168.1.40/"
          title="camera"
          width="1000"
          height="750"
          style={{ border: '1px solid black' }}
        ></iframe>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ flex: 1, marginRight: '10px' }}>
          <h1>Left Ultrasonic Sensor Data</h1>
          <p>Current Reading: {latestUltrasonicLeft} cm</p>
          <Chart series={ultrasonicSeriesLeft} options={chartOptions} height={350} />
        </div>
        <div style={{ flex: 1, marginLeft: '10px' }}>
          <h1>Right Ultrasonic Sensor Data</h1>
          <p>Current Reading: {latestUltrasonicRight} cm</p>
          <Chart series={ultrasonicSeriesRight} options={chartOptions} height={350} />
        </div>
      </div>
      <div>
        <h1>Temperature Sensor Data</h1>
        <p>Current Reading: {latestTemp} °C</p>
        <Chart series={tempSeries} options={chartOptions} height={350} />
      </div>
      <div>
        <h1>Humidity Sensor Data</h1>
        <p>Current Reading: {latestHumid} %</p>
        <Chart series={humidSeries} options={chartOptions} height={350} />
      </div>
    </div>
  );
};

export default App;