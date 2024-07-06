import React, { useState, useEffect, useRef } from "react";
import SliderComponent from "./SliderComponent";
import "./App.css";

const App = () => {

  const [messageReceived, setMessageReceived] = useState("");
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

  // For Receving Message
  // Will be used for sensor data
  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessageReceived(data.message));
  }, []);



  // Controls for Rover

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



  // CODE THAT IS BEING RENDERED 

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
        style={{ border: '1px solid black' }}></iframe>
      </div>
    </div>
  );

}

export default App;

