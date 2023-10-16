import React from "react";
import "./App.css";
// tailwindcss样式引入放在最上面，避免覆盖组件样式
import { BrowserRouter } from "react-router-dom";
import RenderRouter from "./router";
import "./App.scss";
import _ from "lodash";

function App() {
  const body = document.body;
  return (
    <BrowserRouter>
      <RenderRouter />
    </BrowserRouter>
  );
}
export default App;
