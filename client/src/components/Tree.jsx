import React, { useState, useContext } from 'react';
import { FileTreeContext } from '../modelcontext/ModelContext';
import { FiFolder, FiFile } from 'react-icons/fi'; // Icons for file/folder
// import { FiFolder } from "react-icons/fi";
import { LiaFolderOpenSolid } from "react-icons/lia";




const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes; 
  const [expanded, setExpanded] = useState(true); 

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isDir) {
      setExpanded(!expanded);
    } else {
      onSelect(path);
    }
  };
  return (
    <div style={{ marginLeft: "10px" }}>
      <div
        onClick={handleToggle}
        className="cursor-pointer flex items-center space-x-2"
      >
        {isDir ? (
          expanded ? (
            <LiaFolderOpenSolid className='text-white ' fill='yellow'/>
          ) : (
            <FiFolder className='text-white' fill='yellow' />
          )
        ) : (
          <FiFile className='text-white' fill='red' />
        )}
        <p className={isDir ? "" : "file-node"}>{fileName}</p>
      </div>
      {/* If the node is a directory and expanded, render the child nodes */}
      {isDir && expanded && fileName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li className='cursor-pointer text-white' key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={path + "/" + child}
                fileName={child}
                nodes={nodes[child]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FileTree = () => {
  const { tree, loading, onSelect } = useContext(FileTreeContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tree) {
    return <div>No files found</div>;
  }

  return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
};

export default FileTree;
