import { Canvas, extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro"
import './App.css';

const WaveShaderMaterial = shaderMaterial(
  // Uniforms provide us a way to send data from javascript
  // to our shader, we can use uniforms in both vertex and fragment shaders
  // use cases, pass mouse position data, time information, colors, textures etc
  // Uniform
  {},
  // Vertex shaders run first, it receives attributes
  // and calculates / manipulates the position of each individual vertex
  // it position the vertices of the geometry
  // Vertex shader
  glsl`
    void main() {
      // gl_Position contains position of the vertex on the screen
      // modelMatrix applies all transformations related to the mesh (scale, rotation, translation all are contained here and applied to the position)
      // viewMatrix applies all transformations related to the camera (scale, rotation, translation all are contained here and applied to the position)
      // projectionMatrix transforms collected coordinates and displaces the final clip space
      // modelViewMatrix is modelMatrix and viewMatrix combined
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0)
    }
  `,  

  // The fragment (or pixel) shader runs second, it sets the color
  // of each individual "fragment" pixel of the geometry
  // Fragment shader
  glsl``
);

// use shader material in jsx
extend({ WaveShaderMaterial });

const Scene = () => {
  return(
    <Canvas>
      <pointLight position={[10, 10, 10]}/>
      <mesh>
        <planeBufferGeometry args={[3, 5]} />
        {/* <meshStandardMaterial color="blue" /> */}

        {/* note the lower case when calling our shader */}
        <waveShaderMaterial />
      </mesh>
    </Canvas>
  )
}

const App = () => {
  return(
    <Scene />
  )
}
 
export default App;
