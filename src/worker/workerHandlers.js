import * as THREE from "three";
import { createRoot, extend } from "@react-three/fiber";
import { createPointerEvents, emitter } from "./events";
import App from "../components/workerComponents/App";
import FictionalElement from "../FictionalElement/FictionalElement";


//Create Fictional domElement to add event listeners for orbitControls
export const fictionalDomElement = new FictionalElement();
let root;

extend(THREE);

export const createScene = (payload) => {
  const { props, drawingSurface: canvas, width, height, pixelRatio } = payload;

  root = createRoot(canvas);
  //   fictionalDomElement.setSize(width, height);
  root.configure({
    events: createPointerEvents,
    size: {
      width,
      height,
      updateStyle: false,
    },
    dpr: pixelRatio,
  });

  root.render(<App {...props} />);
};

export const handleEvents = (payload) => {
  emitter.emit(payload.eventName, payload);
  fictionalDomElement.dispatchEvent({
    ...payload,
    target: fictionalDomElement,
    fictionalDomElement,
  });
  emitter.on("disconnect", () => {
    self.postMessage({ type: "dom_events_disconnect" });
  });
};

export const handleResize = ({ width, height }) => {
  if (!root) return;
  fictionalDomElement.setSize(width, height);
  root.configure({
    size: {
      width,
      height,
      updateStyle: false,
    },
  });
};


export const handleProps = (payload) => {
  emitter.emit("props", payload);
};