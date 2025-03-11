import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/Router/AppRouter";
import NavTemplate from "./components/template/NavBar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavTemplate/>
        <AppRouter/>
      </BrowserRouter>
    </div>
  );
}

export default App;
