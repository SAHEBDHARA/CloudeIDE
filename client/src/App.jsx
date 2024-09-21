import "./App.css";
import Terminal from "./components/Terminal";
import FileTreeNode from "./components/Tree";
import Codepalyground from "./components/Codepalyground";
import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState("");
  
  return (
    <div className="flex flex-row h-[100vh] w-[100vw]">
      <div className="bg-[#181818] h-full w-[20%] border-r border-gray-600">
        <FileTreeNode  />
      </div>
      <div className="flex flex-col w-full h-full">
        <Codepalyground selectedFile={selectedFile} />
        <div className="h-[30%] bg-black">
          <Terminal />
        </div>
      </div>
    </div>
  );
}

export default App;
