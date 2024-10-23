import React, { useState, useContext } from "react";
import { FileTreeContext } from "../modelcontext/ModelContext";
import { FiFolder, FiFile } from "react-icons/fi"; // Icons for file/folder
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaFolderClosed } from "react-icons/fa6";
import { SiJavascript, SiGoland, SiHtml5, SiCss3 } from 'react-icons/si'; 
import { FaGolang } from "react-icons/fa6";
import { FaReact } from "react-icons/fa";
import { FaJs } from "react-icons/fa";
import { FaRust } from "react-icons/fa";





const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop(); 

  switch (extension) {
    case 'js':
      return <FaJs size={14} className="text-stone-400" />; 
    case 'jsx':
      return <FaReact size={14} className="text-stone-400" />; 
    case 'go':
      return <FaGolang className="text-stone-400" />;
    case 'rs':
      return <FaRust className="text-stone-400" />;
    case 'html':
      return <SiHtml5 className="text-stone-400" />; 
    case 'css':
      return <SiCss3 className="text-stone-400" />; 
    default:
      return <FiFile className="text-stone-400" />; 
  }
};


const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  const isRoot = path === "";
  const [expanded, setExpanded] = useState(isRoot);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isDir) {
      setExpanded(!expanded);
    } else {
      onSelect(path);
    }
  };
  return (
    <div  className="my-2 ml-3">
      <div
        onClick={handleToggle}
        className="cursor-pointer flex items-center space-x-2 "
      >
        {isDir ? (
          expanded ? (
            <>
              <IoIosArrowDown className="text-[#E9E9EA]" fill="#9E9DA1" />
              <FaFolderClosed className="text-[#E9E9EA]" fill="#9E9DA1"  /> 
            </>
          ) : (
            <>
              <IoIosArrowForward className="text-[#E9E9EA]" fill="#9E9DA1" />
              <FaFolderClosed className="text-[#E9E9EA]" fill="#9E9DA1"  />
            </>
          )
        ) : (
          getFileIcon(fileName) 
        )}
        <p className={isDir ? "" : "file-node"}>{fileName}</p>
      </div>
      {/* If the node is a directory and expanded, render the child nodes */}
      {isDir && expanded && fileName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li className="cursor-pointer text-white ml-3" key={child}>
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
    return (
      <div className="text-white justify-center items-center">
        No files found
      </div>
    );
  }

  return <FileTreeNode onSelect={onSelect} fileName="" path="" nodes={tree} />;
};

export default FileTree;
