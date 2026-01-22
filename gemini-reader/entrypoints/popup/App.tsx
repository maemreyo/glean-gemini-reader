import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>Gemini Ultimate Reader</h1>
      </div>
      <div className="card">
        <p>A beautiful reading mode for Gemini with theme switching.</p>
        <p>Theme options: Light, Sepia, Dark, System</p>
      </div>
      <p className="read-the-docs">
        Open gemini.google.com to use the extension
      </p>
    </>
  );
}

export default App;
