import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/Home";
import CodeplaygroundPage from "./pages/CodeplaygroundPage";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/playground" element={<CodeplaygroundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
