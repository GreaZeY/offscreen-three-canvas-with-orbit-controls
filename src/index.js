import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import OffscreenCanvas from "./components/OffscreenCanvas";
import "./styles.css";


const Root = () => {
  return (
    <Suspense fallback={null}>
      <OffscreenCanvas/>
    </Suspense>
  );
};

createRoot(document.getElementById("root")).render(<Root />);
