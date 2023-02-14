import { releaseProxy, transfer, transferHandlers, wrap } from "comlink";
import { useEffect, useRef } from "react";
import { DOM_EVENTS } from "./domEvents";

const worker = wrap(new Worker(new URL("../worker/index", import.meta.url)));

const OffscreenCanvas = ({ onClick, ...props }) => {
  const canvasRef = useRef();

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

    // worker.postMessage(
    //   {
    //     type: "init",
    //     payload
    //   },
    worker.createScene(transfer(payload, offscreen));

    Object.values(DOM_EVENTS).forEach(([eventName, passive]) => {
      canvas.addEventListener(
        eventName,
        (event) => {
          if (event.type === "pointerdown")
            event.target.releasePointerCapture(event.pointerId);
          const payload = {
            eventName,
            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: event.offsetX,
            offsetY: event.offsetY,
            x: event.x,
            y: event.y,
            type: eventName,
            pointerType: event.pointerType,
            button: event.button,
            pointerId: event.pointerId,
            deltaY: event.deltaY,
            deltaX: event.deltaX,
          };
          worker.handleEvents(payload);
        },
        { passive }
      );
    });

    const handleResize = () => {
      worker.handleResize({
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      worker[releaseProxy]();
    };
  }, [worker]);

  useEffect(() => {
    if (!worker) return;
    worker.handleProps(props);
  }, [props]);

  return (
    <canvas
      style={{ width: "90vw", aspectRatio: 16 / 9 }}
      ref={canvasRef}
      // onClick={worker.onClick.bind(worker)}
    />
  );
};

export default OffscreenCanvas;
