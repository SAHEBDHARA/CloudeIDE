import "./App.css";
import Terminal from "./components/Terminal";
import Terminals from "./components/Codepalyground";
import Test from "./components/Test";
import Filestructure from "./components/Filestructure";
import Codepalyground from "./components/Codepalyground";

function App() {
  return (
    <div className="flex flex-row h-[100vh] w-[100%]">
      <Filestructure/>
      <div className="flex flex-col w-full h-full">
        <Codepalyground/>
        <Terminal />
      </div>
    </div>
  );
}

export default App;
