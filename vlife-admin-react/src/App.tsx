import React, { useEffect } from "react";
import "./App.css"; // tailwindcss样式引入放在最上面，避免覆盖组件样式
import { BrowserRouter } from "react-router-dom";
import RenderRouter from "./router";
import "./App.scss";
import _ from "lodash";
const APP_TITLE = import.meta.env.VITE_APP_TITLE;

function App() {
  const body = document.body;
  useEffect(() => {
    document.title = APP_TITLE;
  }, [location]);
  return (
    <BrowserRouter>
      <RenderRouter />
    </BrowserRouter>
  );
}
export default App;
