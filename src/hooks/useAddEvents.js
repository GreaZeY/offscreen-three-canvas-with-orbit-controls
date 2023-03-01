import { useEffect } from 'react';
import {DOM_EVENTS} from '../components/domEvents'

const useAddEvents = (canvasRef, worker) => {

  useEffect(() => {
    if (!worker) return;

    const canvas = canvasRef.current;

    Object.values(DOM_EVENTS).forEach(([eventName, passive]) => {
      canvas.addEventListener(
        eventName,
        (event) => {
            event.preventDefault()
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
        // { passive }
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
    };
  }, [worker]);

  return;
};

export default useAddEvents;
