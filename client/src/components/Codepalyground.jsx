import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { FileTreeContext } from "../modelcontext/ModelContext";
import { useContext } from "react";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools";

const Codepalyground = () => {
  const { selectedPath } = useContext(FileTreeContext);
  const [theme, setTheme] = useState("monokai");
  const [code, setCode] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [ws, setWs] = useState(null);



  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };


  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to send the content
    const id = setTimeout(() => {
      sendContentToBackend(newCode);
    }, 5000); // 5 seconds delay

    setTimeoutId(id);
  };

  const sendContentToBackend = (content) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        type: "file:content",
        path: selectedPath,
        content: content,
      };
      ws.send(JSON.stringify(message));
      console.log("Content sent:", message);
    }
  }

  useEffect(() => {
    // Create WebSocket connection
    const websocket = new WebSocket('ws://localhost:9000/ws');

    websocket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(websocket);
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      websocket.close(); // Cleanup on component unmount
    };
  }, []);


  useEffect(() => {
    // Fetch initial content for the selected file when it changes
    const fetchContent = async () => {
      if (selectedPath) {
        try {
          const response = await fetch(`http://localhost:9000/get/file/content?path=${encodeURIComponent(selectedPath)}`);
          const data = await response.text();
          setCode(data);
        } catch (error) {
          console.error("Error fetching content:", error);
        }
      }
    };

    fetchContent();
  }, [selectedPath]);

  return (
    <div className="bg-[#1E1E1E] h-[100%]">
      <div className="flex flex-row justify-between items-center">
        <p className="text-white">
          {selectedPath ? selectedPath : ""}
        </p>
        {selectedPath && (
          <div className="mr-10">
            <select
              value={theme}
              onChange={handleThemeChange}
              className="p-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
              <option value="github">GitHub</option>
              <option value="monokai">Monokai</option>
              <option value="twilight">Twilight</option>
              <option value="solarized_dark">Solarized Dark</option>
            </select>
          </div>
        )}
      </div>
      {selectedPath ? (
        <AceEditor
          mode="java"
          theme={theme}
          name="editor"
          width="100%"
          height="100%"
          onChange={handleCodeChange}
          value={code}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      ) : (
        <div className="text-center text-gray-400 text-xl mt-20">
          Please select a file to view its content.
        </div>
      )}
    </div>
  );
};

export default Codepalyground;
