import * as THREE from "three"
import React, { useRef, Suspense } from "react"
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber"
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
  { 
    uTime: 0, 
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture()
  }, // lower u denotes that its a uniform
  // Vertex shaders run first, it receives attributes
  // and calculates / manipulates the position of each individual vertex
  // it position the vertices of the geometry
  // vertex shader gives us access to uv coordinates
  // Vertex shader
  glsl`
    // varying enables us to send data from vertex shader to fragment shader **********
    precision mediump float;
    varying vec2 vUv;
    varying float vWave;
    uniform float uTime;
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    void main() {
      // uv is globaly accessible for a vertex shader, we assign it to varying variable to send it to fragment shader
      vUv = uv;
      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;
      // gl_Position contains position of the vertex on the screen
      // modelMatrix applies all transformations related to the mesh (scale, rotation, translation all are contained here and applied to the position)
      // viewMatrix applies all transformations related to the camera (scale, rotation, translation all are contained here and applied to the position)
      // projectionMatrix transforms collected coordinates and displaces the final clip space
      // modelViewMatrix is modelMatrix and viewMatrix combined
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,  

  // The fragment (or pixel) shader runs second, it sets the color
  // of each individual "fragment" pixel of the geometry
  // Fragment shader
  glsl`
    precision mediump float;
    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      //vec4 can be used as rgba (red, green, blue, alpha)
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

// use shader material in jsx
extend({ WaveShaderMaterial });

const Wave = () => {
  const ref = useRef();

  const [image] = useLoader(THREE.TextureLoader, [
    "./bear.jpg",
  ]);

  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()))
  return(
    <mesh>
      <planeBufferGeometry args={[0.4, 0.5, 16, 16]} />
      {/* <meshStandardMaterial color="blue" /> */}

      {/* note the lower case when calling our shader */}
      <waveShaderMaterial ref={ref} uColor={"gold"} uTexture={image}/>
  </mesh>
  )
}

const Scene = () => {
  return(
    <Canvas camera={{fov: 10}}>
      <Suspense fallback={null}>
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
