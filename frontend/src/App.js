import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {

  const [messageReceived, setMessageReceived] = useState("");
  const keydown = useRef(false);

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
        
      }
    }
  
    const handleKeyUp = (event) => {
      if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
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
      const response = await fetch('http://localhost:8000/send-message', {
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
      const response = await fetch('http://localhost:8000/send-message', {
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
      const response = await fetch('http://localhost:8000/send-message', {
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
      const response = await fetch('http://localhost:8000/send-message', {
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
      const response = await fetch('http://localhost:8000/send-message', {
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
      <h3>{messageReceived}</h3>
      <h1>Control Rover</h1>
      <div>
        <p>W</p>
        <p> &lt;-- A  D --&gt;</p>
        <p>S</p>
      </div>
    </div>
  );

}

export default App

