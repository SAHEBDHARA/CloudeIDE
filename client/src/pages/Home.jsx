import React from "react";
import { Link } from "react-router-dom";


const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Code Playground</h1>
      <p className="mb-4 text-lg text-gray-600">
        Start coding by going to the playground!
      </p>
      <Link to="/playground">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Playground
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
