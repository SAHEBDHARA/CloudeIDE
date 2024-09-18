// file-tree-context.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const FileTreeContext = createContext();

const FileTreeProvider = ({ children }) => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTree = async () => {
    setLoading(true);
    console.log('the files are updating..');
    try {
      const response = await axios.get('http://localhost:9000/get/files');
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
  };

  const updateTree = (newTree) => {
    setTree(newTree);
  };

  // Establish WebSocket connection
  const ws = new WebSocket('ws://localhost:9000/ws');
 
  useEffect(() => {
    // Listen for file system events
    ws.onopen = () => {
        // setConnection(ws);
        console.log('Connected to the WebSocket server for file');
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
      console.error('WebSocket error:', event);
    };

    // Handle WebSocket close
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }, [ws]);

  return (
    <FileTreeContext.Provider value={{ tree, loading, onSelect, updateTree }}>
      {children}
    </FileTreeContext.Provider>
  );
};

export { FileTreeProvider, FileTreeContext };