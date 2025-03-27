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
      port.postMessage("Sending test meassage from webapp");
      port.onmessage = function(event) {
        console.log("[PostMessage1] Got message: I have received a message from mobile app" + event.data);
      };
    };

    window.addEventListener("message", (event) => {
        console.log("inside addEventListener");
        console.log("origin " + event.origin);
        console.log("ports " + event.ports[0]);
        //if (event.origin !== "https://your-pwa-url.com") return; // Replace with your domain
        console.log("Message from Android:", event.data);
    
        // Send response back to Android
        if (event.source) {
            event.source.postMessage("Hello from PWA!", { targetOrigin: event.origin });
        } else {
            console.error("event.source is null");
        }
    });

    const goToPWA = () => {
        window.location.href = "https://pwapushnew.dev-public.bbpd.io";
    };

    const goToPWA2 = () => {
        window.location.href = "https://pwapushtestassetlink.dev-public.bbpd.io";
    };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
          <button onClick={goToPWA}>Go to PWA</button>;
          <button onClick={goToPWA2}>Go to PWA2</button>;
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
