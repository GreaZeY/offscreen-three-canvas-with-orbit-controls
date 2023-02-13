import { useState, useEffect } from "react";
import * as THREE from "three";
import { extend, createRoot } from "@react-three/fiber";
import { emitter, createPointerEvents } from "./events";
import Cube from "./cube";
import { OrbitControls } from "@react-three/drei";
import FictionalElement from "../FictionalElement/FictionalElement";

extend(THREE);

//Create Fictional domElement to add event listeners for orbitControls
const domElement = new FictionalElement();
let root;

const CompWrapper = (initialProps) => {
  const [, setStore] = useState({});
  const [props, setProps] = useState(initialProps);

  useEffect(() => {
    emitter.on("props", (p) => {
      setProps(p);
      setStore({ props: p });
    });
    return () => {
      emitter.off("props", setProps);
    };
  }, []);

  return (
    <>
      <OrbitControls domElement={domElement} makeDefault />
      <Cube {...props} />
    </>
  );
};

const handleInit = (payload) => {
  const { props, drawingSurface: canvas, width, height, pixelRatio } = payload;

  root = createRoot(canvas);

  root.configure({
    events: createPointerEvents,
    size: {
      width,
      height,
      updateStyle: false,
    },
    dpr: pixelRatio,
  });

  root.render(<CompWrapper {...props} />);
};

const handleResize = ({ width, height }) => {
  if (!root) return;
  root.configure({
    size: {
      width,
      height,
      updateStyle: false,
    },
  });
};

const handleEvents = (payload) => {
  emitter.emit(payload.eventName, payload);
  domElement.dispatchEvent({
    ...payload,
    target: domElement,
    domElement,
  });
  emitter.on("disconnect", () => {
    self.postMessage({ type: "dom_events_disconnect" });
  });
};

const handleProps = (payload) => {
  emitter.emit("props", payload);
};

const handlerMap = {
  resize: handleResize,
  init: handleInit,
  dom_events: handleEvents,
  props: handleProps,
};

self.onmessage = (event) => {
  const { type, payload } = event.data;
  const handler = handlerMap[type];
  if (handler) handler(payload);
};

self.window = {};

self.document = {
  // domElement:new FictionalElement()
};

domElement.addEventListener("pointerup", (e) => {
  console.log(e);
});
