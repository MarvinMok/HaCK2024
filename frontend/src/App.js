import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {

  const [messageReceived, setMessageReceived] = useState("");
  const interval = useRef(null);

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
    const handleKeyDown = (event) => {
      try {
        if (event.key === 'a' && interval.current === null) {
          interval.current = setInterval(()=>{sendLeft()}, 500); // Set interval to send message every 0.5 seconds
        }
        else if (event.key === 'd' && interval.current === null) {
          interval.current = setInterval(()=>{sendRight()}, 500); 
        }
        else if (event.key === 'w' && interval.current === null) {
          interval.current = setInterval(()=>{sendForward()}, 500); 
        }
        else if (event.key === 's' && interval.current === null) {
          interval.current = setInterval(()=>{sendBackward()}, 500); 
        }
      }
      catch (error) {
        
      }
    }
  
    const handleKeyUp = (event) => {
      if (event.key === 'a' && interval.current !== null) {
        clearInterval(interval.current);
        interval.current = null;
      }
      else if (event.key === 'd' && interval.current !== null) {
        clearInterval(interval.current);
        interval.current = null;
      }
      if (event.key === 'w' && interval.current !== null) {
        clearInterval(interval.current);
        interval.current = null;
      }
      else if (event.key === 's' && interval.current !== null) {
        clearInterval(interval.current);
        interval.current = null;
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

