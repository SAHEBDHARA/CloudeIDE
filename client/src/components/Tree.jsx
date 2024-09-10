import React from 'react';
import axios from 'axios';

const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      style={{ marginLeft: "10px" }}
    >
      <p className={isDir ? "" : "file-node"}>{fileName}</p>
      {nodes && fileName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li key={child}>
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
  const [tree, setTree] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const onSelect = (path) => {
    console.log(`Selected file: ${path}`);
  };

  React.useEffect(() => {
    const fetchTree = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:9000/get/files');
        console.log('this is the response', response);
        setTree(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tree) {
    return <div>No files found</div>;
  }

  return <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />;
};

export default FileTree;