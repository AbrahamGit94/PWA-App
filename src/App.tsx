import React, {useState} from 'react';
import './App.css';

function App() {
    const [loading, setLoading] = useState(false);

    const goToPWA = () => {
        setLoading(true);
    };

    const goToPWA2 = () => {
        setLoading(false);
    };

    return (
        <div className="App">
            {loading ? (
                <div>
                    <iframe
                        src="https://mylearn.int.bbpd.io/"
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
