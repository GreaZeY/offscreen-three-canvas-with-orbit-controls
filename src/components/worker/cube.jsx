import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";

function Cube(props) {
  const mesh = useRef();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });

  return (
    
    <RoundedBox
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial
        metalness={1}
        roughness={.2}
        envMapIntensity={1}
        color={hovered ? "teal" : "hotpink"}
      />
    </RoundedBox>
  );
}

const Comp = ({ position }) => {
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 10]} />
      <Environment
        files={"home.hdr"}
        path={"/"}
      />
      <Cube position={position} />
    </>
  );
};

export default Comp;
