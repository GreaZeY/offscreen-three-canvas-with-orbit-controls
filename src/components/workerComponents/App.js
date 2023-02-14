import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { emitter } from "../../worker/events";
import { fictionalDomElement } from "../../worker/workerHandlers";
import Cube from "../Cube";

const App = (initialProps) => {
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
      <OrbitControls
        domElement={fictionalDomElement}
        makeDefault
      />
      <Cube {...props} />
    </>
  );
};

export default App;
