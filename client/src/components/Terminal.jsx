import React, { useState, useEffect } from "react";
import "./Terminal.css";

function Terminal() {
  const [inputValue, setInputValue] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9000/ws');

    ws.onopen = () => {
      setConnection(ws);
      console.log('Connected to the WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'terminal:data') {
        setTerminalOutput((prevOutput) => [...prevOutput, message.data]);
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (connection) {
        connection.send(
          JSON.stringify({
            type: 'terminal:write',
            data: inputValue,
          })
        );
        setTerminalOutput((prevOutput) => [...prevOutput, inputValue]);
        setInputValue("");
        setCursorPosition(terminalOutput.length + 1);
      }
    }
  };

  const handleButtonClick = (index) => {
    // Handle button clicks (e.g., exit, new tab)
  };
  console.log(terminalOutput);

  return (
    <div className="container ">
      <div className="flex items-center justify-center h-8 bg-black">
        
        <p className="user">johndoe@admin</p>
      </div>
      <div className="terminal_body">
        {terminalOutput.map((output, index) => (
          <div key={index}>
          {index % 2 === 0 ? (
            <span>
              <span className="terminal_user">johndoe@admin:</span>
              <span className="terminal_location ">~</span>
              <span className="terminal_bling">$</span>
              <span className="terminal_cursor"></span>
              <span className="terminal_input">{output}</span>
            </span>
          ):(<></>) }
          {index < terminalOutput.length - 1 && index % 2 === 0 && (
            <div className="terminal_response">{terminalOutput[index + 1]}</div>
          )}
        </div>
        ))}
        <div className="terminal_promt items-center">
          <span className="terminal_user">johndoe@admin:</span>
          <span className="terminal_location ">~</span>
          <span className="terminal_bling">$</span>
          <span className="terminal_cursor"></span>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="terminal_input"
          />
        </div>
      </div>
    </div>
  );
}

export default Terminal;