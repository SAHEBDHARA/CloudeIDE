import React, { useState, useEffect } from 'react';

function Test() {
  const [connection, setConnection] = useState(null);
  const [terminalOutput, setTerminalOutput] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9000/ws');

    ws.onopen = () => {
      setConnection(ws);
      console.log('Connected to the WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'terminal:data') {
        setTerminalOutput((prevOutput) => prevOutput + message.data);
      }
    };

    ws.onerror = (event) => {
      console.log('Error occurred while connecting to the WebSocket server');
    };

    ws.onclose = () => {
      setConnection(null);
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = () => {
    if (connection) {
      connection.send(
        JSON.stringify({
          type: 'terminal:write',
          data: inputValue,
        })
      );
      setInputValue('');
    }
  };

  return (
    <div>
      <h1>WebSocket Terminal</h1>
      <textarea
        value={terminalOutput}
        readOnly
        rows={20}
        cols={80}
        style={{ resize: 'none' }}
      />
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a command..."
      />
      <button onClick={handleInputSubmit}>Send</button>
    </div>
  );
}

export default Test;