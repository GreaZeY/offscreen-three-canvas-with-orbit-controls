import { useEffect, useRef } from "react";
import { DOM_EVENTS } from "./domEvents";

const OffscreenCanvas = ({ onClick, worker, ...props }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!worker) return;

    const canvas = canvasRef.current;
    const offscreen = canvasRef.current.transferControlToOffscreen();

    worker.postMessage(
      {
        type: "init",
        payload: {
          props,
          drawingSurface: offscreen,
          width: canvas.clientWidth,
          height: canvas.clientHeight,
          pixelRatio: window.devicePixelRatio,
        },
      },
      [offscreen]
    );

    Object.values(DOM_EVENTS).forEach(([eventName, passive]) => {
      canvas.addEventListener(
        eventName,
        (event) => {
          if (event.type === "pointerdown")
            console.log(
              "real event",
              event,
              event.target.releasePointerCapture(event.pointerId)
            );
          worker.postMessage({
            type: "dom_events",
            payload: {
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
            },
          });
        },
        { passive }
      );
    });

    const handleResize = () => {
      worker.postMessage({
        type: "resize",
        payload: {
          width: canvas.clientWidth,
          height: canvas.clientHeight,
        },
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [worker]);

  useEffect(() => {
    if (!worker) return;
    worker.postMessage({
      type: "props",
      payload: props,
    });
  }, [props]);

  return <canvas ref={canvasRef} onClick={onClick} />;
};

export default OffscreenCanvas;
