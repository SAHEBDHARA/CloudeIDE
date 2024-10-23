import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { FileTreeContext } from "../modelcontext/ModelContext";
import { useContext } from "react";
import { IoCloseOutline } from "react-icons/io5";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeEditor = () => {
  const { selectedPath, fileTabs, onSelect, handleCloseTab } = useContext(FileTreeContext);
  const [theme, setTheme] = useState("monokai");
  const [code, setCode] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);
  const [ws, setWs] = useState(null);

  console.log("thsi is the selected file tabs", fileTabs);
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
  };

  useEffect(() => {
    // Create WebSocket connection
    const websocket = new WebSocket("ws://localhost:9000/ws");

    websocket.onopen = () => {
      console.log("WebSocket connection established");
      setWs(websocket);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
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
          const response = await fetch(
            `http://localhost:9000/get/file/content?path=${encodeURIComponent(
              selectedPath
            )}`
          );
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
    <div className="bg-[#1E1E1E] h-[100%] w-[100%] ">
      <div className="flex border-b border-gray-700">
        {fileTabs.map((tab) => (
          <div
            key={tab.path}
              className={`p-2 mx-2 cursor-pointer transition-colors duration-300 ease-in-out ${
              tab.isActive ? "bg-[#141414] text-white border-b border-b-gray-300" : "text-gray-400"
            }`}
            onClick={() => onSelect(tab.path)}
          >
          <div className="flex flex-row gap-2 justify-center items-center">
          {tab.name}
          {tab.isActive ? <IoCloseOutline
           className=" transition-colors duration-300 ease-in-out" 
           size={22}
           onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the tab selection
            handleCloseTab(tab.path); // Close the tab
          }}
           /> : ""}
          </div>
          </div>
        ))}
      </div>

      <p
        className="text-[#828282] text-[10px] bg-[#141414]"
        style={{ fontFamily: "Fira Code, Consolas, 'Courier New', monospace" }}
      >
        {selectedPath
          ? selectedPath.replace(/^\/|\/+/g, (match, offset) =>
              offset > 0 ? " > " : ""
            )
          : ""}
      </p>

      {selectedPath ? (
        <AceEditor
          mode="javascript"
          theme="twilight"
          name="editor"
          width="100%"
          height="100vh"
          fontSize={16}
          showPrintMargin={false}
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

export default CodeEditor;
