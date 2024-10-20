import FileTreeNode from "../components/Tree";
import CodeEditor from "../components/CodeEditor";
import { useContext, useState } from "react";
import TerminalController from "../components/Hyper";
import { FileTreeContext } from "../modelcontext/ModelContext";

function CodeplaygroundPage() {
  const {isTerminalVisible} = useContext(FileTreeContext)
  const [selectedFile, setSelectedFile] = useState("");

  return (
    <div className="flex flex-row h-[100vh] w-[100vw] overflow-hidden relative">
      <div className="bg-[#181818] h-full w-[20%] border-r border-gray-600 overflow-auto">
        <FileTreeNode onSelect={setSelectedFile} />
      </div>
      <div className="flex-grow relative">
        {/* Code editor taking the full height of the viewport */}
        <CodeEditor selectedFile={selectedFile} className="h-full" />

        <div className={`absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out ${isTerminalVisible ? 'h-[35%]' : 'h-[8%]'} border-t-[#3D3E40] border-t  bg-[#141414] z-10 `}>
          <TerminalController />
        </div>
      </div>
    </div>
  );
}

export default CodeplaygroundPage;
