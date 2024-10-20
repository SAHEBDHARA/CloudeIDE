// file-tree-context.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const FileTreeContext = createContext();

const FileTreeProvider = ({ children }) => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState("");
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [fileTabs, setFileTabs] = useState([]);

  const fetchTree = async () => {
    setLoading(true);
    console.log("the files are updating..");
    try {
      const response = await axios.get("http://localhost:9000/get/files");
      setTree(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const onSelect = (path) => {
    console.log(`Selected file: ${path}`);
    setSelectedPath(path);
    setFileTabs((prevTabs) => {
      // Check if the selected file is already open
      const tabExists = prevTabs.some((tab) => tab.path === path);
  
      if (!tabExists) {
        // Add the new tab if it doesn't exist
        return [
          ...prevTabs.map((tab) => ({ ...tab, isActive: false })), // Deactivate all other tabs
          { path, name: path.split('/').pop(), isActive: true }, // Add the new tab and set it as active
        ];
      }
  
      // If the tab already exists, simply set it as active
      return prevTabs.map((tab) => ({
        ...tab,
        isActive: tab.path === path,
      }));
    });
  };

  const updateTree = (newTree) => {
    setTree(newTree);
  };

  // Establish WebSocket connection
  const ws = new WebSocket("ws://localhost:9000/ws");

  useEffect(() => {
    // Listen for file system events
    ws.onopen = () => {
      // setConnection(ws);
      console.log("Connected to the WebSocket server for file");
    };
    ws.onmessage = (event) => {
      // console.log('this is the one event has', event);
      if (event.data) {
        // Update the file tree when a file system event is triggered
        fetchTree();
      }
    };

    // Handle WebSocket errors
    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    // Handle WebSocket close
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }, [ws]);

  const handleCloseTab = (path) => {
    setFileTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.path !== path);
  
      // If the closed tab was active, select another tab or clear the editor
      if (path === selectedPath) {
        if (updatedTabs.length > 0) {
          // Set the first remaining tab as active
          const nextActiveTab = updatedTabs[0].path; // Get the path of the next tab
          setSelectedPath(nextActiveTab); // Set the next tab as active
  
          // Activate the next tab
          return updatedTabs.map((tab) => ({
            ...tab,
            isActive: tab.path === nextActiveTab, // Set the next tab as active
          }));
        } else {
          // No tabs left, clear the editor
          setSelectedPath(null);
        }
      }
  
      // Return the updated tabs with the active state for each
      return updatedTabs.map((tab) => ({
        ...tab,
        isActive: tab.path === selectedPath, // Maintain the active state for other tabs
      }));
    });
  };
  

  const toggleTerminalVisibility = () => {
    setIsTerminalVisible((prev) => !prev);
  };

  return (
    <FileTreeContext.Provider
      value={{
        tree,
        loading,
        onSelect,
        updateTree,
        selectedPath,
        isTerminalVisible,
        toggleTerminalVisibility,
        handleCloseTab,
        fileTabs,
      }}
    >
      {children}
    </FileTreeContext.Provider>
  );
};

export { FileTreeProvider, FileTreeContext };
