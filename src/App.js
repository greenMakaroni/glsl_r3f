import * as THREE from "three"
import React, { useRef, Suspense } from "react"
import { Canvas, extend, useFrame } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro"
import './App.css';

// shader is a small program written in GLSL that runs on the GPU
const WaveShaderMaterial = shaderMaterial(
  // Uniforms provide us a way to send data from javascript
  // to our shader, we can use uniforms in both vertex and fragment shaders
  // use cases, pass mouse position data, time information, colors, textures etc
  // Uniform
  // create uColor prop, set default value to black (0,0,0)
  // we can still pass not default color via jsx prop uColor
  { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0) }, // lower u denotes that its a uniform
  // Vertex shaders run first, it receives attributes
  // and calculates / manipulates the position of each individual vertex
  // it position the vertices of the geometry
  // vertex shader gives us access to uv coordinates
  // Vertex shader
  glsl`
    // varying enables us to send data from vertex shader to fragment shader **********
    varying vec2 vUv; // lower case v lets us know that its a varying
    void main() {
      // uv is globaly accessible for a vertex shader, we assign it to varying variable to send it to fragment shader
      vUv = uv;
      // gl_Position contains position of the vertex on the screen
      // modelMatrix applies all transformations related to the mesh (scale, rotation, translation all are contained here and applied to the position)
      // viewMatrix applies all transformations related to the camera (scale, rotation, translation all are contained here and applied to the position)
      // projectionMatrix transforms collected coordinates and displaces the final clip space
      // modelViewMatrix is modelMatrix and viewMatrix combined
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,  

  // The fragment (or pixel) shader runs second, it sets the color
  // of each individual "fragment" pixel of the geometry
  // Fragment shader
  glsl`
    precision mediump float; // this allows to determine how much precision does gpu uses when calculating floats ("low", "medium", "high")
    
    uniform vec3 uColor;
    uniform float uTime;

    varying vec2 vUv; // vUv = uv; // uv from vertex shader passed via varying
    void main() {
      //vec4 can be used as rgba (red, green, blue, alpha)
      gl_FragColor = vec4(sin(vUv.y + uTime) * uColor, 1.0);
    }
  `
);

// use shader material in jsx
extend({ WaveShaderMaterial });

const Wave = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()))
  return(
    <mesh>
      <planeBufferGeometry args={[3, 5]} />
      {/* <meshStandardMaterial color="blue" /> */}

      {/* note the lower case when calling our shader */}
      <waveShaderMaterial ref={ref} uColor={"gold"}/>
  </mesh>
  )
}

const Scene = () => {
  return(
    <Canvas>
      <Suspense fallback={null}>
        <pointLight position={[10, 10, 10]}/>
        <Wave />
      </Suspense>
    </Canvas>
  )
}

const App = () => {
  return(
    <Scene />
  )
}
 
export default App;
