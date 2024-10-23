import FileTreeNode from "../components/Tree";
import CodeEditor from "../components/CodeEditor";
import { useContext, useState, useRef } from "react";
import TerminalController from "../components/Hyper";
import { FileTreeContext } from "../modelcontext/ModelContext";

function CodeplaygroundPage() {
  const { isTerminalVisible } = useContext(FileTreeContext);
  const [selectedFile, setSelectedFile] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(15); // Initial width in percentage
  const isResizing = useRef(false); // Track if the user is resizing

  // Handle the mouse down event for dragging
  const handleMouseDown = (e) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle the mouse move event to resize the sidebar
  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100; // Calculate the new width in percentage
    if (newWidth > 10 && newWidth < 50) {
      // Limit the width between 10% and 50%
      setSidebarWidth(newWidth);
    }
  };

  // Stop resizing when the mouse is released
  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-row h-[100vh] w-[100vw] overflow-hidden relative">
      {/* Sidebar with adjustable width */}
      <div
        className="bg-[#223133] h-full border-r border-gray-600 overflow-auto"
        style={{ width: `${sidebarWidth}%` }} // Dynamic width
      >
        <div className="h-10 border-b border-[#433B47]"></div>
        <FileTreeNode onSelect={setSelectedFile} />
      </div>

      {/* Resizer handle */}
      <div
        className="w-1 bg-gray-600 cursor-col-resize"
        onMouseDown={handleMouseDown}
      ></div>

      <div className="flex-grow relative">
        {/* Code editor taking the full height of the viewport */}
        <CodeEditor selectedFile={selectedFile} className="h-full" />

        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out ${
            isTerminalVisible ? "h-[35%]" : "h-[8%]"
          } border-t-[#3D3E40] border-t bg-[#141414] z-10`}
        >
          <TerminalController />
        </div>
      </div>
    </div>
  );
}

export default CodeplaygroundPage;
