import React, { useState, useEffect, useRef } from "react";
import SliderComponent from "./SliderComponent";
import "./App.css";
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

const App = () => {
  const keydown = useRef(false);
  const [value, setValue] = useState(1700);
  const [pinchValue, setPinchValue] = useState(600)
  // constand changing slider value
  const handleArmChange = (newValue) => {
    setValue(newValue);
  };
  const handlePinchChange = (newValue) => {
    setPinchValue(newValue);
  }

  const [temp, setTemp] = useState(null);
  const [ultrasonic, setUltrasonic] = useState(null);

  useEffect(() => {
    // Listen for temperature updates
    socket.on('temp', (data) => {
      setTemp(data);
    });

    // Listen for ultrasonic updates
    socket.on('ultrasonic', (data) => {
      setUltrasonic(data);
    });

    return () => {
      socket.off('temp');
      socket.off('ultrasonic');
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


  // Controls for Rover

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
      }
      catch (error) {
        console.log(`Error handling keydown: {event.key}`)
      }
    }
  
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



  // CODE THAT IS BEING RENDERED 

  return (
    <div className="App">
      <div >
        <h1>Arm Slider</h1>
        <SliderComponent
          min={950}
          max={1700}
          value={value}
          onChange={handleArmChange}
          onAfterChange={sendArmValue}
        />
      </div>
      <div >
        <h1>Pinch Slider</h1>
        <SliderComponent
          min={600}
          max={1800}
          value={pinchValue}
          onChange={handlePinchChange}
          onAfterChange={sendPinchValue}
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
        src="http://192.168.1.40"
        title="camera"
        width="1000"
        height="750"
        style={{ border: '1px solid black' }}></iframe>
      </div>
      <div className="sensor-reading">
          <h4>Temp: {temp}</h4>
          <h4>Distance: {ultrasonic}</h4>
      </div>
    </div>
  );

}

export default App;

