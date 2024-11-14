import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import "@fontsource/dancing-script";
import "@fontsource/roboto";
import "@fontsource/merriweather";
import "@fontsource/lato";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
