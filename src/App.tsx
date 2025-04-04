import React, {useState} from 'react';
import './App.css';

function App() {
    const [loading, setLoading] = useState(false);
    /*useEffect(() => {
        console.log("inside useeffect");
        window.addEventListener("message", messageHandler);

        return () => {
            window.removeEventListener("message", messageHandler);
        };
    }, []); // Empty dependency array means this effect runs only once on mount
    const messageHandler = (event: MessageEvent) => {
        var port = event.ports[0];
        console.log("ports old " + port);
        if (typeof port === 'undefined') {
            console.log("port undefined");
            return;
        }
        port.postMessage("Sending test message from webapp");
        port.onmessage = function (event) {
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
            event.source.postMessage("Hello from PWA!", {targetOrigin: event.origin});
        } else {
            console.error("event.source is null");
        }
    });*/

    const goToPWA = () => {
        setLoading(true);
        //window.location.href = "https://pwapushnew.dev-public.bbpd.io";
    };

    const goToPWA2 = () => {
        setLoading(false);
        //window.location.href = "https://pwapushtestassetlink.dev-public.bbpd.io";
        //src="https://velvety-basbousa-a38cb9.netlify.app/"
    };

    return (
        <div className="App">
            {loading ? (
                <div>
                    <iframe
                        src="https://pwa-iframe.dev-public.bbpd.io"
                        sandbox="allow-same-site-none-cookies"
                        width="100%"
                        height="100%"
                        title="Blackboard PWA"
                    ></iframe>
                </div>
            ) : (
                <header className="App-header">
                    <button onClick={goToPWA}>Go to PWA</button>
                    <button onClick={goToPWA2}>Go to PWA2</button>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            )}
        </div>
    );
}

export default App;
