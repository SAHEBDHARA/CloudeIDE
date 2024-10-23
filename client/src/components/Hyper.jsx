import React, { useState, useEffect, useContext } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { FileTreeContext } from '../modelcontext/ModelContext';
import { IoCloseOutline } from "react-icons/io5";
import { CiCircleChevUp } from "react-icons/ci";

const TerminalController = () => {
  const { isTerminalVisible, toggleTerminalVisibility } = useContext(FileTreeContext);
  const [terminalLineData, setTerminalLineData] = useState([]);
  const [connection, setConnection] = useState(null);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState(''); // Default starting directory
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9000/ws');

    ws.onopen = () => {
      setConnection(ws);
      console.log('Connected to the WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'terminal:data') {
        setCurrentDir(message.currentDir); // Update current directory from the server
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput key={prevData.length}>{message.data}</TerminalOutput>
        ]);
      } else if (message.type === 'terminal:error') {
        setCurrentDir(message.currentDir); // Update current directory from the server
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput key={prevData.length}>`{message.message}`</TerminalOutput>
        ]);
      }
    };

    ws.onerror = () => {
      // setTerminalLineData((prevData) => [
      //   ...prevData,
      //   <TerminalOutput key={prevData.length}>Error occurred while connecting to the WebSocket server.</TerminalOutput>
      // ]);
      console.log('Error occurred while connecting to the WebSocket server. ');
    };

    ws.onclose = () => {
      setConnection(null);
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleInput = (terminalInput) => {
    if (terminalInput.toLowerCase() === "clear") {
      setTerminalLineData([]);
      setCommandHistory([]);
      setHistoryIndex(-1);
      setInput(''); // Clear input after clearing terminal
    } else {
      if (connection) {
        connection.send(
          JSON.stringify({
            type: 'terminal:write',
            data: terminalInput,
          })
        );
        if (terminalInput.startsWith('cd ')) {
          const newDir = terminalInput.split(' ')[1]; // Get the directory name
          if (newDir === '..') {
            const parentDir = currentDir.split('/').slice(0, -1).join('/');
            setCurrentDir(parentDir || '/'); // Ensure we don't end up with an empty string
          } else {
            // Append new directory
            const updatedDir = currentDir.endsWith('/')
              ? `${currentDir}${newDir}`
              : `${currentDir}/${newDir}`; // Append with a slash if needed
            
            // Check if currentDir is not just a root directory
            if (currentDir !== '/' && currentDir !== '~/') {
              setCurrentDir(updatedDir); // Update the current directory
            } else {
              // If it is root, set it directly
              setCurrentDir(`/${newDir}`);
            }
        }
      }
        // Include the current directory in the terminal output
        setTerminalLineData((prevData) => [
          ...prevData,
          <TerminalOutput key={prevData.length}>{`user@~ ${currentDir}: ${terminalInput}`}</TerminalOutput>
        ]);

        setCommandHistory((prev) => [...prev, terminalInput]);
        setHistoryIndex(-1);
        setInput(''); // Clear input after sending
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex((prevIndex) => prevIndex + 1);
        setInput(commandHistory[commandHistory.length - 1 - (historyIndex + 1)]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex((prevIndex) => prevIndex - 1);
        setInput(commandHistory[commandHistory.length - 1 - (historyIndex - 1)]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput(''); // Clear input when at the latest command
      }
    }
  };

  console.log('Current directory:', currentDir);

  return (
    <div className="h-full relative">
      <button
        className="text-white z-10 px-4 py-2 rounded mb-2 absolute right-0 transition-transform duration-300"
        onClick={toggleTerminalVisibility}
      >
        {isTerminalVisible ? <IoCloseOutline size={24} /> : <CiCircleChevUp size={24} />}
      </button>

      {isTerminalVisible && ( 
        <div className="h-full overflow-y-scroll">
          <Terminal
            colorMode={ColorMode.Dark}
            onInput={(value) => {
              setInput(value);
              handleInput(value);
            }}
            prompt={`user@~ ${currentDir}`} 
            input={input}
            onKeyDown={handleKeyDown}
          >
            {terminalLineData}
          </Terminal>
        </div>
      )}
    </div>
  );
};

export default TerminalController;
