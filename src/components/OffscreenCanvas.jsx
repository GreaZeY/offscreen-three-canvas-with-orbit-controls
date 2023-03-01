import { releaseProxy, transfer, wrap } from "comlink";
import { useEffect, useRef } from "react";
import useAddEvents from "../hooks/useAddEvents";

export const worker = wrap(
  new Worker(new URL("../worker/index", import.meta.url))
);

const OffscreenCanvas = ({ onClick, ...props }) => {
  const canvasRef = useRef();

  useAddEvents(canvasRef, worker);

  useEffect(() => {
    if (!worker) return;

    const canvas = canvasRef.current;
    const offscreen = canvasRef.current.transferControlToOffscreen();
    const payload = {
      props,
      drawingSurface: offscreen,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      pixelRatio: window.devicePixelRatio,
    };

    worker.createScene(transfer(payload, offscreen));

    return () => {
      worker[releaseProxy]();
    };
  }, [worker]);

  useEffect(() => {
    if (!worker) return;
    worker.handleProps(props);
  }, [props]);

  return (
    <canvas style={{ width: "90vw", aspectRatio: 16 / 9 }} ref={canvasRef} />
  );
};

export default OffscreenCanvas;
