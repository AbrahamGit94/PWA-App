import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    useEffect(() => {
        console.log("inside useeffect");
     window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []); // Empty dependency array means this effect runs only once on mount
    const messageHandler = (event: MessageEvent) => {
      var port = event.ports[0];
      if (typeof port === 'undefined') {
          console.log("port undefined");
          return;
      }
      port.postMessage("Test");
      port.onmessage = function(event) {
        console.log("[PostMessage1] Got message: " + event.data);
      };
    };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
