import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messageReceived, setMessageReceived] = useState("");
  const interval = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessageReceived(data.message));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      try {
        if (event.key === 'a' && interval.current === null) {
          interval.current = setInterval(()=>{sendMessageLeft()}, 500); // Set interval to send message every 0.5 seconds
        }
        if (event.key === 'd' && interval.current === null) {
          interval.current = setInterval(()=>{sendMessageRight()}, 500); // Set interval to send message every 0.5 seconds
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
    };
  
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
  }, []);


  const sendMessageLeft = async () => {
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


  const sendMessageRight = async () => {
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


  return (
    <div className="App">
      <h1>{messageReceived}</h1>
      <h1>Send Message to Server</h1>
      <div>
        <button onClick={sendMessageRight}>Right</button>
      </div>
    </div>
  );
}

export default App


// import React, { useState, useEffect, useRef } from 'react';

// function App() {
//   const [message, setMessage] = useState('');
//   const intervalRef = useRef(null);

//   const sendMessage = () => {
//     console.log('Message sent');
//     // You can replace the console.log with your message sending logic
//   };

//   const handleKeyDown = (event) => {
//     // Check if the specific key (e.g., 'a') is pressed
//     if (event.key === 'a' && intervalRef.current === null) {
//       intervalRef.current = setInterval(sendMessage, 500); // Set interval to send message every 0.5 seconds
//     }
//   };

//   const handleKeyUp = (event) => {
//     // Check if the specific key (e.g., 'a') is released
//     if (event.key === 'a' && intervalRef.current !== null) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//       if (intervalRef.current !== null) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <p>Press and hold the "a" key to send a message every 0.5 seconds</p>
//       <p>{message}</p>
//     </div>
//   );
// }

// export default App;
