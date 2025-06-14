import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SpeedInsights } from "@vercel/speed-insights/next";

const root = createRoot(document.getElementById("root")!);

function Main() {
  return (
    <>
      <SpeedInsights />
      <App />
    </>
  );
}

root.render(<Main />);
