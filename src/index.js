import { createRoot } from "react-dom/client";
import { Suspense } from "react";

import "./styles.css";
import App from "./components";

const Root = () => {
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
};

createRoot(document.getElementById("root")).render(<Root />);
